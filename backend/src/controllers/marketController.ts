import { Request, Response } from 'express';
import axios from 'axios';
import https from 'https';
import prisma from '../prisma';

const DATA_GOV_RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const DATA_GOV_BASE_URL = `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE_ID}`;

// Keep-Alive HTTPS Agent to reuse TLS connections and prevent "stream has been aborted"
const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 15000,
  timeout: 25000,
  maxSockets: 25,
});

// In-memory cache for live government mandi quotes
interface CachedMandiData {
  timestamp: number;
  records: any[];
}
const mandiCache = new Map<string, CachedMandiData>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes fresh cache

// Resilient memory cache: keeps the last successful live records per state indefinitely
const lastGoodStateCache = new Map<string, any[]>();

// Helper to execute axios with retry on socket drops / stream aborts
async function fetchWithRetry(url: string, params: Record<string, any>, retries = 1): Promise<any> {
  try {
    return await axios.get(url, {
      params,
      timeout: 18000, // 18s generous timeout for government NIC servers
      httpsAgent,
    });
  } catch (err: any) {
    if (retries > 0) {
      console.warn(`⚠️ data.gov.in network hiccup (${err.message}). Retrying once after 600ms...`);
      await new Promise((resolve) => setTimeout(resolve, 600));
      return await axios.get(url, {
        params,
        timeout: 20000,
        httpsAgent,
      });
    }
    throw err;
  }
}

export const getMarketPrices = async (req: Request, res: Response) => {
  try {
    const { district, state, commodity, limit = 100 } = req.query;
    const apiKey = process.env.DATA_GOV_IN_API_KEY || process.env.MANDI_API_KEY;

    let cleanDistrict = district ? String(district).trim().replace(/\s+district$/i, '').trim() : '';
    if (cleanDistrict.toLowerCase().includes('amdanga')) {
      cleanDistrict = 'North 24 Parganas';
    }

    const stateKey = state ? String(state).trim() : 'All';
    const districtKey = cleanDistrict || 'All';
    const commodityKey = commodity ? String(commodity).trim() : 'All';
    const cacheKey = `${stateKey}:${districtKey}:${commodityKey}:${limit}`;

    // 1. Check in-memory cache first (instant response, zero government server latency)
    const cached = mandiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS && cached.records.length > 0) {
      console.log(`⚡ Serving ${cached.records.length} Mandi quotes from memory cache for [${cacheKey}]`);
      return res.json(cached.records);
    }

    // 2. Fetch live AGMARKNET data from data.gov.in
    if (apiKey && apiKey.trim().length > 0 && apiKey !== 'YOUR_DATA_GOV_IN_API_KEY_HERE') {
      try {
        const queryParams: Record<string, any> = {
          'api-key': apiKey.trim(),
          format: 'json',
          limit: Number(limit) || 100,
        };

        if (state && String(state).trim().length > 0 && String(state) !== 'All') {
          queryParams['filters[state]'] = String(state).trim();
        }
        if (cleanDistrict && cleanDistrict !== 'All') {
          queryParams['filters[district]'] = cleanDistrict;
        }
        if (commodity && String(commodity).trim().length > 0) {
          queryParams['filters[commodity]'] = String(commodity).trim();
        }

        console.log(`🌾 Querying data.gov.in Mandi API (State: "${stateKey}", District: "${districtKey}")`);
        let response = await fetchWithRetry(DATA_GOV_BASE_URL, queryParams);

        // If district-specific query returned 0 records, relax to state-wide quotes
        if (
          (!response.data || !Array.isArray(response.data.records) || response.data.records.length === 0) &&
          queryParams['filters[district]']
        ) {
          console.log(`⚠️ 0 records for district "${districtKey}". Relaxing query to state-level: "${stateKey}"...`);
          const relaxedParams = { ...queryParams };
          delete relaxedParams['filters[district]'];
          response = await fetchWithRetry(DATA_GOV_BASE_URL, relaxedParams);
        }

        if (response.data && Array.isArray(response.data.records) && response.data.records.length > 0) {
          const liveRecords = response.data.records.map((rec: any, idx: number) => {
            const modalPrice = Number(rec.modal_price) || Number(rec.max_price) || Number(rec.min_price) || 0;
            const minPrice = Number(rec.min_price) || modalPrice;
            const maxPrice = Number(rec.max_price) || modalPrice;

            // Trend calculation: Compare modal price with average of min and max
            const avg = (minPrice + maxPrice) / 2;
            let trend: 'up' | 'down' | 'stable' = 'stable';
            if (modalPrice > avg * 1.02) trend = 'up';
            else if (modalPrice < avg * 0.98) trend = 'down';

            return {
              id: `gov-${rec.state || ''}-${rec.district || ''}-${rec.market || ''}-${rec.commodity || ''}-${idx}`,
              marketName: rec.market || rec.district || 'APMC Mandi',
              market: rec.market || rec.district || 'APMC Mandi',
              district: rec.district || '',
              state: rec.state || '',
              commodity: rec.commodity || '',
              variety: rec.variety || 'Standard',
              price: modalPrice,
              minPrice,
              maxPrice,
              date: rec.arrival_date || new Date().toISOString(),
              source: 'data.gov.in (Official AGMARKNET)',
              isLiveGovData: true,
              crop: {
                name: rec.commodity || 'Agricultural Produce',
              },
              trend,
            };
          });

          // Save to fast cache and resilient state backup
          mandiCache.set(cacheKey, { timestamp: Date.now(), records: liveRecords });
          lastGoodStateCache.set(stateKey, liveRecords);
          if (stateKey !== 'All') {
            lastGoodStateCache.set('All', liveRecords);
          }

          return res.json(liveRecords);
        }
      } catch (govErr: any) {
        console.warn(`⚠️ data.gov.in request issue (${govErr.message}). Engaging resilient cache defense...`);

        // Check if we have cached records for this key (even if TTL passed)
        if (cached && cached.records && cached.records.length > 0) {
          console.log(`🛡️ Serving previous live cache for [${cacheKey}] during government network glitch.`);
          return res.json(cached.records);
        }

        // Check if we have state-level live quotes stored from earlier
        const stateQuotes = lastGoodStateCache.get(stateKey) || lastGoodStateCache.get('West Bengal') || lastGoodStateCache.get('All');
        if (stateQuotes && stateQuotes.length > 0) {
          console.log(`🛡️ Serving resilient state live cache (${stateQuotes.length} quotes) for "${stateKey}".`);
          return res.json(stateQuotes);
        }
      }
    }

    // 3. Fallback to Prisma database if no API key or remote API is unavailable
    let whereClause: any = {};
    if (district && String(district) !== 'All') {
      whereClause.district = String(district);
    }

    let prices = await prisma.marketPrice.findMany({
      where: whereClause,
      include: {
        crop: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: Number(limit) || 50,
    });

    // If district has 0 records in local DB, relax to general produce records so table is never empty!
    if (prices.length === 0) {
      prices = await prisma.marketPrice.findMany({
        include: {
          crop: true,
        },
        orderBy: {
          date: 'desc',
        },
        take: Number(limit) || 50,
      });
    }

    const fallbackRecords = prices.map((item: any) => ({
      ...item,
      market: item.marketName || item.market,
      commodity: item.crop?.name || 'Produce',
      source: 'Local Market Database (Fallback)',
      isLiveGovData: false,
      trend: item.trend || 'stable',
    }));

    res.json(fallbackRecords);
  } catch (error) {
    console.error('Error fetching market prices:', error);
    res.status(500).json({ error: 'Failed to fetch market prices' });
  }
};

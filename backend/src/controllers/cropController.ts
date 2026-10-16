import { Request, Response } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import prisma from '../prisma';

// Cache for dropdown options schema
let cachedOptions: any = null;

/**
 * Returns dropdown options schema (33 States, 652 Districts, Soil Types, Seasons, Irrigation tiers)
 */
export const getCropOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    if (cachedOptions) {
      res.json(cachedOptions);
      return;
    }

    // Check local ai-service directory
    const optionsPath = path.resolve(__dirname, '../../../ai-service/frontend_dropdown_options.json');
    if (fs.existsSync(optionsPath)) {
      const fileData = fs.readFileSync(optionsPath, 'utf-8');
      cachedOptions = JSON.parse(fileData);
      res.json(cachedOptions);
      return;
    }

    // Try fetching from AI microservice if file path not found locally
    const AI_SERVICE_BASE = process.env.CROP_PREDICTION_API_URL 
      ? process.env.CROP_PREDICTION_API_URL.replace(/\/predict\/?$/, '') 
      : 'http://127.0.0.1:8000';

    const resp = await axios.get(`${AI_SERVICE_BASE}/options`, { timeout: 3000 });
    if (resp.data) {
      cachedOptions = resp.data;
      res.json(resp.data);
      return;
    }

    res.status(404).json({ error: 'Dropdown options schema could not be loaded.' });
  } catch (err: any) {
    console.error('Error serving crop options:', err.message);
    res.status(500).json({ error: 'Failed to fetch crop options' });
  }
};

/**
 * Predicts suitable crops using Two-Stage Random Forest AI service + DB enrichment
 */
export const getPrediction = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extract and normalize variables from Frontend Request
    const {
      State, District, Crop_Season, Soil_Type, Cultivated_Area_ha,
      Rainfall_mm, Average_Temperature_C, Irrigation_Availability,
      Soil_Moisture_pct, Soil_pH, Nitrogen_N, Phosphorus_P, Potassium_K,
      top_k,
      // Legacy fields
      Temp, Rainfall, Soil, area, irrigation, season, N_Ratio, P_Ratio, K_Ratio, Humidity, pH
    } = req.body;

    const normalizedDistrict = District || 'Nadia';
    const normalizedState = State || (['Bankura', 'Birbhum', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Malda', 'Murshidabad', 'Nadia', 'Purulia'].includes(normalizedDistrict) ? 'West Bengal' : 'Punjab');

    const modelInput = {
      State: normalizedState,
      District: normalizedDistrict,
      Crop_Season: Crop_Season || season || 'Kharif',
      Soil_Type: Soil_Type || Soil || 'Alluvial plains (proxy)',
      Cultivated_Area_ha: Number(Cultivated_Area_ha || area || 2.0),
      Rainfall_mm: Number(Rainfall_mm || Rainfall || 700.0),
      Average_Temperature_C: Number(Average_Temperature_C || Temp || 28.0),
      Irrigation_Availability: Irrigation_Availability || irrigation || 'High (proxy)',
      Soil_Moisture_pct: Number(Soil_Moisture_pct || Humidity || 25.0),
      Soil_pH: Number(Soil_pH || pH || 7.0),
      Nitrogen_N: Nitrogen_N ?? N_Ratio ?? null,
      Phosphorus_P: Phosphorus_P ?? P_Ratio ?? null,
      Potassium_K: Potassium_K ?? K_Ratio ?? null,
      top_k: top_k ? Number(top_k) : 5,
      // Keep legacy keys for backward-compatibility with old Render model
      Temp: String(Average_Temperature_C || Temp || 28.0),
      Rainfall: String(Rainfall_mm || Rainfall || 700.0),
      Soil: Soil_Type || Soil || 'Alluvial plains (proxy)'
    };

    // 2. Determine target AI Service endpoint
    // Priority: 1. Environment URL (defaults to local FastAPI port 8000), 2. Remote Render Fallback
    const PRIMARY_AI_URL = process.env.CROP_PREDICTION_API_URL || 'http://127.0.0.1:8000/predict';
    const REMOTE_FALLBACK_URL = 'https://crop-model-api.onrender.com/predict';

    console.log('🚀 Sending crop advisory request to AI Service:', modelInput.State, modelInput.District, modelInput.Crop_Season);

    let aiResponse: any = null;
    try {
      // Attempt primary prediction endpoint (Local FastAPI microservice)
      aiResponse = await axios.post(PRIMARY_AI_URL, modelInput, { timeout: 15000 });
    } catch (primaryErr: any) {
      console.warn(`⚠️ Primary AI endpoint (${PRIMARY_AI_URL}) failed: ${primaryErr.message}. Checking fallback...`);
      if (PRIMARY_AI_URL !== REMOTE_FALLBACK_URL) {
        try {
          console.log(`🔄 Attempting remote fallback AI URL: ${REMOTE_FALLBACK_URL}`);
          aiResponse = await axios.post(REMOTE_FALLBACK_URL, modelInput, { timeout: 25000 });
        } catch (fallbackErr: any) {
          throw new Error(`Both primary and fallback AI services failed. Primary: ${primaryErr.message}; Fallback: ${fallbackErr.message}`);
        }
      } else {
        throw primaryErr;
      }
    }

    const aiData = aiResponse.data;
    const topPredictionName: string = aiData.prediction || (aiData.stage2_recommendations?.[0]?.crop_name) || 'Rice';

    // 3. Enrich Top-1 Crop from Database (Preserving original schema for backward compatibility)
    let dbCrop: any = null;
    try {
      dbCrop = await prisma.crop.findFirst({
        where: { name: { equals: topPredictionName, mode: 'insensitive' } }
      });

      if (!dbCrop) {
        const baseName = topPredictionName.split(/[ (/]/)[0];
        if (baseName && baseName !== topPredictionName) {
          dbCrop = await prisma.crop.findFirst({
            where: { name: { contains: baseName, mode: 'insensitive' } }
          });
        }
      }
    } catch (dbErr: any) {
      console.warn('⚠️ Database disconnected, proceeding with AI prediction metadata:', dbErr.message);
    }

    // 4. Enrich Stage 2 Basket of Recommendations with Database Records
    const rawStage2 = aiData.stage2_recommendations || [];
    const enrichedStage2 = await Promise.all(
      rawStage2.map(async (rec: any) => {
        const cName = rec.crop_name;
        let matched: any = null;
        try {
          matched = await prisma.crop.findFirst({
            where: { name: { equals: cName, mode: 'insensitive' } }
          });

          if (!matched) {
            const rootWord = cName.split(/[ (/]/)[0];
            if (rootWord && rootWord.length > 2) {
              matched = await prisma.crop.findFirst({
                where: { name: { contains: rootWord, mode: 'insensitive' } }
              });
            }
          }
        } catch {
          // If database is disconnected, fallback gracefully to AI metadata
        }

        const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(rec.popular_indian_name || cName)}%20agriculture%20crop%20field?width=800&height=600&nologo=true`;

        return {
          ...rec,
          cropDetails: matched ? {
            ...matched,
            imageUrl: matched.imageUrl || aiImageUrl
          } : {
            id: Math.floor(Math.random() * 1000000) + 1000000,
            name: cName,
            imageUrl: aiImageUrl,
            cropType: 'Recommended',
            durationDays: 120
          }
        };
      })
    );

    // 5. Build Final Response for Frontend
    res.json({
      success: true,
      prediction: topPredictionName,
      crop: dbCrop,
      farm_summary: aiData.farm_summary || {
        location: `${modelInput.District}, ${modelInput.State}`,
        season: modelInput.Crop_Season,
        cultivated_area_ha: modelInput.Cultivated_Area_ha,
        soil_type: modelInput.Soil_Type
      },
      stage1_domain: aiData.stage1_domain || [],
      stage2_recommendations: enrichedStage2.length > 0 ? enrichedStage2 : [
        {
          rank: 1,
          crop_name: topPredictionName,
          popular_indian_name: topPredictionName,
          confidence_pct: 90.0,
          expected_yield_tonnes_per_ha: 3.5,
          expected_total_harvest_tonnes: Number((3.5 * modelInput.Cultivated_Area_ha).toFixed(2)),
          cropDetails: dbCrop
        }
      ]
    });

  } catch (err: any) {
    console.error('❌ AI Recommendation Controller Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'AI Model service is warming up or temporarily unavailable. Please verify the AI Service is running.',
      error: err.message
    });
  }
};
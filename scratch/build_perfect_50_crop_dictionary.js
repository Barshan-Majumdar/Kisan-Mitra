const https = require('https');
const fs = require('fs');

const CROP_FILES = {
  'Arecanut': 'Areca Nuts Palm Balamuri Coorg Feb24 A7C 09503.jpg',
  'Arhar/Tur': 'तूर पिकाच्या शेंगा व फुलं Pods & flowers of Pigeon pea (Cajanus cajan).jpg',
  'Bajra': 'Pennisetum glaucum (4657012430).jpg',
  'Banana': 'Starr-130214-1543-Musa acuminata-Cv Rose bunch-Waihee-Maui (24910083220).jpg',
  'Barley': 'Hordeum vulgare in Lancaster, PA-002.jpg',
  'Black pepper': 'Black Pepper berries before drying(Kerala, India).jpg',
  'Cardamom': 'Cardamom pods on plant.jpg',
  'Cashewnut': 'Cashew apple with nut - Caju.jpg',
  'Castor seed': 'Castor beans.jpg',
  'Coriander': 'Coriander Seeds.jpg',
  'Cotton(lint)': 'CSIRO ScienceImage 1366 Cotton boll.jpg',
  'Cowpea(Lobia)': 'Vigna unguiculata habit12.jpg',
  'Dry chillies': 'Pulses Red Chillies Ooty Market Nilgiris Aug25 A7CR 07122.jpg',
  'Dry ginger': 'Fresh ginger rhizome 01.jpg',
  'Garlic': 'Garlic Bulbs (Unsplash).jpg',
  'Gram': 'Chickpea BNC.jpg',
  'Groundnut': 'Peanuts (Arachis hypogaea) - in shell, shell cracked open, shelled, peeled.jpg',
  'Guar seed': 'Cluster bean-guar-Cyamopsis psoralioides-Cyamopsis tetragonolobus-TAMIL NADU73.jpg',
  'Horse-gram': 'Sa-horsegram.jpg',
  'Jowar': 'Sorghum head in India.jpg',
  'Jute': 'Jute field in Bangladesh 01.jpg',
  'Khesari': 'Lathyrus sativus 001.JPG',
  'Linseed': 'From flax to linseed oil..JPG',
  'Maize': 'Corncobs.jpg',
  'Mango': 'Mangos - single and halved.jpg',
  'Masoor': 'Lentils red and brown.jpg',
  'Mesta': 'Roselle (Hibiscus sabdariffa) 2.jpg',
  'Moong(Green Gram)': 'Mung beans (Vigna radiata).jpg',
  'Moth': 'Matki.JPG',
  'Niger seed': 'Guizotia abyssinica niger.jpg',
  'Onion': 'Red Onion on White.JPG',
  'Papaya': 'Carica papaya 14 7 2012.jpg',
  'Peas & beans (Pulses)': 'Two Peas in a Pod, Barnes - geograph.org.uk - 2251927.jpg',
  'Potato': 'Patates.jpg',
  'Ragi': 'Eleusine coracana MHNT.BOT.2015.34.17.jpg',
  'Rapeseed &Mustard': 'கடுகுச்செடி 1(Brassica juncea).jpg',
  'Rice': 'Sunrise on paddy fields near Eluru (4).jpg',
  'Safflower': 'करडई या गळीत पिकाची फुल Flowers of oil producing crop Safflower (Carthamus tinctorius).jpg',
  'Sannhamp': 'Sunn Hemp Blossom.jpg',
  'Sesamum': 'Sa white sesame seeds.jpg',
  'Small millets': 'Indian millets commonly used in kitchen.jpg',
  'Soyabean': 'Soybean.USDA.jpg',
  'Sugarcane': 'Sugarcane field of Kachirapalayam.jpg',
  'Sunflower': 'Common sunflower (Helianthus annuus).jpg',
  'Sweet potato': 'Ipomoea batatas - Tubers.jpg',
  'Tapioca': 'Manihot esculenta dsc07325.jpg',
  'Tobacco': 'Starr-130913-1161-Nicotiana tabacum-flowers and leaves-NW Lake-Laysan (24593242194).jpg',
  'Turmeric': 'Curcuma longa roots.jpg',
  'Urad': 'Black gram.jpg',
  'Wheat': 'Wheat (Triticum aestivum L.) at Nöbbelöv.jpg'
};

function fetchThumb(title, width = 960) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
    https.get(url, { headers: { 'User-Agent': 'KisanMitra/1.0 (contact@kisanmitra.org)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const page = Object.values(parsed.query.pages)[0];
          if (page && page.imageinfo && page.imageinfo[0]) {
            resolve(page.imageinfo[0].thumburl || page.imageinfo[0].url);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function verifyUrl(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      resolve({ status: res.statusCode, contentType: res.headers['content-type'], size: res.headers['content-length'] });
    }).on('error', err => resolve({ error: err.message }));
  });
}

async function main() {
  console.log(`Resolving exact 960px verified thumbnail URLs for all ${Object.keys(CROP_FILES).length} benchmark crops...`);
  const finalMap = {};
  let successCount = 0;

  for (const [cropName, fileName] of Object.entries(CROP_FILES)) {
    let thumbUrl = await fetchThumb(fileName, 960);
    if (!thumbUrl) {
      console.warn(`[WARN] Could not fetch thumb for ${fileName}, trying fallback search...`);
    }

    if (thumbUrl) {
      const check = await verifyUrl(thumbUrl);
      if (check.status === 200) {
        console.log(`[PASS] ${cropName.padEnd(22)} -> HTTP 200 (${check.contentType}) size=${check.size}`);
        finalMap[cropName] = {
          cropName,
          fileName,
          url: thumbUrl
        };
        successCount++;
      } else {
        console.error(`[FAIL] ${cropName} -> Status ${check.status} (${thumbUrl})`);
      }
    }
  }

  console.log(`\nVerified ${successCount}/${Object.keys(CROP_FILES).length} crops.`);
  fs.writeFileSync('d:/Kisan-Mitra/scratch/final_50_crop_verified_urls.json', JSON.stringify(finalMap, null, 2));
}

main();

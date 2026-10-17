const https = require('https');
const fs = require('fs');

const crops = [
  { name: 'Arecanut', wiki: 'Areca_catechu', popular: 'Supari / Betel Nut' },
  { name: 'Arhar/Tur', wiki: 'Pigeon_pea', popular: 'Toor Dal / Pigeon Pea' },
  { name: 'Bajra', wiki: 'Pearl_millet', popular: 'Pearl Millet / Bajra' },
  { name: 'Banana', wiki: 'Banana', popular: 'Banana / Kela' },
  { name: 'Barley', wiki: 'Barley', popular: 'Barley / Jau' },
  { name: 'Black pepper', wiki: 'Black_pepper', popular: 'Black Pepper / Kali Mirch' },
  { name: 'Cardamom', wiki: 'Cardamom', popular: 'Cardamom / Elaichi' },
  { name: 'Cashewnut', wiki: 'Cashew', popular: 'Cashew Nut / Kaju' },
  { name: 'Castor seed', wiki: 'Ricinus', popular: 'Castor / Arandi' },
  { name: 'Coriander', wiki: 'Coriander', popular: 'Coriander / Dhania' },
  { name: 'Cotton(lint)', wiki: 'Gossypium_hirsutum', popular: 'Cotton / Kapas' },
  { name: 'Cowpea(Lobia)', wiki: 'Cowpea', popular: 'Cowpea / Lobia' },
  { name: 'Dry chillies', wiki: 'Chili_pepper', popular: 'Red Chilli / Lal Mirch' },
  { name: 'Dry ginger', wiki: 'Ginger', popular: 'Ginger / Adrak / Sonth' },
  { name: 'Garlic', wiki: 'Garlic', popular: 'Garlic / Lahsun' },
  { name: 'Gram', wiki: 'Chickpea', popular: 'Chickpea / Chana' },
  { name: 'Groundnut', wiki: 'Peanut', popular: 'Peanut / Groundnut / Moongphali' },
  { name: 'Guar seed', wiki: 'Guar', popular: 'Cluster Bean / Guar' },
  { name: 'Horse-gram', wiki: 'Macrotyloma_uniflorum', popular: 'Horse Gram / Kulthi' },
  { name: 'Jowar', wiki: 'Sorghum_bicolor', popular: 'Sorghum / Jowar' },
  { name: 'Jute', wiki: 'Jute', popular: 'Jute / Patson' },
  { name: 'Khesari', wiki: 'Lathyrus_sativus', popular: 'Grass Pea / Khesari' },
  { name: 'Linseed', wiki: 'Flax', popular: 'Flaxseed / Linseed / Alsi' },
  { name: 'Maize', wiki: 'Maize', popular: 'Corn / Maize / Makka' },
  { name: 'Mango', wiki: 'Mango', popular: 'Mango / Aam' },
  { name: 'Masoor', wiki: 'Lentil', popular: 'Red Lentil / Masoor' },
  { name: 'Mesta', wiki: 'Roselle_(plant)', popular: 'Roselle / Mesta' },
  { name: 'Moong(Green Gram)', wiki: 'Mung_bean', popular: 'Mung Bean / Moong' },
  { name: 'Moth', wiki: 'Vigna_aconitifolia', popular: 'Moth Bean / Matki' },
  { name: 'Niger seed', wiki: 'Guizotia_abyssinica', popular: 'Niger Seed / Ramtil' },
  { name: 'Onion', wiki: 'Onion', popular: 'Onion / Pyaz' },
  { name: 'Papaya', wiki: 'Papaya', popular: 'Papaya / Papita' },
  { name: 'Peas & beans (Pulses)', wiki: 'Pea', popular: 'Green Peas / Matar' },
  { name: 'Potato', wiki: 'Potato', popular: 'Potato / Aloo' },
  { name: 'Ragi', wiki: 'Eleusine_coracana', popular: 'Finger Millet / Ragi' },
  { name: 'Rapeseed &Mustard', wiki: 'Mustard_seed', popular: 'Mustard / Sarson / Rai' },
  { name: 'Rice', wiki: 'Rice', popular: 'Rice / Paddy / Dhan' },
  { name: 'Safflower', wiki: 'Safflower', popular: 'Safflower / Kusum' },
  { name: 'Sannhamp', wiki: 'Crotalaria_juncea', popular: 'Sunn Hemp / Sanai' },
  { name: 'Sesamum', wiki: 'Sesame', popular: 'Sesame / Til' },
  { name: 'Small millets', wiki: 'Millet', popular: 'Millets / Kodo / Kutki' },
  { name: 'Soyabean', wiki: 'Soybean', popular: 'Soybean / Soyabean' },
  { name: 'Sugarcane', wiki: 'Sugarcane', popular: 'Sugarcane / Ganna' },
  { name: 'Sunflower', wiki: 'Helianthus_annuus', popular: 'Sunflower / Surajmukhi' },
  { name: 'Sweet potato', wiki: 'Sweet_potato', popular: 'Sweet Potato / Shakarkand' },
  { name: 'Tapioca', wiki: 'Cassava', popular: 'Cassava / Tapioca / Sabudana' },
  { name: 'Tobacco', wiki: 'Nicotiana_tabacum', popular: 'Tobacco / Tambaku' },
  { name: 'Turmeric', wiki: 'Turmeric', popular: 'Turmeric / Haldi' },
  { name: 'Urad', wiki: 'Vigna_mungo', popular: 'Black Gram / Urad' },
  { name: 'Wheat', wiki: 'Wheat', popular: 'Wheat / Gehun' }
];

function fetchSummary(title) {
  return new Promise((resolve, reject) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const options = {
      headers: {
        'User-Agent': 'KisanMitraAgriculturalBot/1.0 (https://github.com/Barshan-Majumdar/Kisan-Mitra; contact@kisanmitra.gov.in)'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log(`Starting Wikipedia image verification for ${crops.length} benchmark crops...`);
  const results = {};

  for (const c of crops) {
    try {
      const summary = await fetchSummary(c.wiki);
      if (summary && summary.thumbnail && summary.thumbnail.source) {
        // High quality standard URL from thumbnail by adjusting width to 800px
        let imgUrl = summary.thumbnail.source;
        // e.g. /thumb/.../320px-... -> replace /320px- with /800px-
        imgUrl = imgUrl.replace(/\/\d+px-/, '/800px-');
        
        results[c.name] = {
          cropName: c.name,
          popular: c.popular,
          wikiArticle: c.wiki,
          title: summary.title,
          description: summary.description,
          imageUrl: imgUrl
        };
        console.log(`[OK] ${c.name} -> ${summary.description || summary.title}: ${imgUrl.substring(0, 70)}...`);
      } else {
        console.warn(`[WARN] No thumbnail for ${c.name} (${c.wiki})`);
      }
    } catch (e) {
      console.error(`[ERR] ${c.name}:`, e.message);
    }
    // slight delay
    await new Promise(r => setTimeout(r, 100));
  }

  fs.writeFileSync('d:/Kisan-Mitra/scratch/wikipedia_verified_crops.json', JSON.stringify(results, null, 2));
  console.log(`\nVerification complete! Saved ${Object.keys(results).length}/${crops.length} to scratch/wikipedia_verified_crops.json`);
}

run();

const https = require('https');
const fs = require('fs');

const crops = {
  "Arecanut": "Areca catechu palm",
  "Arhar/Tur": "Cajanus cajan pod",
  "Bajra": "Pennisetum glaucum field",
  "Banana": "Musa acuminata bunch",
  "Barley": "Hordeum vulgare grain",
  "Black pepper": "Piper nigrum berries",
  "Cardamom": "Elettaria cardamomum pods",
  "Cashewnut": "Cashew apple nut",
  "Castor seed": "Ricinus communis seed",
  "Coriander": "Coriander seeds",
  "Cotton(lint)": "Gossypium bolls field",
  "Cowpea(Lobia)": "Vigna unguiculata pod",
  "Dry chillies": "Dried red chillies India",
  "Dry ginger": "Ginger rhizome",
  "Garlic": "Garlic bulbs",
  "Gram": "Cicer arietinum chickpeas",
  "Groundnut": "Peanuts in shell",
  "Guar seed": "Cyamopsis tetragonoloba guar",
  "Horse-gram": "Macrotyloma uniflorum horsegram",
  "Jowar": "Sorghum bicolor head",
  "Jute": "Corchorus capsularis jute",
  "Khesari": "Lathyrus sativus grass pea",
  "Linseed": "Flax seeds linseed",
  "Maize": "Zea mays cobs field",
  "Mango": "Mangifera indica tree fruit",
  "Masoor": "Lens culinaris red lentil",
  "Mesta": "Hibiscus sabdariffa roselle",
  "Moong(Green Gram)": "Vigna radiata mung bean",
  "Moth": "Vigna aconitifolia moth bean",
  "Niger seed": "Guizotia abyssinica niger seed",
  "Onion": "Red onion bulbs",
  "Papaya": "Carica papaya tree fruit",
  "Peas & beans (Pulses)": "Green peas in pod",
  "Potato": "Solanum tuberosum harvested potatoes",
  "Ragi": "Eleusine coracana finger millet",
  "Rapeseed &Mustard": "Brassica juncea mustard field",
  "Rice": "Paddy rice field India",
  "Safflower": "Carthamus tinctorius safflower flower",
  "Sannhamp": "Crotalaria juncea sunn hemp",
  "Sesamum": "Sesamum indicum seeds",
  "Small millets": "Kodo millet foxtail",
  "Soyabean": "Soybean pods on plant",
  "Sugarcane": "Sugarcane field India",
  "Sunflower": "Helianthus annuus sunflower bloom",
  "Sweet potato": "Ipomoea batatas tubers sweet potato",
  "Tapioca": "Cassava roots manihot esculenta",
  "Tobacco": "Nicotiana tabacum leaves plant",
  "Turmeric": "Curcuma longa turmeric rhizomes",
  "Urad": "Vigna mungo black gram",
  "Wheat": "Triticum aestivum wheat ears field"
};

async function fetchPhoto(cropKey, term) {
  return new Promise((resolve) => {
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(term + ' filetype:bitmap') + '&gsrnamespace=6&gsrlimit=2&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json';
    const req = https.get(url, { headers: { 'User-Agent': 'KisanMitra/1.0 (contact@kisanmitra.in)' } }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          const pages = j.query?.pages;
          if (pages) {
            for (const p of Object.values(pages)) {
              const info = p.imageinfo?.[0];
              if (info && (info.thumburl || info.url)) {
                return resolve({
                  cropKey,
                  title: p.title,
                  url: info.thumburl || info.url
                });
              }
            }
          }
          resolve({ cropKey, error: 'No image found' });
        } catch (e) {
          resolve({ cropKey, error: e.message });
        }
      });
    });
    req.on('error', e => resolve({ cropKey, error: e.message }));
  });
}

async function main() {
  console.log('Fetching verified real photographic representations for all 50 crops...');
  const results = {};
  for (const [cropKey, term] of Object.entries(crops)) {
    const res = await fetchPhoto(cropKey, term);
    results[cropKey] = res;
    console.log(cropKey, '=>', res.title, ':', res.url ? 'FOUND' : 'MISSING');
  }
  fs.writeFileSync('scratch/crop_commons_urls.json', JSON.stringify(results, null, 2));
  console.log('Saved to scratch/crop_commons_urls.json');
}

main();

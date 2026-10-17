const https = require('https');

const testUrls = [
  // Wikimedia direct upload URLs:
  'https://upload.wikimedia.org/wikipedia/commons/1/17/Sugarcane_field_of_Kachirapalayam.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/3/38/Ipomoea_batatas_-_Tubers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/69/Sa_white_sesame_seeds.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/89/Chickpea_BNC.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/6/6f/Black_gram.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/8/86/Mung_beans_%28Vigna_radiata%29.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/46/Jute_field_in_Bangladesh_01.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/42/CSIRO_ScienceImage_1366_Cotton_boll.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/90/Sorghum_head_in_India.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/d/d3/Indian_millets_commonly_used_in_kitchen.jpg'
];

function check(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
      resolve({ url: url.split('/').pop(), status: res.statusCode, type: res.headers['content-type'], len: res.headers['content-length'] });
    }).on('error', e => resolve({ url: url.split('/').pop(), error: e.message }));
  });
}

async function run() {
  for (const u of testUrls) {
    const res = await check(u);
    console.log(`${res.url} -> ${res.status} (${res.type}) size=${res.len}`);
  }
}

run();

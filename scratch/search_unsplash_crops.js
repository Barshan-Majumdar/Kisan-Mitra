const https = require('https');

function searchUnsplash(query) {
  return new Promise((resolve) => {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`;
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.results || []);
        } catch (e) {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
  });
}

async function test() {
  const queries = [
    'sugarcane stalks',
    'sweet potato tuber',
    'sesame seeds bowl',
    'chickpeas chana',
    'cotton boll',
    'sunflower field',
    'barley grain'
  ];

  for (const q of queries) {
    const results = await searchUnsplash(q);
    console.log(`\n=== Query: "${q}" (found ${results.length}) ===`);
    for (const r of results.slice(0, 3)) {
      console.log(`ID: ${r.id} | Alt: ${r.alt_description} | Desc: ${r.description}`);
      console.log(`URL: ${r.urls.regular}`);
    }
  }
}

test();

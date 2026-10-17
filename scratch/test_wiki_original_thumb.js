const https = require('https');

const sampleCrops = ['Sugarcane', 'Sweet_potato', 'Sesame', 'Chickpea'];

sampleCrops.forEach(crop => {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${crop}`;
  https.get(url, { headers: { 'User-Agent': 'KisanMitra/1.0 (contact@kisanmitra.org)' } }, res => {
    let d = '';
    res.on('data', chunk => d += chunk);
    res.on('end', () => {
      const j = JSON.parse(d);
      console.log(`\n=== ${crop} ===`);
      console.log('Original thumbnail URL:', j.thumbnail ? j.thumbnail.source : 'None');
      
      // Let's test if this original thumbnail URL returns 200 OK!
      if (j.thumbnail && j.thumbnail.source) {
        https.get(j.thumbnail.source, { headers: { 'User-Agent': 'KisanMitra/1.0 (contact@kisanmitra.org)' } }, imgRes => {
          console.log(`Original thumb HTTP Status: ${imgRes.statusCode} (${imgRes.headers['content-type']})`);
        });
      }
    });
  });
});

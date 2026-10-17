const http = require('http');

const data = JSON.stringify({
  State: 'West Bengal',
  District: 'Murshidabad',
  Crop_Season: 'Kharif',
  Cultivated_Area_ha: 2.5,
  Rainfall_mm: 850,
  Average_Temperature_C: 28,
  top_k: 5
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/crops/predict-crop',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      console.log('Status code:', res.statusCode);
      const stage2 = parsed.stage2_recommendations || [];
      console.log(`Received ${stage2.length} stage 2 recommendations:`);
      const seenImages = new Set();
      let hasDuplicates = false;

      stage2.forEach((rec, idx) => {
        const img = rec.cropDetails?.imageUrl;
        console.log(`  #${idx+1}: ${rec.crop_name} (${rec.popular_indian_name})`);
        console.log(`      Image: ${img}`);
        if (seenImages.has(img)) {
          hasDuplicates = true;
          console.error(`      ⚠️ DUPLICATE IMAGE DETECTED for ${rec.crop_name}!`);
        }
        seenImages.add(img);
      });

      if (!hasDuplicates) {
        console.log('🎉 SUCCESS: All recommended crops have distinct, unique images!');
      } else {
        console.error('❌ FAILED: Duplicate images detected.');
      }
    } catch (e) {
      console.error('Error parsing response:', e, body);
    }
  });
});

req.on('error', (e) => console.error('Request failed:', e.message));
req.write(data);
req.end();

const http = require('http');

// Simple 1x1 test red pixel jpeg base64
const dummyBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

const data = JSON.stringify({
  image: dummyBase64,
  userEmail: 'demo@agriculture.com'
});

console.log('🧪 Testing POST /api/disease/predict...');
const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/disease/predict',
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
      console.log('Crop:', parsed.crop, '| Disease:', parsed.disease);
      console.log('Chemical treatment:', parsed.chemicalTreatment);
      console.log('Organic treatment:', parsed.organicTreatment);
      console.log('History ID:', parsed.historyId);

      const hasAtChemical = parsed.chemicalTreatment?.includes('@');
      const hasAtOrganic = parsed.organicTreatment?.includes('@');

      if (hasAtChemical || hasAtOrganic) {
        console.error('❌ FAILED: Found "@" in treatment suggestions!');
      } else {
        console.log('✅ PASSED: No "@" symbols in suggestions!');
      }

      // Now test GET /api/disease/history
      console.log('\n🧪 Testing GET /api/disease/history?userEmail=demo@agriculture.com...');
      http.get('http://localhost:3000/api/disease/history?userEmail=demo@agriculture.com', (hRes) => {
        let hBody = '';
        hRes.on('data', c => hBody += c);
        hRes.on('end', () => {
          const hParsed = JSON.parse(hBody);
          console.log(`History status: ${hRes.statusCode}`);
          console.log(`History count: ${hParsed.history?.length}`);
          if (hParsed.history?.length > 0) {
            const latest = hParsed.history[0];
            console.log(`Latest saved in history: ID #${latest.id} - ${latest.crop} (${latest.disease})`);
            console.log('✅ PASSED: Disease detection history is saved and retrieved successfully!');
          } else {
            console.error('⚠️ Notice: No history records returned');
          }
        });
      });
    } catch (e) {
      console.error('Error parsing response:', e, body);
    }
  });
});

req.on('error', e => console.error('Request failed:', e.message));
req.write(data);
req.end();

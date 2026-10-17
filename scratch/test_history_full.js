const http = require('http');

http.get('http://localhost:3000/api/crops/recommendation-history', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    const j = JSON.parse(data);
    console.log(`Success: ${j.success}, Count: ${j.history ? j.history.length : 0}`);
    if (j.history && j.history.length > 0) {
      console.log('Sample history crop:', j.history[0].recommendedCrops[0]?.crop_name);
      console.log('Sample image URL:', j.history[0].recommendedCrops[0]?.cropDetails?.imageUrl);
    }
  });
}).on('error', err => {
  console.error('Request error:', err.message);
});

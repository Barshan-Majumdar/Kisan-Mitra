const https = require('https');

const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Sugarcane_field_of_Kachirapalayam.jpg/800px-Sugarcane_field_of_Kachirapalayam.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Ipomoea_batatas_-_Tubers.jpg/800px-Ipomoea_batatas_-_Tubers.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Sa_white_sesame_seeds.jpg/800px-Sa_white_sesame_seeds.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Chickpea_BNC.jpg/800px-Chickpea_BNC.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Jute_field_in_Bangladesh_01.jpg/800px-Jute_field_in_Bangladesh_01.jpg'
];

urls.forEach(url => {
  const req = https.get(url, {
    headers: {
      'User-Agent': 'KisanMitraApp/1.0 (https://kisanmitra.gov.in; contact@kisanmitra.org)'
    }
  }, res => {
    console.log(`${url.split('/').slice(-2).join('/')} -> ${res.statusCode} (${res.headers['content-type']}) length=${res.headers['content-length']}`);
  });
  req.on('error', e => console.error(e.message));
});

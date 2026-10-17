const https = require('https');

const testUrls = [
  'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=800&auto=format&fit=crop&q=80',
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Jute_-_Kolkata_2003-10-31_00538.JPG/960px-Jute_-_Kolkata_2003-10-31_00538.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail'
];

testUrls.forEach(u => {
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    console.log(`${u.substring(0, 50)}... -> HTTP ${res.statusCode} (${res.headers['content-type']}) len=${res.headers['content-length']}`);
  });
});

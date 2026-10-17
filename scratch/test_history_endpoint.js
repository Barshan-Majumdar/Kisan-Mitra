const http = require('http');

http.get('http://localhost:3000/api/crops/recommendation-history?userEmail=test@example.com', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data.substring(0, 200)}...`);
  });
}).on('error', err => {
  console.error('Request error:', err.message);
});

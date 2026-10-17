const https = require('https');

function getWikiMediaThumb(title, width = 640) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
    https.get(url, { headers: { 'User-Agent': 'KisanMitra/1.0 (contact@kisanmitra.org)' } }, res => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        try {
          const j = JSON.parse(d);
          const pages = j.query.pages;
          const page = Object.values(pages)[0];
          if (page && page.imageinfo && page.imageinfo[0]) {
            resolve(page.imageinfo[0].thumburl);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });
  });
}

async function run() {
  const files = [
    'Sugarcane field of Kachirapalayam.jpg',
    'Ipomoea batatas - Tubers.jpg',
    'Sa white sesame seeds.jpg',
    'Chickpea BNC.jpg',
    'Black gram.jpg'
  ];

  for (const f of files) {
    const thumbUrl = await getWikiMediaThumb(f, 600);
    console.log(`\nFile: ${f}`);
    console.log(`Thumb: ${thumbUrl}`);
    if (thumbUrl) {
      https.get(thumbUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
        console.log(`Status: ${r.statusCode} (${r.headers['content-type']}) len=${r.headers['content-length']}`);
      });
    }
  }
}

run();

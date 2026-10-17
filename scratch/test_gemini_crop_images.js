const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: 'd:/Kisan-Mitra/backend/.env' });

const apiKey = process.env.GEMINI_CROP_API_KEY || process.env.GEMINI_API_KEY;
console.log('API Key available:', Boolean(apiKey));

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-flash'];

  for (const modelName of modelsToTry) {
    try {
      console.log(`\nTesting model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `You are an expert agricultural botanist.
For each of the following crops:
1. Sugarcane (Ganna)
2. Sweet potato (Shakarkand)
3. Sesame (Til)
4. Rice (Dhan)
5. Cotton (Kapas)

Provide a valid, direct, publicly accessible, authentic high-resolution image URL showing the real harvested produce or crop.
Return STRICT JSON array with format:
[
  { "crop": "Sugarcane", "imageUrl": "https://..." },
  { "crop": "Sweet potato", "imageUrl": "https://..." }
]
Only output valid JSON.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log(`Response from ${modelName}:`);
      console.log(text);
      break;
    } catch (e) {
      console.error(`Error with ${modelName}:`, e.message);
    }
  }
}

test();

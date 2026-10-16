import { Request, Response } from 'express';
import axios from 'axios';
import prisma from '../prisma'; // Ensure this path points to your prisma client instance

export const getPrediction = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extract variables from Frontend Request
    // Ensure your Frontend sends these exact names
    const { Temp, Rainfall, District, Soil } = req.body;

    // 2. Prepare data for Render
    // These keys must match what your Python app.py expects
    const modelInput = {
      Temp: String(Temp || 25),
      Rainfall: String(Rainfall || 0),
      District: District || "Unknown",
      Soil: Soil || "Unknown"
    };

    // 3. ML Model Service URL (configurable via env)
    const RENDER_API_URL = process.env.CROP_PREDICTION_API_URL || 'https://crop-model-api.onrender.com/predict';

    console.log("🚀 Sending data to Render AI Service:", modelInput);

    // 4. Send request to Render
    const response = await axios.post(RENDER_API_URL, modelInput);
    
    // 5. Get the prediction string
    const prediction = response.data.prediction;

    if (!prediction) {
       res.status(500).json({ success: false, message: "No prediction received from AI" });
       return;
    }

    console.log("✅ AI Answer:", prediction);

    // 6. Database Lookup (Preserving your original logic)
    // Find the crop in your DB to get image/details
    let dbCrop = await prisma.crop.findFirst({
      where: { name: { equals: prediction, mode: 'insensitive' } }
    });

    // Fallback: Fuzzy match if exact name not found
    if (!dbCrop) {
      const baseName = prediction.split(/[ (]/)[0];
      if (baseName && baseName !== prediction) {
        dbCrop = await prisma.crop.findFirst({
          where: { name: { contains: baseName, mode: 'insensitive' } }
        });
      }
    }

    // 7. Send final response to Frontend
    res.json({ 
        success: true, 
        prediction, 
        crop: dbCrop 
    });

  } catch (err: any) {
    console.error("❌ AI Service Error:", err.message);
    
    // Handle specific error when Render is sleeping or times out
    res.status(500).json({ 
        success: false, 
        message: "AI Model is waking up (please try again in 30 seconds) or failed.",
        error: err.message 
    });
  }
};
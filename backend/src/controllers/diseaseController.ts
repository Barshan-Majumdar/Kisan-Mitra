import { Request, Response } from 'express';
import axios from 'axios';
import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';
const SCRIPT_PATH = path.resolve(__dirname, '../../../ai-service/predict_disease.py');

/**
 * Predicts crop disease from a foliar leaf image using model_v1.pt (EfficientNet-B0)
 */
export const predictCropDisease = async (req: Request, res: Response): Promise<void> => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== 'string' || image.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid image (base64 string or data URL).',
      });
      return;
    }

    console.log('🔬 Received crop foliar image for pathology diagnosis (model_v1.pt)...');

    // 1. Try FastAPI microservice endpoint first if running
    try {
      const apiResp = await axios.post(
        `${AI_SERVICE_URL}/predict-disease`,
        { image },
        { timeout: 7000 }
      );

      if (apiResp.data && apiResp.data.success) {
        console.log(`✅ Diagnosis via FastAPI: ${apiResp.data.crop} - ${apiResp.data.disease} (${apiResp.data.confidence}%)`);
        res.json(apiResp.data);
        return;
      }
    } catch (apiErr: any) {
      console.log(`ℹ️ FastAPI microservice on port 8000 not reachable (${apiErr.message}). Engaging direct Python PyTorch runtime...`);
    }

    // 2. Direct embedded Python PyTorch execution (guaranteed to work even if uvicorn is offline)
    if (!fs.existsSync(SCRIPT_PATH)) {
      res.status(500).json({
        success: false,
        error: `Python pathology script not found at: ${SCRIPT_PATH}`,
      });
      return;
    }

    // Write image to a temporary file to avoid command line argument length limits on Windows
    let base64Clean = image;
    if (base64Clean.includes(',')) {
      base64Clean = base64Clean.split(',')[1];
    }

    const tempFileName = `crop_leaf_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const tempFilePath = path.join(os.tmpdir(), tempFileName);

    try {
      fs.writeFileSync(tempFilePath, Buffer.from(base64Clean, 'base64'));

      // Execute Python predict_disease.py directly
      execFile('python', [SCRIPT_PATH, tempFilePath], { maxBuffer: 10 * 1024 * 1024, timeout: 25000 }, (error, stdout, stderr) => {
        // Clean up temp image
        try {
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        } catch (cleanupErr) {
          // ignore
        }

        if (error) {
          console.error('❌ Python vision execution failed:', error.message, stderr);
          res.status(500).json({
            success: false,
            error: 'Failed to process crop leaf image with deep learning model.',
            details: stderr || error.message,
          });
          return;
        }

        try {
          const result = JSON.parse(stdout.trim());
          if (result.success) {
            console.log(`✅ Diagnosis via Direct PyTorch: ${result.crop} - ${result.disease} (${result.confidence}%)`);
            res.json(result);
          } else {
            res.status(500).json({ success: false, error: result.error || 'Diagnosis failed' });
          }
        } catch (parseErr: any) {
          console.error('❌ Failed to parse Python JSON output:', stdout);
          res.status(500).json({
            success: false,
            error: 'Invalid response from vision model engine.',
            raw: stdout,
          });
        }
      });
    } catch (fileErr: any) {
      // Clean up in case of write error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw fileErr;
    }
  } catch (err: any) {
    console.error('❌ Disease prediction controller error:', err);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while diagnosing crop leaf disease.',
      details: err.message,
    });
  }
};

/**
 * Returns supported foliar disease categories
 */
export const getSupportedDiseases = async (req: Request, res: Response): Promise<void> => {
  try {
    const { CLASS_NAMES } = require(path.resolve(__dirname, '../../../ai-service/predict_disease.py'));
  } catch {
    // Return statically if python cannot be directly imported into JS
  }

  // 38 canonical PlantVillage classes
  const classes = [
    { crop: 'Apple', disease: 'Apple Scab', pathogen: 'Fungal' },
    { crop: 'Apple', disease: 'Black Rot', pathogen: 'Fungal' },
    { crop: 'Apple', disease: 'Cedar Apple Rust', pathogen: 'Fungal' },
    { crop: 'Apple', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Blueberry', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Cherry', disease: 'Powdery Mildew', pathogen: 'Fungal' },
    { crop: 'Cherry', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Corn (Maize)', disease: 'Gray Leaf Spot', pathogen: 'Fungal' },
    { crop: 'Corn (Maize)', disease: 'Common Rust', pathogen: 'Fungal' },
    { crop: 'Corn (Maize)', disease: 'Northern Corn Leaf Blight', pathogen: 'Fungal' },
    { crop: 'Corn (Maize)', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Grape', disease: 'Black Rot', pathogen: 'Fungal' },
    { crop: 'Grape', disease: 'Esca (Black Measles)', pathogen: 'Fungal' },
    { crop: 'Grape', disease: 'Leaf Blight (Isariopsis)', pathogen: 'Fungal' },
    { crop: 'Grape', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Citrus (Orange)', disease: 'Citrus Greening (HLB)', pathogen: 'Bacterial' },
    { crop: 'Peach', disease: 'Bacterial Spot', pathogen: 'Bacterial' },
    { crop: 'Peach', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Bell Pepper', disease: 'Bacterial Spot', pathogen: 'Bacterial' },
    { crop: 'Bell Pepper', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Potato', disease: 'Early Blight', pathogen: 'Fungal' },
    { crop: 'Potato', disease: 'Late Blight', pathogen: 'Oomycete' },
    { crop: 'Potato', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Raspberry', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Soybean', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Squash', disease: 'Powdery Mildew', pathogen: 'Fungal' },
    { crop: 'Strawberry', disease: 'Leaf Scorch', pathogen: 'Fungal' },
    { crop: 'Strawberry', disease: 'Healthy Foliage', pathogen: 'None' },
    { crop: 'Tomato', disease: 'Bacterial Spot', pathogen: 'Bacterial' },
    { crop: 'Tomato', disease: 'Early Blight', pathogen: 'Fungal' },
    { crop: 'Tomato', disease: 'Late Blight', pathogen: 'Oomycete' },
    { crop: 'Tomato', disease: 'Leaf Mold', pathogen: 'Fungal' },
    { crop: 'Tomato', disease: 'Septoria Leaf Spot', pathogen: 'Fungal' },
    { crop: 'Tomato', disease: 'Two-Spotted Spider Mite', pathogen: 'Pest' },
    { crop: 'Tomato', disease: 'Target Spot', pathogen: 'Fungal' },
    { crop: 'Tomato', disease: 'Tomato Yellow Leaf Curl Virus', pathogen: 'Viral' },
    { crop: 'Tomato', disease: 'Tomato Mosaic Virus', pathogen: 'Viral' },
    { crop: 'Tomato', disease: 'Healthy Foliage', pathogen: 'None' },
  ];

  res.json({
    total: classes.length,
    crops: Array.from(new Set(classes.map((c) => c.crop))),
    classes,
  });
};

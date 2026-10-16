import { Router } from 'express';
import { getPrediction, getCropOptions } from '../controllers/cropController';

const router = Router();

// Get dynamic dropdown options (States, Districts, Soils, Seasons, Irrigation)
router.get('/options', getCropOptions);

// Two-Stage Crop Recommendation and Harvest Yield prediction
router.post('/predict-crop', getPrediction);

export default router;
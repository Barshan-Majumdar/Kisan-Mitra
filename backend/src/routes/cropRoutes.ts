import { Router } from 'express';
import {
  getPrediction,
  getCropOptions,
  getRecommendationHistory,
  getRecommendationById,
  deleteRecommendation
} from '../controllers/cropController';

const router = Router();

// Get dynamic dropdown options (States, Districts, Soils, Seasons, Irrigation)
router.get('/options', getCropOptions);

// Two-Stage Crop Recommendation and Harvest Yield prediction
router.post('/predict-crop', getPrediction);

// Crop Recommendation History
router.get('/recommendation-history', getRecommendationHistory);
router.get('/recommendation-history/:id', getRecommendationById);
router.delete('/recommendation-history/:id', deleteRecommendation);

export default router;
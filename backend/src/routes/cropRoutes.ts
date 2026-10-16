import { Router } from 'express';
import { getPrediction } from '../controllers/cropController';

const router = Router();

// Define the POST route
router.post('/predict-crop', getPrediction);

export default router;
import { Router } from 'express';
import { predictCropDisease, getSupportedDiseases } from '../controllers/diseaseController';

const router = Router();

router.post('/predict', predictCropDisease);
router.get('/classes', getSupportedDiseases);

export default router;

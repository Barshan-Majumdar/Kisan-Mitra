import { Router } from 'express';
import {
  predictCropDisease,
  getSupportedDiseases,
  getDiseaseHistory,
  getDiseaseHistoryById,
  deleteDiseaseHistory
} from '../controllers/diseaseController';

const router = Router();

router.post('/predict', predictCropDisease);
router.get('/classes', getSupportedDiseases);
router.get('/history', getDiseaseHistory);
router.get('/history/:id', getDiseaseHistoryById);
router.delete('/history/:id', deleteDiseaseHistory);

export default router;

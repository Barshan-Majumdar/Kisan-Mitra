import { Router } from 'express';
import { saveSoilData, getSoilData } from '../controllers/soilController';

const router = Router();

router.post('/', saveSoilData);
router.get('/', getSoilData);

export default router;

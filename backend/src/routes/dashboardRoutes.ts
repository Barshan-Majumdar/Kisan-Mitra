import { Router } from 'express';
import { getUserStats } from '../controllers/dashboardController';

const router = Router();

router.get('/stats', getUserStats);

export default router;


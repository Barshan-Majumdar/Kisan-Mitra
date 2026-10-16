import { Router } from 'express';
import { getMarketPrices } from '../controllers/marketController';

const router = Router();

router.get('/', getMarketPrices);

export default router;

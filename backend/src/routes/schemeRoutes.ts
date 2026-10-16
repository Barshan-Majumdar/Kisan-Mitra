import { Router } from 'express';
import { getSchemes } from '../controllers/schemeController';

const router = Router();

router.get('/', getSchemes);

export default router;

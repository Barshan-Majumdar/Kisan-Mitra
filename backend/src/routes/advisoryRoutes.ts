import { Router } from 'express';
import { getAdvisories, createAdvisory, deleteAdvisory } from '../controllers/advisoryController';

const router = Router();

router.get('/', getAdvisories);
router.post('/', createAdvisory);
router.delete('/:id', deleteAdvisory);

export default router;

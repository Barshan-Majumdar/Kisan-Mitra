import { Router } from 'express';
import { getTasks, toggleTask, createTask } from '../controllers/taskController';

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', toggleTask);

export default router;

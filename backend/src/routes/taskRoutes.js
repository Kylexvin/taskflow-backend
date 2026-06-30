import express from 'express';
import TaskController from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, TaskController.getAll);
router.get('/:id', authenticate, TaskController.getById);
router.get('/project/:projectId', authenticate, TaskController.getByProject);
router.post('/', authenticate, TaskController.create);
router.put('/:id', authenticate, TaskController.update);
router.delete('/:id', authenticate, TaskController.delete);

export default router;
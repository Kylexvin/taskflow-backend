import express from 'express';
import ProjectController from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, ProjectController.getAll);
router.get('/:id', authenticate, ProjectController.getById);
router.post('/', authenticate, ProjectController.create);
router.put('/:id', authenticate, ProjectController.update);
router.delete('/:id', authenticate, ProjectController.delete);

export default router;
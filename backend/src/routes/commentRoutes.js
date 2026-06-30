import express from 'express';
import CommentController from '../controllers/commentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/task/:taskId', authenticate, CommentController.getByTask);
router.post('/', authenticate, CommentController.create);
router.delete('/:id', authenticate, CommentController.delete);

export default router;
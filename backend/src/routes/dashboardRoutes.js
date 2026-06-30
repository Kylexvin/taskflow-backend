import express from 'express';
import DashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticate, DashboardController.getStats);

export default router;
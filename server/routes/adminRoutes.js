import express from 'express';
import { getAnalytics } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/analytics', protect, authorize('Admin'), getAnalytics);

export default router;

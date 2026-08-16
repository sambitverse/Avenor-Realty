import express from 'express';
import { getRentals, createRental } from '../controllers/rentalController.js';
import { protect, authorize } from '../middleware/auth.js';
import { mutationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getRentals);
router.post('/', protect, authorize('Admin', 'Agent', 'Property Owner'), mutationLimiter, createRental);

export default router;

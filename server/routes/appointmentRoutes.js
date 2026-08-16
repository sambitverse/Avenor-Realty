import express from 'express';
import {
  createAppointment,
  getUserAppointments,
  getAllAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { appointmentSchema } from '../validators/index.js';

const router = express.Router();

router.post('/', contactLimiter, validate(appointmentSchema), createAppointment);
router.get('/my', protect, getUserAppointments);
router.get('/', protect, authorize('Admin'), getAllAppointments);
router.patch('/:id/status', protect, authorize('Admin'), updateAppointmentStatus);

export default router;

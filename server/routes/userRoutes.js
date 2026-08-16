import express from 'express';
import { getProfile, updateProfile, getUsers, updateUserRole } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema, updateUserRoleSchema } from '../validators/index.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.get('/', protect, authorize('Admin'), getUsers);
router.patch('/:id/role', protect, authorize('Admin'), validate(updateUserRoleSchema), updateUserRole);

export default router;

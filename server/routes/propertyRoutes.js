import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';
import { mutationLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { propertyQuerySchema, createPropertySchema, updatePropertySchema } from '../validators/index.js';

const router = express.Router();

router.get('/', validate(propertyQuerySchema, 'query'), getProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('Admin', 'Agent', 'Property Owner'), mutationLimiter, validate(createPropertySchema), createProperty);
router.put('/:id', protect, authorize('Admin', 'Agent', 'Property Owner'), mutationLimiter, validate(updatePropertySchema), updateProperty);
router.delete('/:id', protect, authorize('Admin', 'Property Owner'), deleteProperty);

export default router;

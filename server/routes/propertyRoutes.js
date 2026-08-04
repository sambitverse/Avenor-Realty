import express from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('Admin', 'Agent', 'Property Owner'), createProperty);
router.put('/:id', protect, authorize('Admin', 'Agent', 'Property Owner'), updateProperty);
router.delete('/:id', protect, authorize('Admin'), deleteProperty);

export default router;

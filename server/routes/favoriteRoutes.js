import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { favoriteSchema } from '../validators/index.js';

const router = express.Router();

router.get('/', protect, getFavorites);
router.post('/', protect, validate(favoriteSchema), addFavorite);
router.delete('/:propertyId', protect, removeFavorite);

export default router;

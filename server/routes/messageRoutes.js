import express from 'express';
import { getConversations, getMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { sendMessageSchema } from '../validators/index.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/conversations/:conversationId', protect, getMessages);
router.post('/send', protect, validate(sendMessageSchema), sendMessage);

export default router;

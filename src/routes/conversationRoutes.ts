import { Router } from 'express';
import conversationController from '../controllers/conversationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All conversation routes require authentication
router.use(authMiddleware);

// Stats must come BEFORE :phone to avoid "stats" being treated as phone number
router.get('/stats', conversationController.getStats);
router.get('/:phone', conversationController.getByPhone);
router.get('/', conversationController.getAll);

export default router;
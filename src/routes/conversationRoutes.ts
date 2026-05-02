import { Router } from 'express';
import conversationController from '../controllers/conversationController.js';

const router = Router();

router.get('/stats', conversationController.getStats);
router.get('/:phone', conversationController.getByPhone);
router.get('/', conversationController.getAll);

export default router;
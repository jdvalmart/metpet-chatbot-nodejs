import { Router } from 'express';
import webhookController from '../controllers/webhookController.js';

const router = Router();

router.post('/webhook', webhookController.handleIncoming);
router.get('/webhook', webhookController.verifyWebhook);

export default router;
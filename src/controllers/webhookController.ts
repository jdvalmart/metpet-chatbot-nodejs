import { Request, Response, NextFunction } from 'express';
import config from '../config/env.js';
import messageHandler from '../services/messageHandler.js';
import logger from '../services/logger.js';
import { AppError } from '../middleware/errorHandler.js';

interface WhatsAppEntry {
  changes: Array<{
    value: {
      messages?: WhatsAppMessage[];
      contacts?: SenderInfo[];
    };
  }>;
}

interface WhatsAppMessage {
  from: string;
  id: string;
  type: string;
  text?: {
    body: string;
  };
}

interface SenderInfo {
  profile?: {
    name?: string;
  };
  wa_id: string;
}

interface WebhookBody {
  entry?: WhatsAppEntry[];
}

class WebhookController {
  async handleIncoming(req: Request<{}, {}, WebhookBody>, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
      const senderInfo = req.body.entry?.[0]?.changes[0]?.value?.contacts?.[0];

      if (!message || !senderInfo) {
        logger.warn('Webhook received without message or sender', {
          hasMessage: !!message,
          hasSender: !!senderInfo,
        });
        res.sendStatus(200); // Always return 200 to WhatsApp
        return;
      }

      await messageHandler.handleIncomingMessage(message, senderInfo);
      res.sendStatus(200);
    } catch (error) {
      next(new AppError('Failed to process incoming message'));
    }
  }

  verifyWebhook(req: Request<{}, {}, {}, { 'hub.mode'?: string; 'hub.verify_token'?: string; 'hub.challenge'?: string }>, res: Response): void {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.WEBHOOK_VERIFY_TOKEN) {
      logger.info('Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      logger.warn('Webhook verification failed', { mode, token });
      res.sendStatus(403);
    }
  }
}

export default new WebhookController();
import { Request, Response } from 'express';
import config from '../config/env.js';
import messageHandler from '../services/messageHandler.js';

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
  async handleIncoming(req: Request<{}, {}, WebhookBody>, res: Response): Promise<void> {
    const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
    const senderInfo = req.body.entry?.[0]?.changes[0]?.value?.contacts?.[0];

    if (message && senderInfo) {
      await messageHandler.handleIncomingMessage(message, senderInfo);
    }
    res.sendStatus(200);
  }

  verifyWebhook(req: Request<{}, {}, {}, { 'hub.mode'?: string; 'hub.verify_token'?: string; 'hub.challenge'?: string }>, res: Response): void {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === config.WEBHOOK_VERIFY_TOKEN) {
      res.status(200).send(challenge);
      console.log('Webhook verified successfully!');
    } else {
      res.sendStatus(403);
    }
  }
}

export default new WebhookController();
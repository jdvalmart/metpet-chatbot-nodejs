import { Request, Response } from 'express';
import databaseService from '../services/database.js';

// Validate phone format: allows +, digits, spaces, dashes (E.164-like)
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

class ConversationController {
  getStats(_req: Request, res: Response): void {
    try {
      const stats = databaseService.getConversationStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  }

  getByPhone(req: Request<{ phone: string }>, res: Response): void {
    try {
      const phone = req.params.phone;

      // Validate phone format to prevent invalid queries
      if (!phone || !PHONE_REGEX.test(phone)) {
        res.status(400).json({ error: 'Invalid phone format. Use E.164 format (e.g., +1234567890)' });
        return;
      }

      const conversations = databaseService.getConversations(phone);
      res.json({ phone, count: conversations.length, conversations });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  getAll(req: Request, res: Response): void {
    try {
      // Clamp limit between 1 and 1000 to prevent abuse
      const rawLimit = parseInt(req.query.limit as string) || 100;
      const limit = Math.min(Math.max(rawLimit, 1), 1000);

      const conversations = databaseService.getAllConversations(limit);
      res.json({ count: conversations.length, conversations });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }
}

export default new ConversationController();
import { Request, Response } from 'express';
import databaseService from '../services/database.js';

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
      const conversations = databaseService.getConversations(req.params.phone);
      res.json({ phone: req.params.phone, count: conversations.length, conversations });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  getAll(req: Request, res: Response): void {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const conversations = databaseService.getAllConversations(limit);
      res.json({ count: conversations.length, conversations });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }
}

export default new ConversationController();
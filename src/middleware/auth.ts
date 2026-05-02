import { Request, Response, NextFunction } from 'express';
import config from '../config/env.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'];
  
  if (!config.CONVERSATIONS_API_KEY) {
    // No API key configured - allow access (for development)
    next();
    return;
  }
  
  if (apiKey === config.CONVERSATIONS_API_KEY) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
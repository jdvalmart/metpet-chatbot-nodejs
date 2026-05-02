import { Request, Response, NextFunction } from 'express';
import logger from '../services/logger.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const statusCode = (err as AppError).statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  logger.error('Request error', {
    method: req.method,
    url: req.url,
    statusCode,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: `Route ${req.method} ${req.url} not found`,
  });
}
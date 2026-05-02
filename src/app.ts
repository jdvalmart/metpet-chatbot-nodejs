import express, { Express, Request, Response } from 'express';
import config from './config/env.js';
import webhookRoutes from './routes/webhookRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger from './services/logger.js';

const app: Express = express();
app.use(express.json());

app.use('/', webhookRoutes);
app.use('/conversations', conversationRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  logger.info(`Server is listening on port ${config.PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
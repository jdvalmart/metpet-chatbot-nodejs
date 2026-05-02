import express, { Express, Request, Response } from 'express';
import config from './config/env.js';
import webhookRoutes from './routes/webhookRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger from './services/logger.js';
import databaseService from './services/database.js';

const app: Express = express();
// Limit JSON body to 100KB to prevent DoS attacks
app.use(express.json({ limit: '100kb' }));

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
const shutdown = () => {
  logger.info('Shutting down...');
  server.close(() => {
    logger.info('Closing database connection...');
    databaseService.close();
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
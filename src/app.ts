import express, { Express, Request, Response } from 'express';
import config from './config/env.js';
import webhookRoutes from './routes/webhookRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';

const app: Express = express();
app.use(express.json());

app.use('/', webhookRoutes);
app.use('/conversations', conversationRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(config.PORT, () => {
  console.log(`Server is listening on port:  ${config.PORT}`);
});

export default app;
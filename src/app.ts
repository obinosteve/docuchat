import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import logger from './services/logger.service.ts';
import router from './routes/index.ts';
import './events/auth.events.ts';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.ts';
import { errorHandler } from './middleware/errorHandler.ts';

const app = express();

app.use(helmet());
app.use(cors());

app.use(
  morgan('dev', {
    stream: { write: (msg: string) => logger.info(msg.trim()) },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve the raw JSON spec (useful for code generators)
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/v1', router);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (MUST be last)
app.use(errorHandler);

export default app;
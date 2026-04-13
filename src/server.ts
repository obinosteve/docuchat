import app from './app.ts';
import logger from './services/logger.service.ts';
import env from './config/env.js';
import { prisma } from './lib/prisma.ts';

const { port } = env;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, disconnecting from database and shutting down');

  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, disconnecting from database and shutting down');

  await prisma.$disconnect();
  process.exit(0);
});

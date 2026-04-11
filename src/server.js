const app    = require('./app');
const logger = require('./services/logger.service');
const { port } = require('./config/env.config');
import { prisma } from './lib/prisma';

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received — disconnecting from database and shutting down');

    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received — disconnecting from database and shutting down');

    await prisma.$disconnect();
    process.exit(0);
});
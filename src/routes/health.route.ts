import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     description: Returns a simple health payload for the API service.
 *     security: []
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is healthy
 *                 environment:
 *                   type: string
 *                   example: development
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  
  try {
      res.json({ 
            message: 'API is healthy',
            environment: process.env.NODE_ENV || 'development',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: '1.0.0'
        });
    } catch (error) {
      next(error);
    }
});

export default router;

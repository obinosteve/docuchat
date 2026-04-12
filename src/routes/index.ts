import { Router } from 'express';
import authRoutes from './auth.routes.ts';
// import documentsRoutes from './documents.routes.ts';
import healthRoute from './health.route.ts';

const router = Router();

router.use('/health', healthRoute);
router.use('/auth', authRoutes);
// router.use('/documents', documentsRoutes);

export default router;

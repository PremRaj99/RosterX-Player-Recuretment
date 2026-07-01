import { Router } from 'express';
import { swaggerRouter } from './core/api-docs/swagger';
import { logRouter } from './modules/log/log.route';
import { authRouter } from './modules/auth/auth.rotue';

// src/app.ts
import '@/core/api-docs/swagger-init';

export const router = Router();

router.use('/docs', swaggerRouter);

router.use('/auth', authRouter);

// dev route
router.use('/logs', logRouter);

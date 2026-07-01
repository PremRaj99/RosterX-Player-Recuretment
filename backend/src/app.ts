import { Router } from 'express';
import { swaggerRouter } from './core/api-docs/swagger';
import { logRouter } from './modules/log/log.route';
import { authRouter } from './modules/auth/auth.route';
import { userRouter } from './modules/user/user.route';
import { playerRouter } from './modules/player/player.route';
import { organizationRouter } from './modules/organization/organization.route';
import { teamRouter } from './modules/team/team.route';
import { recruitmentRouter } from './modules/recruitment/recruitment.route';
import { applicationRouter } from './modules/application/application.route';
import { notificationRouter } from './modules/notification/notification.route';
import { chatRouter } from './modules/chat/chat.route';

// src/app.ts
import '@/core/api-docs/swagger-init';

export const router = Router();

router.use('/docs', swaggerRouter);

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/players', playerRouter);
router.use('/organizations', organizationRouter);
router.use('/teams', teamRouter);
router.use('/recruitments', recruitmentRouter);
router.use('/applications', applicationRouter);
router.use('/notifications', notificationRouter);
router.use('/chats', chatRouter);

// dev route
router.use('/logs', logRouter);

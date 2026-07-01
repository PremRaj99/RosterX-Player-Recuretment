import { Router } from 'express';
import { verifyJWT } from '@/core/middlewares/verifyJWT';
import { listNotifications, markAsRead } from './notification.controller';

export const notificationRouter = Router();

notificationRouter.get('/', verifyJWT, listNotifications);
notificationRouter.patch('/:id/read', verifyJWT, markAsRead);

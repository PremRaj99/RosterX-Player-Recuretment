import { Router } from 'express';
import { verifyJWT } from '@/core/middlewares/verifyJWT';
import { listThreads, createThread, getMessagesHandler, sendMessageHandler } from './chat.controller';

export const chatRouter = Router();

chatRouter.get('/', verifyJWT, listThreads);
chatRouter.post('/', verifyJWT, createThread);
chatRouter.get('/:id/messages', verifyJWT, getMessagesHandler);
chatRouter.post('/:id/messages', verifyJWT, sendMessageHandler);

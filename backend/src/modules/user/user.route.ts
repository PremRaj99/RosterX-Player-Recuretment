import { Router } from 'express';
import { verifyJWT } from '@/core/middlewares/verifyJWT';
import { getMe, updateMe } from './user.controller';

export const userRouter = Router();

userRouter.get('/me', verifyJWT, getMe);
userRouter.put('/me', verifyJWT, updateMe);

import { Router } from 'express';
import { verifyJWT } from '@/core/middlewares/verifyJWT';
import { PlayerOnly } from '@/core/middlewares/verifyPlayer';
import { listRecruitmentsHandler, applyToRecruitment } from './recruitment.controller';

export const recruitmentRouter = Router();

// Public route
recruitmentRouter.get('/', listRecruitmentsHandler);

// Protected route (player only)
recruitmentRouter.post('/:id/apply', verifyJWT, PlayerOnly, applyToRecruitment);

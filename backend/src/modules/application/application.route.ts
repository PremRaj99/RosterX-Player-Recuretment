import { Router } from 'express';
import { verifyJWT } from '@/core/middlewares/verifyJWT';
import { OrganizerOnly } from '@/core/middlewares/verifyOrganizer';
import { updateApplication } from './application.controller';

export const applicationRouter = Router();

applicationRouter.patch('/:id', verifyJWT, OrganizerOnly, updateApplication);

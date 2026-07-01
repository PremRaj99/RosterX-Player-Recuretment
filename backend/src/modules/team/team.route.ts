import { Router } from 'express';
import { verifyJWT } from '@/core/middlewares/verifyJWT';
import { OrganizerOnly } from '@/core/middlewares/verifyOrganizer';
import { updateMembers } from './team.controller';

export const teamRouter = Router();

teamRouter.put('/:id/members', verifyJWT, OrganizerOnly, updateMembers);

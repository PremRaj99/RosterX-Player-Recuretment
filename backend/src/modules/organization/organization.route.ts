import { Router } from 'express';
import { verifyJWT } from '@/core/middlewares/verifyJWT';
import { OrganizerOnly } from '@/core/middlewares/verifyOrganizer';
import {
  createOrganization,
  getOrganization,
  updateOrganization,
  createTeamHandler,
  createRecruitmentHandler,
  listApplicationsHandler,
} from './organization.controller';

export const organizationRouter = Router();

// Protected routes (organizer only)
organizationRouter.post('/', verifyJWT, OrganizerOnly, createOrganization);
organizationRouter.put('/:id', verifyJWT, OrganizerOnly, updateOrganization);
organizationRouter.post('/:id/teams', verifyJWT, OrganizerOnly, createTeamHandler);
organizationRouter.post('/:id/recruitments', verifyJWT, OrganizerOnly, createRecruitmentHandler);
organizationRouter.get('/:id/applications', verifyJWT, OrganizerOnly, listApplicationsHandler);

// Public route (must be last to avoid matching :slug against other paths)
organizationRouter.get('/:slug', getOrganization);

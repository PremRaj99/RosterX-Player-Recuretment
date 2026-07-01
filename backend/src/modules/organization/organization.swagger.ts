import { swaggerRouter, success } from '@/core/api-docs/swagger.router';
import {
  CreateOrgSchema,
  UpdateOrgSchema,
  CreateTeamSchema,
  CreateRecruitmentSchema,
} from './organization.type';
import { z } from 'zod';

const organizationSwagger = swaggerRouter('/organizations', ['Organization']);

const OrganizationSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  slug: z.string(),
  logoUrl: z.string().nullable(),
  games: z.array(z.string()),
  description: z.string().nullable(),
  verified: z.boolean(),
  verifiedAt: z.string().nullable(),
  rosterSize: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

organizationSwagger.post('/', {
  summary: 'Create a new organization',
  body: CreateOrgSchema,
  success: success(201, 'Organization created successfully'),
});

organizationSwagger.get('/:slug', {
  summary: 'Get public organization details by slug',
  params: z.object({
    slug: z.string(),
  }),
  success: success(
    200,
    OrganizationSchema.extend({
      teams: z.array(z.any()),
      owner: z.object({
        id: z.string(),
        email: z.string(),
        username: z.string(),
        displayName: z.string(),
        role: z.string(),
      }),
    }),
  ),
});

organizationSwagger.put('/:id', {
  summary: 'Update organization details',
  params: z.object({
    id: z.string(),
  }),
  body: UpdateOrgSchema,
  success: success(200, OrganizationSchema),
});

organizationSwagger.post('/:id/teams', {
  summary: 'Create a new team under organization',
  params: z.object({
    id: z.string(),
  }),
  body: CreateTeamSchema,
  success: success(201, 'Team created successfully'),
});

organizationSwagger.post('/:id/recruitments', {
  summary: 'Create a new recruitment post under organization',
  params: z.object({
    id: z.string(),
  }),
  body: CreateRecruitmentSchema,
  success: success(201, 'Recruitment post created successfully'),
});

organizationSwagger.get('/:id/applications', {
  summary: 'List recruitment applications for the organization',
  params: z.object({
    id: z.string(),
  }),
  success: success(
    200,
    z.array(
      z.object({
        id: z.string(),
        recruitmentId: z.string().nullable(),
        organizationId: z.string(),
        playerId: z.string(),
        message: z.string().nullable(),
        status: z.enum(['pending', 'accepted', 'rejected']),
        decidedAt: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        recruitment: z.any().nullable(),
        player: z.object({
          id: z.string(),
          userId: z.string(),
          mainGame: z.string(),
          primaryRole: z.string(),
          rank: z.string(),
          user: z.object({
            id: z.string(),
            email: z.string(),
            username: z.string(),
            displayName: z.string(),
            role: z.string(),
          }),
        }),
      }),
    ),
  ),
});

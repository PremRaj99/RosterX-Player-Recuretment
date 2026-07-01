import { swaggerRouter, success } from '@/core/api-docs/swagger.router';
import { UpdateApplicationStatusSchema } from './application.type';
import { z } from 'zod';

const applicationSwagger = swaggerRouter('/applications', ['Application']);

applicationSwagger.patch('/:id', {
  summary: 'Decide recruitment application (accept/reject)',
  params: z.object({
    id: z.string(),
  }),
  body: UpdateApplicationStatusSchema,
  success: success(
    200,
    z.object({
      id: z.string(),
      recruitmentId: z.string().nullable(),
      organizationId: z.string(),
      playerId: z.string(),
      message: z.string().nullable(),
      status: z.enum(['pending', 'accepted', 'rejected']),
      decidedAt: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

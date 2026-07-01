import { swaggerRouter, success } from '@/core/api-docs/swagger.router';
import { UpdateMembersSchema } from './team.type';
import { z } from 'zod';

const teamSwagger = swaggerRouter('/teams', ['Team']);

teamSwagger.put('/:id/members', {
  summary: 'Add or remove members from team roster',
  params: z.object({
    id: z.string(),
  }),
  body: UpdateMembersSchema,
  success: success(
    200,
    z.object({
      id: z.string(),
      organizationId: z.string().nullable(),
      name: z.string(),
      game: z.string(),
      logoUrl: z.string().nullable(),
      winRate: z.number(),
      members: z.array(
        z.object({
          playerId: z.string(),
          roleOnTeam: z.string(),
          joinedAt: z.string(),
        }),
      ),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
});

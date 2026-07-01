import { swaggerRouter, success } from '@/core/api-docs/swagger.router';
import { ApplyToRecruitmentSchema } from './recruitment.type';
import { z } from 'zod';

const recruitmentSwagger = swaggerRouter('/recruitments', ['Recruitment']);

recruitmentSwagger.get('/', {
  summary: 'Get global feed of open positions',
  query: z.object({
    status: z.enum(['open', 'closed']).optional(),
    game: z.string().optional(),
  }),
  success: success(
    200,
    z.array(
      z.object({
        id: z.string(),
        organizationId: z.string(),
        title: z.string(),
        game: z.string(),
        roleNeeded: z.string(),
        description: z.string(),
        status: z.enum(['open', 'closed']),
        createdAt: z.string(),
        updatedAt: z.string(),
        organization: z.object({
          id: z.string(),
          name: z.string(),
          slug: z.string(),
          logoUrl: z.string().nullable(),
          verified: z.boolean(),
        }),
      }),
    ),
  ),
});

recruitmentSwagger.post('/:id/apply', {
  summary: 'Submit an application for recruitment post',
  params: z.object({
    id: z.string(),
  }),
  body: ApplyToRecruitmentSchema,
  success: success(201, 'Application submitted successfully'),
});

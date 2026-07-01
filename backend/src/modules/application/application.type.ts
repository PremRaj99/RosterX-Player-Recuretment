import { z } from 'zod';

export const UpdateApplicationStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
});

export type UpdateApplicationStatusInput = z.infer<typeof UpdateApplicationStatusSchema>;

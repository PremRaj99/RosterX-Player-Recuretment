import { z } from 'zod';

export const ApplyToRecruitmentSchema = z.object({
  message: z.string().optional(),
});

export type ApplyToRecruitmentInput = z.infer<typeof ApplyToRecruitmentSchema>;

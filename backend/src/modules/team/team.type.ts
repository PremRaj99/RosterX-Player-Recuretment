import { z } from 'zod';

export const UpdateMembersSchema = z.object({
  playerId: z.string().min(1, 'Player ID is required'),
  action: z.enum(['add', 'remove']),
  roleOnTeam: z.string().default('Member'),
});

export type UpdateMembersInput = z.infer<typeof UpdateMembersSchema>;

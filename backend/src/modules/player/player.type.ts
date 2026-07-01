import { z } from 'zod';

const PlayerStatsSchema = z.object({
  kdRatio: z.number().optional(),
  winRate: z.number().optional(),
  matchesPlayed: z.number().int().optional(),
  mvpCount: z.number().int().optional(),
});

const PlayerAchievementSchema = z.object({
  title: z.string().min(1, 'Achievement title is required'),
  description: z.string().optional(),
  awardedAt: z.string().datetime().optional(),
});

export const CreatePlayerProfileSchema = z.object({
  mainGame: z.string().min(1, 'Main game is required'),
  primaryRole: z.string().min(1, 'Primary role is required'),
  rank: z.string().min(1, 'Rank is required'),
});

export const UpdatePlayerProfileSchema = z.object({
  mainGame: z.string().min(1).optional(),
  primaryRole: z.string().min(1).optional(),
  rank: z.string().min(1).optional(),
  stats: PlayerStatsSchema.optional(),
  achievements: z.array(PlayerAchievementSchema).optional(),
});

export type CreatePlayerProfileInput = z.infer<typeof CreatePlayerProfileSchema>;
export type UpdatePlayerProfileInput = z.infer<typeof UpdatePlayerProfileSchema>;

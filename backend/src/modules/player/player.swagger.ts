import { swaggerRouter, success } from '@/core/api-docs/swagger.router';
import { CreatePlayerProfileSchema, UpdatePlayerProfileSchema } from './player.type';
import { z } from 'zod';

const playerSwagger = swaggerRouter('/players', ['Player']);

const PlayerStatsSchema = z.object({
  kdRatio: z.number(),
  winRate: z.number(),
  matchesPlayed: z.number(),
  mvpCount: z.number(),
});

const PlayerAchievementSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  awardedAt: z.string(),
});

const PlayerProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  mainGame: z.string(),
  primaryRole: z.string(),
  rank: z.string(),
  verified: z.boolean(),
  teamId: z.string().nullable(),
  stats: PlayerStatsSchema,
  achievements: z.array(PlayerAchievementSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

playerSwagger.get('/', {
  summary: 'List players with optional filters',
  query: z.object({
    game: z.string().optional(),
    rank: z.string().optional(),
    role: z.string().optional(),
  }),
  success: success(
    200,
    z.array(
      PlayerProfileSchema.extend({
        user: z.object({
          id: z.string(),
          email: z.string(),
          username: z.string(),
          displayName: z.string(),
          role: z.string(),
        }),
      }),
    ),
  ),
});

playerSwagger.get('/:id', {
  summary: 'Get public profile of a player by ID',
  params: z.object({
    id: z.string(),
  }),
  success: success(
    200,
    PlayerProfileSchema.extend({
      user: z.object({
        id: z.string(),
        email: z.string(),
        username: z.string(),
        displayName: z.string(),
        role: z.string(),
      }),
      team: z.any().nullable(),
    }),
  ),
});

playerSwagger.post('/me', {
  summary: 'Initialize player profile for current user',
  body: CreatePlayerProfileSchema,
  success: success(201, 'Player profile created'),
});

playerSwagger.put('/me', {
  summary: 'Update player profile (stats, achievements, rank)',
  body: UpdatePlayerProfileSchema,
  success: success(
    200,
    PlayerProfileSchema.extend({
      user: z.object({
        id: z.string(),
        email: z.string(),
        username: z.string(),
        displayName: z.string(),
        role: z.string(),
      }),
    }),
  ),
});

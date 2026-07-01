import { z } from 'zod';

export const CreateOrgSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  logoUrl: z.string().url().optional(),
  games: z.array(z.string()).default([]),
  description: z.string().optional(),
});

export const UpdateOrgSchema = z.object({
  name: z.string().min(1).optional(),
  logoUrl: z.string().url().optional(),
  games: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const CreateTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  game: z.string().min(1, 'Game is required'),
  logoUrl: z.string().url().optional(),
});

export const CreateRecruitmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  game: z.string().min(1, 'Game is required'),
  roleNeeded: z.string().min(1, 'Role needed is required'),
  description: z.string().min(1, 'Description is required'),
});

export type CreateOrgInput = z.infer<typeof CreateOrgSchema>;
export type UpdateOrgInput = z.infer<typeof UpdateOrgSchema>;
export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type CreateRecruitmentInput = z.infer<typeof CreateRecruitmentSchema>;

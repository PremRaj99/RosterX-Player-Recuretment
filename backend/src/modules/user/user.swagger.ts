import { swaggerRouter, success } from '@/core/api-docs/swagger.router';
import { UpdateUserInputSchema } from './user.type';
import { z } from 'zod';

const userSwagger = swaggerRouter('/users', ['User']);

const NotificationPrefsSchema = z.object({
  applications: z.boolean(),
  messages: z.boolean(),
  teams: z.boolean(),
  organizations: z.boolean(),
  tournaments: z.boolean(),
  platform: z.boolean(),
  security: z.boolean(),
  verification: z.boolean(),
});

const UserSettingsSchema = z.object({
  showOnlineStatus: z.boolean(),
  allowDirectMessages: z.boolean(),
  showInSearch: z.boolean(),
  notificationPrefs: NotificationPrefsSchema,
});

const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  displayName: z.string(),
  role: z.enum(['player', 'organizer']),
  emailVerified: z.boolean(),
  phone: z.string().nullable(),
  bio: z.string().nullable(),
  country: z.string().nullable(),
  status: z.enum(['active', 'blocked', 'deleted']),
  settings: UserSettingsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

userSwagger.get('/me', {
  summary: 'Get current authenticated user profile',
  success: success(200, UserProfileSchema),
});

userSwagger.put('/me', {
  summary: 'Update current authenticated user profile',
  body: UpdateUserInputSchema,
  success: success(200, UserProfileSchema),
});

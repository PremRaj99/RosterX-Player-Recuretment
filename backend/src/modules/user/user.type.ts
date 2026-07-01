import { z } from 'zod';

const NotificationPrefsSchema = z.object({
  applications: z.boolean().optional(),
  messages: z.boolean().optional(),
  teams: z.boolean().optional(),
  organizations: z.boolean().optional(),
  tournaments: z.boolean().optional(),
  platform: z.boolean().optional(),
  security: z.boolean().optional(),
  verification: z.boolean().optional(),
});

const UserSettingsSchema = z.object({
  showOnlineStatus: z.boolean().optional(),
  allowDirectMessages: z.boolean().optional(),
  showInSearch: z.boolean().optional(),
  notificationPrefs: NotificationPrefsSchema.optional(),
});

export const UpdateUserInputSchema = z.object({
  displayName: z.string().min(1).optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  settings: UserSettingsSchema.optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export const orgRegistrationSchema = z.object({
  orgName: z.string().min(2, { message: 'Organization name must be at least 2 characters.' }),
  email: z.string().email({ message: 'A valid contact email is required.' }),
  password: z.string().min(8, { message: 'Security requires a minimum 8-character password.' }),
  website: z
    .string()
    .url({ message: 'Must be a valid URL (e.g., https://rosterx.gg).' })
    .optional()
    .or(z.literal('')),
});

export const playerRegistrationSchema = z.object({
  username: z.string().min(3, { message: 'In-game name must be at least 3 characters.' }).max(20),
  email: z.string().email({ message: 'A valid email is required for account recovery.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  gameRoles: z.array(z.string()).min(1, { message: 'You must select at least one primary role.' }),
});

// Type exports for React Hook Form inference
export type LoginFormValues = z.infer<typeof loginSchema>;
export type OrgRegistrationFormValues = z.infer<typeof orgRegistrationSchema>;
export type PlayerRegistrationFormValues = z.infer<typeof playerRegistrationSchema>;

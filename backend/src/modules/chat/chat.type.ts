import { z } from 'zod';

export const CreateThreadSchema = z.object({
  participantIds: z.array(z.string()).min(1, 'At least one participant is required'),
});

export const SendMessageSchema = z.object({
  text: z.string().min(1, 'Message text is required'),
});

export type CreateThreadInput = z.infer<typeof CreateThreadSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;

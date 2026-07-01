import { swaggerRouter, success } from '@/core/api-docs/swagger.router';
import { CreateThreadSchema, SendMessageSchema } from './chat.type';
import { z } from 'zod';

const chatSwagger = swaggerRouter('/chats', ['Chat']);

const ParticipantSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  displayName: z.string(),
  role: z.enum(['player', 'organizer']),
});

const ChatMessageSchema = z.object({
  id: z.string(),
  threadId: z.string(),
  senderId: z.string(),
  text: z.string(),
  readByIds: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ChatThreadSchema = z.object({
  id: z.string(),
  participantIds: z.array(z.string()),
  lastMessageId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  participants: z.array(ParticipantSchema),
  lastMessage: ChatMessageSchema.nullable(),
});

chatSwagger.get('/', {
  summary: 'List chat threads the user is participating in',
  success: success(200, z.array(ChatThreadSchema)),
});

chatSwagger.post('/', {
  summary: 'Start a new chat thread',
  body: CreateThreadSchema,
  success: success(201, 'Chat thread created'),
});

chatSwagger.get('/:id/messages', {
  summary: 'Fetch message history for specific thread',
  params: z.object({
    id: z.string(),
  }),
  success: success(
    200,
    z.array(
      ChatMessageSchema.extend({
        sender: ParticipantSchema,
      }),
    ),
  ),
});

chatSwagger.post('/:id/messages', {
  summary: 'Send a message in thread',
  params: z.object({
    id: z.string(),
  }),
  body: SendMessageSchema,
  success: success(201, 'Message sent'),
});

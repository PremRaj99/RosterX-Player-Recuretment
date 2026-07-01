import { swaggerRouter, success } from '@/core/api-docs/swagger.router';
import { z } from 'zod';

const notificationSwagger = swaggerRouter('/notifications', ['Notification']);

const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: z.enum([
    'applications',
    'messages',
    'teams',
    'organizations',
    'tournaments',
    'platform',
    'security',
    'verification',
  ]),
  title: z.string(),
  body: z.string().nullable(),
  read: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

notificationSwagger.get('/', {
  summary: 'Get notifications list for current user',
  success: success(200, z.array(NotificationSchema)),
});

notificationSwagger.patch('/:id/read', {
  summary: 'Mark notification as read',
  params: z.object({
    id: z.string(),
  }),
  success: success(200, NotificationSchema),
});

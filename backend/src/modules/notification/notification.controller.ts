import { asyncHandler } from '@/core/response/responseHandler';
import { OkResponse } from '@/core/response/ApiResponse';
import { NotFoundError, ForbiddenError } from '@/core/errors/ApiError';
import { isAuth } from '@/core/middlewares/isAuth';
import * as notificationService from './notification.service';

export const listNotifications = asyncHandler(async (req, res) => {
  isAuth(req);

  const notifications = await notificationService.getNotifications(req.user.id);
  new OkResponse(notifications).send(res);
});

export const markAsRead = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;

  const notification = await notificationService.getNotificationById(id);
  if (!notification) {
    throw new NotFoundError('Notification not found');
  }

  // Verify user owns this notification
  if (notification.userId !== req.user.id) {
    throw new ForbiddenError('You are not authorized to manage this notification');
  }

  const updated = await notificationService.markRead(id);
  new OkResponse(updated).send(res);
});

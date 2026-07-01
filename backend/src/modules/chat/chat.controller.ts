import { asyncHandler } from '@/core/response/responseHandler';
import { OkResponse, CreatedResponse } from '@/core/response/ApiResponse';
import { NotFoundError, ForbiddenError } from '@/core/errors/ApiError';
import { validateSchema } from '@/core/utils/validateSchema';
import { isAuth } from '@/core/middlewares/isAuth';
import { CreateThreadSchema, SendMessageSchema } from './chat.type';
import * as chatService from './chat.service';

export const listThreads = asyncHandler(async (req, res) => {
  isAuth(req);

  const threads = await chatService.getThreads(req.user.id);
  new OkResponse(threads).send(res);
});

export const createThread = asyncHandler(async (req, res) => {
  isAuth(req);

  const data = validateSchema(CreateThreadSchema, req.body);

  // Ensure the current user is included in participant list
  const participantIds = Array.from(new Set([req.user.id, ...data.participantIds]));

  await chatService.createThread(participantIds);
  new CreatedResponse('Chat thread created').send(res);
});

export const getMessagesHandler = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;

  const thread = await chatService.getThreadById(id);
  if (!thread) {
    throw new NotFoundError('Chat thread not found');
  }

  // Verify user is a participant
  const isParticipant = thread.participantIds.includes(req.user.id);
  if (!isParticipant) {
    throw new ForbiddenError('You are not a participant in this thread');
  }

  const messages = await chatService.getMessages(id);
  new OkResponse(messages).send(res);
});

export const sendMessageHandler = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;
  const data = validateSchema(SendMessageSchema, req.body);

  const thread = await chatService.getThreadById(id);
  if (!thread) {
    throw new NotFoundError('Chat thread not found');
  }

  // Verify user is a participant
  const isParticipant = thread.participantIds.includes(req.user.id);
  if (!isParticipant) {
    throw new ForbiddenError('You are not a participant in this thread');
  }

  await chatService.sendMessage(id, req.user.id, data.text);
  new CreatedResponse('Message sent').send(res);
});

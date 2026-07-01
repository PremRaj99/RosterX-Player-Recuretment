import { asyncHandler } from '@/core/response/responseHandler';
import { OkResponse } from '@/core/response/ApiResponse';
import { NotFoundError } from '@/core/errors/ApiError';
import { validateSchema } from '@/core/utils/validateSchema';
import { isAuth } from '@/core/middlewares/isAuth';
import { UpdateUserInputSchema } from './user.type';
import { getUserById, updateUser } from './user.service';

export const getMe = asyncHandler(async (req, res) => {
  isAuth(req);

  const user = await getUserById(req.user.id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  new OkResponse(user).send(res);
});

export const updateMe = asyncHandler(async (req, res) => {
  isAuth(req);

  const data = validateSchema(UpdateUserInputSchema, req.body);
  const user = await updateUser(req.user.id, data);

  new OkResponse(user).send(res);
});

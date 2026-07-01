import { asyncHandler } from '../response/responseHandler';
import { ForbiddenError } from '../errors/ApiError';
export const PlayerOnly = asyncHandler((req, _res, next) => {
  if (!req.user) {
    throw new ForbiddenError();
  }
  if (req.user.role !== 'player') {
    throw new ForbiddenError();
  }
  next();
});

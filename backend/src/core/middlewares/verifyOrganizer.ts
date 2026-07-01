import { asyncHandler } from '../response/responseHandler';
import { ForbiddenError } from '../errors/ApiError';
export const OrganizerOnly = asyncHandler((req, _res, next) => {
  if (!req.user) {
    throw new ForbiddenError();
  }
  if (req.user.role !== 'organizer') {
    throw new ForbiddenError();
  }
  next();
});

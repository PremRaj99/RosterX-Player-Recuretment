import { asyncHandler } from '@/core/response/responseHandler';
import { OkResponse } from '@/core/response/ApiResponse';
import { NotFoundError, ForbiddenError } from '@/core/errors/ApiError';
import { validateSchema } from '@/core/utils/validateSchema';
import { isAuth } from '@/core/middlewares/isAuth';
import { UpdateApplicationStatusSchema } from './application.type';
import * as applicationService from './application.service';

export const updateApplication = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;
  const data = validateSchema(UpdateApplicationStatusSchema, req.body);

  const application = await applicationService.getApplicationById(id);
  if (!application) {
    throw new NotFoundError('Application not found');
  }

  // Verify user owns the organization this application belongs to
  if (application.organization.ownerId !== req.user.id) {
    throw new ForbiddenError('You are not authorized to manage this application');
  }

  const updated = await applicationService.updateApplicationStatus(id, data.status);
  new OkResponse(updated).send(res);
});

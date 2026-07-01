import { asyncHandler } from '@/core/response/responseHandler';
import { OkResponse, CreatedResponse } from '@/core/response/ApiResponse';
import { NotFoundError, ValidationError } from '@/core/errors/ApiError';
import { validateSchema } from '@/core/utils/validateSchema';
import { isAuth } from '@/core/middlewares/isAuth';
import { ApplyToRecruitmentSchema } from './recruitment.type';
import * as recruitmentService from './recruitment.service';
import { getPlayerByUserId } from '../player/player.service';

export const listRecruitmentsHandler = asyncHandler(async (req, res) => {
  const { status, game } = req.query as { status?: string; game?: string };

  const recruitments = await recruitmentService.listRecruitments({ status, game });
  new OkResponse(recruitments).send(res);
});

export const applyToRecruitment = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;
  const data = validateSchema(ApplyToRecruitmentSchema, req.body);

  // Get the recruitment
  const recruitment = await recruitmentService.getRecruitmentById(id);
  if (!recruitment) {
    throw new NotFoundError('Recruitment not found');
  }

  if (recruitment.status !== 'open') {
    throw new ValidationError('This recruitment is no longer accepting applications');
  }

  // Get current user's player profile
  const player = await getPlayerByUserId(req.user.id);
  if (!player) {
    throw new ValidationError('You need to create a player profile before applying');
  }

  // Check if already applied
  const existing = await recruitmentService.findExistingApplication(id, player.id);
  if (existing) {
    throw new ValidationError('You have already applied to this recruitment');
  }

  await recruitmentService.createApplication(
    id,
    player.id,
    recruitment.organizationId,
    data.message,
  );

  new CreatedResponse('Application submitted successfully').send(res);
});

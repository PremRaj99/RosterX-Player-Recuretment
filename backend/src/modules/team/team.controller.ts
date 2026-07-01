import { asyncHandler } from '@/core/response/responseHandler';
import { OkResponse } from '@/core/response/ApiResponse';
import { NotFoundError, ForbiddenError } from '@/core/errors/ApiError';
import { validateSchema } from '@/core/utils/validateSchema';
import { isAuth } from '@/core/middlewares/isAuth';
import { UpdateMembersSchema } from './team.type';
import * as teamService from './team.service';

export const updateMembers = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;
  const data = validateSchema(UpdateMembersSchema, req.body);

  const team = await teamService.getTeamById(id);
  if (!team) {
    throw new NotFoundError('Team not found');
  }

  // Verify user owns the team's organization
  if (!team.organization || team.organization.ownerId !== req.user.id) {
    throw new ForbiddenError('You are not the owner of this team\'s organization');
  }

  let result;
  if (data.action === 'add') {
    result = await teamService.addMember(id, data.playerId, data.roleOnTeam);
  } else {
    result = await teamService.removeMember(id, data.playerId);
  }

  new OkResponse(result).send(res);
});

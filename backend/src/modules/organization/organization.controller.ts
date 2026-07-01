import { asyncHandler } from '@/core/response/responseHandler';
import { OkResponse, CreatedResponse } from '@/core/response/ApiResponse';
import { NotFoundError, ForbiddenError } from '@/core/errors/ApiError';
import { validateSchema } from '@/core/utils/validateSchema';
import { isAuth } from '@/core/middlewares/isAuth';
import {
  CreateOrgSchema,
  UpdateOrgSchema,
  CreateTeamSchema,
  CreateRecruitmentSchema,
} from './organization.type';
import * as orgService from './organization.service';

export const createOrganization = asyncHandler(async (req, res) => {
  isAuth(req);

  const data = validateSchema(CreateOrgSchema, req.body);
  await orgService.createOrg(req.user.id, data);

  new CreatedResponse('Organization created successfully').send(res);
});

export const getOrganization = asyncHandler(async (req, res) => {
  const slug = req.params.slug as string;

  const org = await orgService.getOrgBySlug(slug);
  if (!org) {
    throw new NotFoundError('Organization not found');
  }

  new OkResponse(org).send(res);
});

export const updateOrganization = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;
  const org = await orgService.getOrgById(id);
  if (!org) {
    throw new NotFoundError('Organization not found');
  }

  if (org.ownerId !== req.user.id) {
    throw new ForbiddenError('You are not the owner of this organization');
  }

  const data = validateSchema(UpdateOrgSchema, req.body);
  const updated = await orgService.updateOrg(id, data);

  new OkResponse(updated).send(res);
});

export const createTeamHandler = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;
  const org = await orgService.getOrgById(id);
  if (!org) {
    throw new NotFoundError('Organization not found');
  }

  if (org.ownerId !== req.user.id) {
    throw new ForbiddenError('You are not the owner of this organization');
  }

  const data = validateSchema(CreateTeamSchema, req.body);
  await orgService.createTeam(id, data);

  new CreatedResponse('Team created successfully').send(res);
});

export const createRecruitmentHandler = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;
  const org = await orgService.getOrgById(id);
  if (!org) {
    throw new NotFoundError('Organization not found');
  }

  if (org.ownerId !== req.user.id) {
    throw new ForbiddenError('You are not the owner of this organization');
  }

  const data = validateSchema(CreateRecruitmentSchema, req.body);
  await orgService.createRecruitment(id, data);

  new CreatedResponse('Recruitment post created successfully').send(res);
});

export const listApplicationsHandler = asyncHandler(async (req, res) => {
  isAuth(req);

  const id = req.params.id as string;
  const org = await orgService.getOrgById(id);
  if (!org) {
    throw new NotFoundError('Organization not found');
  }

  if (org.ownerId !== req.user.id) {
    throw new ForbiddenError('You are not the owner of this organization');
  }

  const applications = await orgService.getOrgApplications(id);
  new OkResponse(applications).send(res);
});

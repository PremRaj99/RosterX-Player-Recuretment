import prisma from '@/config/prisma';
import type {
  CreateOrgInput,
  UpdateOrgInput,
  CreateTeamInput,
  CreateRecruitmentInput,
} from './organization.type';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

export const createOrg = async (ownerId: string, data: CreateOrgInput) => {
  const slug = generateSlug(data.name);

  return prisma.organization.create({
    data: {
      ownerId,
      name: data.name,
      slug,
      logoUrl: data.logoUrl || null,
      games: data.games,
      description: data.description || null,
    },
  });
};

export const getOrgBySlug = async (slug: string) => {
  return prisma.organization.findUnique({
    where: { slug },
    include: {
      teams: true,
      owner: {
        omit: { passwordHash: true },
      },
    },
  });
};

export const getOrgById = async (id: string) => {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      teams: true,
      owner: {
        omit: { passwordHash: true },
      },
    },
  });
};

export const updateOrg = async (id: string, data: UpdateOrgInput) => {
  const updateData: Record<string, unknown> = {};

  if (data.name) {
    updateData.name = data.name;
    updateData.slug = generateSlug(data.name);
  }
  if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl;
  if (data.games) updateData.games = data.games;
  if (data.description !== undefined) updateData.description = data.description;

  return prisma.organization.update({
    where: { id },
    data: updateData,
  });
};

export const createTeam = async (orgId: string, data: CreateTeamInput) => {
  return prisma.team.create({
    data: {
      organizationId: orgId,
      name: data.name,
      game: data.game,
      logoUrl: data.logoUrl || null,
      members: [],
    },
  });
};

export const createRecruitment = async (orgId: string, data: CreateRecruitmentInput) => {
  return prisma.recruitment.create({
    data: {
      organizationId: orgId,
      title: data.title,
      game: data.game,
      roleNeeded: data.roleNeeded,
      description: data.description,
    },
  });
};

export const getOrgApplications = async (orgId: string) => {
  return prisma.application.findMany({
    where: { organizationId: orgId },
    include: {
      player: {
        include: {
          user: {
            omit: { passwordHash: true },
          },
        },
      },
      recruitment: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

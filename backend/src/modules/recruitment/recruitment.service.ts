import prisma from '@/config/prisma';

interface RecruitmentFilters {
  status?: string | undefined;
  game?: string | undefined;
}

export const listRecruitments = async (filters: RecruitmentFilters) => {
  const where: Record<string, unknown> = {};

  if (filters.status) where.status = filters.status;
  if (filters.game) where.game = filters.game;

  return prisma.recruitment.findMany({
    where,
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          verified: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getRecruitmentById = async (id: string) => {
  return prisma.recruitment.findUnique({
    where: { id },
    include: {
      organization: true,
    },
  });
};

export const createApplication = async (
  recruitmentId: string,
  playerId: string,
  organizationId: string,
  message?: string,
) => {
  return prisma.application.create({
    data: {
      recruitmentId,
      playerId,
      organizationId,
      message: message || null,
    },
  });
};

export const findExistingApplication = async (recruitmentId: string, playerId: string) => {
  return prisma.application.findFirst({
    where: {
      recruitmentId,
      playerId,
    },
  });
};

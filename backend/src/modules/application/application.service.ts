import prisma from '@/config/prisma';
import type { ApplicationStatus } from '@prisma/client';

export const getApplicationById = async (id: string) => {
  return prisma.application.findUnique({
    where: { id },
    include: {
      organization: true,
      player: {
        include: {
          user: {
            omit: { passwordHash: true },
          },
        },
      },
      recruitment: true,
    },
  });
};

export const updateApplicationStatus = async (id: string, status: ApplicationStatus) => {
  return prisma.application.update({
    where: { id },
    data: {
      status,
      decidedAt: new Date(),
    },
  });
};

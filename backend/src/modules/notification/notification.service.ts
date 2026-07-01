import prisma from '@/config/prisma';

export const getNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const getNotificationById = async (id: string) => {
  return prisma.notification.findUnique({
    where: { id },
  });
};

export const markRead = async (id: string) => {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
};

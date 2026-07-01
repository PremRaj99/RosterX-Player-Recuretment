import prisma from '@/config/prisma';
import bcrypt from 'bcrypt';
import type { RegisterInput } from './auth.type';

const SALT_ROUNDS = 10;

export const createUser = async (data: RegisterInput) => {
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      username: data.username,
      displayName: data.displayName,
      role: data.role,
      settings: {
        showOnlineStatus: true,
        allowDirectMessages: true,
        showInSearch: true,
        notificationPrefs: {
          applications: true,
          messages: true,
          teams: true,
          organizations: true,
          tournaments: true,
          platform: true,
          security: true,
          verification: true,
        },
      },
    },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

export const comparePassword = async (plainPassword: string, hash: string) => {
  return bcrypt.compare(plainPassword, hash);
};

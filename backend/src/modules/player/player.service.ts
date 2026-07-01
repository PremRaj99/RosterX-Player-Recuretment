import prisma from '@/config/prisma';
import type { CreatePlayerProfileInput, UpdatePlayerProfileInput } from './player.type';

interface PlayerFilters {
  game?: string | undefined;
  rank?: string | undefined;
  role?: string | undefined;
}

export const listPlayers = async (filters: PlayerFilters) => {
  const where: Record<string, unknown> = {};

  if (filters.game) where.mainGame = filters.game;
  if (filters.rank) where.rank = filters.rank;
  if (filters.role) where.primaryRole = filters.role;

  return prisma.player.findMany({
    where,
    include: {
      user: {
        omit: { passwordHash: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPlayerById = async (id: string) => {
  return prisma.player.findUnique({
    where: { id },
    include: {
      user: {
        omit: { passwordHash: true },
      },
      team: true,
    },
  });
};

export const getPlayerByUserId = async (userId: string) => {
  return prisma.player.findUnique({
    where: { userId },
  });
};

export const createPlayer = async (userId: string, data: CreatePlayerProfileInput) => {
  return prisma.player.create({
    data: {
      userId,
      mainGame: data.mainGame,
      primaryRole: data.primaryRole,
      rank: data.rank,
      stats: {
        kdRatio: 0,
        winRate: 0,
        matchesPlayed: 0,
        mvpCount: 0,
      },
      achievements: [],
    },
    include: {
      user: {
        omit: { passwordHash: true },
      },
    },
  });
};

export const updatePlayer = async (userId: string, data: UpdatePlayerProfileInput) => {
  const updateData: Record<string, unknown> = {};

  if (data.mainGame) updateData.mainGame = data.mainGame;
  if (data.primaryRole) updateData.primaryRole = data.primaryRole;
  if (data.rank) updateData.rank = data.rank;
  if (data.stats) updateData.stats = data.stats;
  if (data.achievements) {
    updateData.achievements = data.achievements.map((a) => ({
      title: a.title,
      description: a.description || null,
      awardedAt: a.awardedAt ? new Date(a.awardedAt) : new Date(),
    }));
  }

  return prisma.player.update({
    where: { userId },
    data: updateData,
    include: {
      user: {
        omit: { passwordHash: true },
      },
    },
  });
};

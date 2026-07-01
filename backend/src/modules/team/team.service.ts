import prisma from '@/config/prisma';

export const getTeamById = async (id: string) => {
  return prisma.team.findUnique({
    where: { id },
    include: {
      organization: true,
      players: {
        include: {
          user: {
            omit: { passwordHash: true },
          },
        },
      },
    },
  });
};

export const addMember = async (teamId: string, playerId: string, roleOnTeam: string) => {
  // Add the member to the team's embedded members array
  const team = await prisma.team.update({
    where: { id: teamId },
    data: {
      members: {
        push: {
          playerId,
          roleOnTeam,
          joinedAt: new Date(),
        },
      },
    },
  });

  // Update the player's teamId reference
  await prisma.player.update({
    where: { id: playerId },
    data: { teamId },
  });

  // Increment the organization's rosterSize if team belongs to an org
  if (team.organizationId) {
    await prisma.organization.update({
      where: { id: team.organizationId },
      data: { rosterSize: { increment: 1 } },
    });
  }

  return team;
};

export const removeMember = async (teamId: string, playerId: string) => {
  // Get current team to filter out the member
  const currentTeam = await prisma.team.findUnique({ where: { id: teamId } });
  if (!currentTeam) return null;

  const updatedMembers = currentTeam.members.filter((m) => m.playerId !== playerId);

  const team = await prisma.team.update({
    where: { id: teamId },
    data: {
      members: {
        set: updatedMembers,
      },
    },
  });

  // Clear the player's teamId
  await prisma.player.update({
    where: { id: playerId },
    data: { teamId: null },
  });

  // Decrement the organization's rosterSize if team belongs to an org
  if (team.organizationId) {
    await prisma.organization.update({
      where: { id: team.organizationId },
      data: { rosterSize: { decrement: 1 } },
    });
  }

  return team;
};

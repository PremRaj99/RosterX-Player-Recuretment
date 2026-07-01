import prisma from '@/config/prisma';
import type { UpdateUserInput } from './user.type';

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    omit: { passwordHash: true },
  });
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  // Build update data explicitly to avoid exactOptionalPropertyTypes issues
  const updateData: Record<string, unknown> = {};

  if (data.displayName !== undefined) updateData.displayName = data.displayName;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.country !== undefined) updateData.country = data.country;

  // Handle settings update using Prisma's update envelope
  if (data.settings) {
    // Fetch current settings first, then merge
    const currentUser = await prisma.user.findUnique({
      where: { id },
      select: { settings: true },
    });

    if (currentUser) {
      const currentSettings = currentUser.settings;
      const mergedSettings = {
        showOnlineStatus: data.settings.showOnlineStatus ?? currentSettings.showOnlineStatus,
        allowDirectMessages: data.settings.allowDirectMessages ?? currentSettings.allowDirectMessages,
        showInSearch: data.settings.showInSearch ?? currentSettings.showInSearch,
        notificationPrefs: {
          applications: data.settings.notificationPrefs?.applications ?? currentSettings.notificationPrefs.applications,
          messages: data.settings.notificationPrefs?.messages ?? currentSettings.notificationPrefs.messages,
          teams: data.settings.notificationPrefs?.teams ?? currentSettings.notificationPrefs.teams,
          organizations: data.settings.notificationPrefs?.organizations ?? currentSettings.notificationPrefs.organizations,
          tournaments: data.settings.notificationPrefs?.tournaments ?? currentSettings.notificationPrefs.tournaments,
          platform: data.settings.notificationPrefs?.platform ?? currentSettings.notificationPrefs.platform,
          security: data.settings.notificationPrefs?.security ?? currentSettings.notificationPrefs.security,
          verification: data.settings.notificationPrefs?.verification ?? currentSettings.notificationPrefs.verification,
        },
      };

      updateData.settings = mergedSettings;
    }
  }

  return prisma.user.update({
    where: { id },
    data: updateData,
    omit: { passwordHash: true },
  });
};

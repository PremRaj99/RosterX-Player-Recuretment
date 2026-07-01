import prisma from '@/config/prisma';

export const getThreads = async (userId: string) => {
  return prisma.chatThread.findMany({
    where: {
      participantIds: { has: userId },
    },
    include: {
      participants: {
        omit: { passwordHash: true },
      },
      lastMessage: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
};

export const getThreadById = async (id: string) => {
  return prisma.chatThread.findUnique({
    where: { id },
    include: {
      participants: {
        omit: { passwordHash: true },
      },
    },
  });
};

export const createThread = async (participantIds: string[]) => {
  return prisma.chatThread.create({
    data: {
      participantIds,
    },
    include: {
      participants: {
        omit: { passwordHash: true },
      },
    },
  });
};

export const getMessages = async (threadId: string) => {
  return prisma.chatMessage.findMany({
    where: { threadId },
    include: {
      sender: {
        omit: { passwordHash: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const sendMessage = async (threadId: string, senderId: string, text: string) => {
  // Create the message
  const message = await prisma.chatMessage.create({
    data: {
      threadId,
      senderId,
      text,
      readByIds: [senderId],
    },
    include: {
      sender: {
        omit: { passwordHash: true },
      },
    },
  });

  // Update thread's last message
  await prisma.chatThread.update({
    where: { id: threadId },
    data: { lastMessageId: message.id },
  });

  return message;
};

'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { Message } from '@/generated/prisma/client';

export type ChatUser = {
    id: string;
    name: string | null;
    image: string | null;
    lastMessage: string | null;
    lastMessageTime: Date | null;
};

// Send a message
export async function sendMessage(receiverId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: 'Not authenticated' };
    }

    if (!content.trim()) {
        return { error: 'Message cannot be empty' };
    }

    try {
        const message = await prisma.message.create({
            data: {
                senderId: session.user.id,
                receiverId,
                content,
            },
        });
        return { message };
    } catch (error) {
        console.error('Failed to send message:', error);
        return { error: 'Failed to send message' };
    }
}

// Get messages between current user and another user
export async function getMessages(otherUserId: string) {
    const session = await auth();
    if (!session?.user?.id) return { messages: [] };

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: session.user.id },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
        return { messages };
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        return { error: 'Failed to fetch messages' };
    }
}

// Get list of conversations (users interacted with)
export async function getConversations() {
    const session = await auth();
    if (!session?.user?.id) return { conversations: [] };

    try {
        // This is a bit complex in raw Prisma without a dedicated Conversation model.
        // We find all messages where the user is sender or receiver.
        // Then we aggregate to find unique other users.

        const sentMessages = await prisma.message.findMany({
            where: { senderId: session.user.id },
            select: { receiverId: true, createdAt: true, content: true },
            orderBy: { createdAt: 'desc' },
        });

        const receivedMessages = await prisma.message.findMany({
            where: { receiverId: session.user.id },
            select: { senderId: true, createdAt: true, content: true },
            orderBy: { createdAt: 'desc' },
        });

        const distinctUsers = new Map<string, { lastMessage: string, lastMessageTime: Date }>();

        sentMessages.forEach(msg => {
            if (!distinctUsers.has(msg.receiverId)) {
                distinctUsers.set(msg.receiverId, { lastMessage: msg.content, lastMessageTime: msg.createdAt });
            }
        });

        receivedMessages.forEach(msg => {
            if (!distinctUsers.has(msg.senderId)) {
                // If we already have this user, check if this message is newer
                const existing = distinctUsers.get(msg.senderId);
                if (!existing || msg.createdAt > existing.lastMessageTime) {
                    distinctUsers.set(msg.senderId, { lastMessage: msg.content, lastMessageTime: msg.createdAt });
                }
            } else {
                distinctUsers.set(msg.senderId, { lastMessage: msg.content, lastMessageTime: msg.createdAt });
            }
        });

        const userIds = Array.from(distinctUsers.keys());

        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, image: true },
        });

        // Combine user data with last message info
        const conversations: ChatUser[] = users.map(user => {
            const info = distinctUsers.get(user.id);
            return {
                ...user,
                lastMessage: info?.lastMessage || null,
                lastMessageTime: info?.lastMessageTime || null,
            };
        }).sort((a, b) => {
            // Sort by last message time desc
            const timeA = a.lastMessageTime?.getTime() || 0;
            const timeB = b.lastMessageTime?.getTime() || 0;
            return timeB - timeA;
        });

        return { conversations };

    } catch (error) {
        console.error('Failed to fetch conversations:', error);
        return { error: 'Failed to fetch conversations' };
    }
}

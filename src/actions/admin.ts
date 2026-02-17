'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { Role } from '@/generated/prisma/client';

export type SystemStats = {
    users: number;
    guides: number;
    appointments: number;
    messages: number;
};

// Check if current user is admin
async function checkAdmin() {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
    return session;
}

export async function getSystemStats() {
    try {
        await checkAdmin();

        const [users, guides, appointments, messages] = await Promise.all([
            prisma.user.count({ where: { role: 'USER' } }),
            prisma.user.count({ where: { role: 'GUIDE' } }),
            prisma.appointment.count(),
            prisma.message.count(),
        ]);

        return { stats: { users, guides, appointments, messages } };
    } catch (error) {
        console.error('Failed to get stats:', error);
        return { error: 'Unauthorized or failed to fetch stats' };
    }
}

export async function getUsers() {
    try {
        await checkAdmin();

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        appointmentsAsSeeker: true,
                        appointmentsAsGuide: true,
                    }
                }
            }
        });

        // Flatten appointment counts for easier display
        const usersWithCounts = users.map(user => ({
            ...user,
            appointmentCount: user.role === 'GUIDE' ? user._count.appointmentsAsGuide : user._count.appointmentsAsSeeker,
        }));

        return { users: usersWithCounts };
    } catch (error) {
        console.error('Failed to get users:', error);
        return { error: 'Unauthorized or failed to fetch users' };
    }
}

export async function deleteUser(userId: string) {
    try {
        const session = await checkAdmin();

        if (session.user.id === userId) {
            return { error: 'Cannot delete yourself' };
        }

        await prisma.user.delete({
            where: { id: userId },
        });

        revalidatePath('/dashboard/admin/users');
        revalidatePath('/dashboard/admin'); // Stats might change
        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error('Failed to delete user:', error);
        return { error: 'Failed to delete user' };
    }
}

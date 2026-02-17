'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { Appointment, AppointmentStatus, Role } from '@/generated/prisma/client';

// Fetch all guides with their profiles
export async function getGuides() {
    try {
        const guides = await prisma.user.findMany({
            where: {
                role: 'GUIDE',
                profile: {
                    isAvailable: true,
                },
            },
            include: {
                profile: true,
            },
        });
        return { guides };
    } catch (error) {
        console.error('Failed to fetch guides:', error);
        return { error: 'Failed to fetch guides.' };
    }
}

// Book an appointment (Seeker only)
export async function bookAppointment(guideId: string, startTime: Date, notes?: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Not authenticated' };
    }

    if (session.user.role === 'GUIDE') {
        return { message: 'Guides cannot book appointments with other guides.' };
    }

    // Calculate end time (e.g., 1 hour default duration)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    // Generate a unique meeting link
    const meetingLink = `https://meet.jit.si/antigravity-${crypto.randomUUID()}`;

    try {
        await prisma.appointment.create({
            data: {
                seekerId: session.user.id,
                guideId,
                startTime,
                endTime,
                status: 'PENDING',
                notes,
                meetingLink,
            },
        });
    } catch (error) {
        console.error('Failed to book appointment:', error);
        return { message: 'Failed to book appointment.' };
    }

    revalidatePath('/dashboard/schedule');
    return { message: 'Appointment requested successfully.' };
}

// Get appointments for the current user
export async function getAppointments() {
    const session = await auth();
    if (!session?.user?.id) return { appointments: [] };

    const { id, role } = session.user;

    try {
        const whereClause = role === 'GUIDE' ? { guideId: id } : { seekerId: id };

        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            include: {
                seeker: { select: { name: true, image: true, email: true } },
                guide: { select: { name: true, image: true, email: true } },
            },
            orderBy: { startTime: 'asc' }
        });
        return { appointments };
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        return { error: 'Failed to fetch appointments.' };
    }
}

// Update appointment status (Guide only)
export async function updateAppointmentStatus(appointmentId: string, status: AppointmentStatus) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'GUIDE') {
        return { message: 'Unauthorized' };
    }

    try {
        // Verify the appointment belongs to this guide
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
        });

        if (!appointment || appointment.guideId !== session.user.id) {
            return { message: 'Appointment not found or unauthorized.' };
        }

        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status },
        });
    } catch (error) {
        console.error('Failed to update appointment:', error);
        return { message: 'Failed to update appointment.' };
    }

    revalidatePath('/dashboard/schedule');
    return { message: 'Appointment status updated.' };
}

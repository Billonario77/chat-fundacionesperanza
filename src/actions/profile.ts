'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Profile } from '@/generated/prisma/client';

const profileSchema = z.object({
    bio: z.string().min(10, 'Bio must be at least 10 characters long.'),
    specialties: z.string().optional(),
});

export type ProfileState = {
    errors?: {
        bio?: string[];
        specialties?: string[];
    };
    message?: string | null;
};

export async function createProfile(prevState: ProfileState, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Not authenticated' };
    }

    const validatedFields = profileSchema.safeParse({
        bio: formData.get('bio'),
        specialties: formData.get('specialties'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Profile.',
        };
    }

    const { bio, specialties } = validatedFields.data;

    try {
        await prisma.profile.create({
            data: {
                userId: session.user.id,
                bio,
                specialties,
                isAvailable: true, // Default to true
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        return { message: 'Database Error: Failed to Create Profile.' };
    }

    revalidatePath('/dashboard');
    redirect('/dashboard');
}

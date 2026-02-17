'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { JournalPrivacy } from '@/generated/prisma/client';
import { z } from 'zod';

const journalSchema = z.object({
    title: z.string().optional(),
    content: z.string().min(1, "Content cannot be empty"),
    mood: z.string().optional(),
    privacy: z.nativeEnum(JournalPrivacy),
});

export type JournalState = {
    errors?: {
        title?: string[];
        content?: string[];
        mood?: string[];
        privacy?: string[];
    };
    message?: string | null;
}

// Create a new journal entry
export async function createJournalEntry(prevState: JournalState, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Not authenticated' };
    }

    const privacyValue = formData.get('privacy') as JournalPrivacy || 'PRIVATE';

    const validatedFields = journalSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content'),
        mood: formData.get('mood'),
        privacy: privacyValue,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid fields',
        };
    }

    const { title, content, mood, privacy } = validatedFields.data;

    try {
        await prisma.journalEntry.create({
            data: {
                userId: session.user.id,
                title,
                content,
                mood,
                privacy,
            },
        });
    } catch (error) {
        console.error('Failed to create journal entry:', error);
        return { message: 'Failed to create entry.' };
    }

    revalidatePath('/dashboard/journal');
    return { message: 'Journal entry created.' };
}

// Get journal entries for the current user
export async function getJournalEntries() {
    const session = await auth();
    if (!session?.user?.id) return { entries: [] };

    try {
        const entries = await prisma.journalEntry.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        });
        return { entries };
    } catch (error) {
        console.error('Failed to fetch journal entries:', error);
        return { error: 'Failed to fetch entries.' };
    }
}

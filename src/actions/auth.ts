'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const LoginSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    password: z.string().min(1, {
        message: 'Password field must not be empty.',
    }),
});

const RegisterSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters.',
    }),
});

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const rawFormData = Object.fromEntries(formData.entries());
        const validatedFields = LoginSchema.safeParse(rawFormData);

        if (!validatedFields.success) {
            return 'Invalid fields';
        }

        await signIn('credentials', {
            ...validatedFields.data,
            redirect: false,
        }); // redirect: false to handle it manually or let the client handle it? 
        // Usually with server actions and redirect: true (default), it throws NEXT_REDIRECT

    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function login(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = LoginSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        // Return errors or throw
        return { error: 'Invalid fields' };
    }

    try {
        await signIn('credentials', validatedFields.data);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Invalid credentials.' };
                default:
                    return { error: 'Something went wrong.' };
            }
        }
        throw error;
    }
}

export async function register(prevState: string | undefined, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = RegisterSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return 'Invalid fields';
    }

    const { email, password, name } = validatedFields.data; // Extract data from validated fields

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return 'Failed to create user.';
    }

    redirect('/login');
}

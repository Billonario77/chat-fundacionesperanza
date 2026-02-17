'use client';

import { useActionState } from 'react';
import { register } from '@/actions/auth';
import Link from 'next/link';
import { Button } from '@/components/button';
import { Input } from '@/components/input';

export default function RegisterForm() {
    const [errorMessage, dispatch, isPending] = useActionState(
        register,
        undefined
    );

    return (
        <form action={dispatch} className="space-y-4">
            <div className="rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className="mb-3 text-2xl font-bold">
                    Create an Account
                </h1>

                <div className="w-full">
                    <div>
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="name">
                            Name
                        </label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                    {errorMessage && (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    )}
                </div>

                <Button className="mt-4 w-full" disabled={isPending}>
                    Register
                </Button>

                <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-500 hover:text-blue-600">
                        Log in
                    </Link>
                </div>
            </div>
        </form>
    );
}

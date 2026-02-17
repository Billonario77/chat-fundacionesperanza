'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createProfile, ProfileState } from '@/actions/profile';
import { Button } from '@/components/button';
import { Input } from '@/components/input'; // Assuming we have these or will use standard HTML for now if complex
// We might need a Textarea component, let's use standard textarea for now or create one.

export default function OnboardingForm({ userRole }: { userRole: string }) {
    const initialState: ProfileState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createProfile, initialState);

    return (
        <form action={formAction} className="space-y-6 max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Complete Your Profile</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Tell us a little about yourself to get started.
                </p>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Bio {userRole === 'GUIDE' ? '(Experience & Approach)' : '(Your Story)'}
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={userRole === 'GUIDE' ? "Share your experience and how you help others..." : "Share a bit about your journey..."}
                    required
                    minLength={10}
                />
                {state.errors?.bio && (
                    <p className="mt-1 text-sm text-red-600">
                        {state.errors.bio.map((error) => (
                            <span key={error} className="block">{error}</span>
                        ))}
                    </p>
                )}
            </div>

            {userRole === 'GUIDE' && (
                <div>
                    <label htmlFor="specialties" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Specialties (Comma separated)
                    </label>
                    <Input
                        id="specialties"
                        name="specialties"
                        type="text"
                        placeholder="e.g. Anxiety, Addiction, Meditation" // Assuming Input component handles props
                    />
                    {state.errors?.specialties && (
                        <p className="mt-1 text-sm text-red-600">
                            {state.errors.specialties.map((error) => (
                                <span key={error} className="block">{error}</span>
                            ))}
                        </p>
                    )}
                </div>
            )}

            {state.message && (
                <p className="text-sm text-red-600">{state.message}</p>
            )}

            <Button type="submit" className="w-full">
                Save & Continue
            </Button>
        </form>
    );
}

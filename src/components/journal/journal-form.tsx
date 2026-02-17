'use client';

import { useActionState } from 'react';
import { createJournalEntry, JournalState } from '@/actions/journal';
import { Button } from '@/components/button';
import { Input } from '@/components/input';

export default function JournalForm() {
    const initialState: JournalState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createJournalEntry, initialState);

    return (
        <form action={formAction} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">New Entry</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <Input id="title" name="title" placeholder="How was your day?" />
                </div>
                <div>
                    <label htmlFor="mood" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mood</label>
                    <Input id="mood" name="mood" placeholder="e.g. Grateful, Anxious" />
                </div>
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                <textarea
                    id="content"
                    name="content"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                    placeholder="Write your thoughts..."
                    required
                />
                {state.errors?.content && (
                    <p className="mt-1 text-sm text-red-600">{state.errors.content.join(', ')}</p>
                )}
            </div>

            <div>
                <label htmlFor="privacy" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Privacy</label>
                <select
                    id="privacy"
                    name="privacy"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                >
                    <option value="PRIVATE">Private</option>
                    <option value="SHARED_WITH_GUIDES">Shared with Guides</option>
                </select>
            </div>

            {state.message && (
                <p className={`text-sm ${state.message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                    {state.message}
                </p>
            )}

            <Button type="submit">Save Entry</Button>
        </form>
    );
}

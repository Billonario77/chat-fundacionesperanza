'use client';

import { JournalEntry } from '@/generated/prisma/client';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card';

export default function JournalList({ entries }: { entries: JournalEntry[] }) {
    if (entries.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400 text-center mt-8">No journal entries yet. Start writing!</p>;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
                <Card key={entry.id} className="flex flex-col h-full">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{entry.title || 'Untitled'}</CardTitle>
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${entry.privacy === 'PRIVATE' ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'}`}>
                                {entry.privacy.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {new Date(entry.createdAt).toLocaleDateString()} • {entry.mood || 'No Mood'}
                        </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
                            {entry.content}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

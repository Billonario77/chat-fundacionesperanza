'use client';

import { User, Profile } from '@/generated/prisma/client';
import { bookAppointment } from '@/actions/schedule';
import { Button } from '@/components/button';
import Link from 'next/link';
import { useTransition, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card'; // Assuming Card components exist or will be created

type GuideWithProfile = User & { profile: Profile | null };

export default function GuideList({ guides }: { guides: GuideWithProfile[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
            ))}
        </div>
    );
}

function GuideCard({ guide }: { guide: GuideWithProfile }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    const handleBook = () => {
        startTransition(async () => {
            // For simplicity in this iteration, we book for "now" + 1 hour or a hardcoded time.
            // In a real app, we'd open a modal to pick a date.
            // Let's just book a slot for tomorrow at 10am for demonstration.
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(10, 0, 0, 0);

            const result = await bookAppointment(guide.id, tomorrow, "Initial consultation");
            setMessage(result.message || null);
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{guide.name}</CardTitle>
                <p className="text-sm text-gray-500">{guide.email}</p>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {guide.profile?.bio || 'No bio available.'}
                </p>
                <div className="flex flex-wrap gap-2">
                    {guide.profile?.specialties?.split(',').map((s) => (
                        <span key={s} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-200">
                            {s.trim()}
                        </span>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex gap-2 w-full">
                    <Button onClick={handleBook} disabled={isPending} className="flex-1">
                        {isPending ? 'Booking...' : 'Book Appointment'}
                    </Button>
                    <Link href={`/dashboard/chat/${guide.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                            Message
                        </Button>
                    </Link>
                </div>
                {message && <p className="text-sm text-green-600 dark:text-green-400">{message}</p>}
            </CardFooter>
        </Card>
    );
}

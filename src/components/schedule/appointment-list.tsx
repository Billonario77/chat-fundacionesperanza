'use client';

import { Appointment, Role } from '@/generated/prisma/client';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/card';
import { updateAppointmentStatus } from '@/actions/schedule';
import { Button } from '@/components/button';
import Link from 'next/link';
import { useTransition } from 'react';

type AppointmentWithRelations = Appointment & {
    seeker: { name: string | null; email: string | null; image: string | null };
    guide: { name: string | null; email: string | null; image: string | null };
};

export default function AppointmentList({ appointments, userRole }: { appointments: AppointmentWithRelations[], userRole: Role }) {
    if (appointments.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400">No appointments scheduled.</p>;
    }

    return (
        <div className="space-y-4">
            {appointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} userRole={userRole} />
            ))}
        </div>
    );
}

function AppointmentCard({ appointment, userRole }: { appointment: AppointmentWithRelations, userRole: Role }) {
    const [isPending, startTransition] = useTransition();

    const handleStatusChange = (status: 'CONFIRMED' | 'CANCELLED') => {
        startTransition(async () => {
            await updateAppointmentStatus(appointment.id, status);
        });
    };

    const otherPersonName = userRole === 'GUIDE' ? appointment.seeker.name : appointment.guide.name;
    const otherPersonEmail = userRole === 'GUIDE' ? appointment.seeker.email : appointment.guide.email;

    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {new Date(appointment.startTime).toLocaleString()}
                </CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[appointment.status]}`}>
                    {appointment.status}
                </span>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-bold">{otherPersonName || 'Unknown User'}</p>
                <p className="text-xs text-gray-500">{otherPersonEmail}</p>
                {appointment.notes && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 italic">
                        "{appointment.notes}"
                    </p>
                )}
                {appointment.status === 'CONFIRMED' && (
                    <div className="mt-4">
                        <Link href={`/dashboard/meet/${appointment.id}`}>
                            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Join Video Call
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
            {userRole === 'GUIDE' && appointment.status === 'PENDING' && (
                <CardFooter className="flex gap-2">
                    <Button size="sm" onClick={() => handleStatusChange('CONFIRMED')} disabled={isPending} className="bg-green-600 hover:bg-green-700">
                        Confirm
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleStatusChange('CANCELLED')} disabled={isPending} className="bg-red-100 text-red-900 hover:bg-red-200">
                        Cancel
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

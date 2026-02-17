
import { auth } from '@/auth';
import { getAppointments } from '@/actions/schedule';
import AppointmentList from '@/components/schedule/appointment-list';
import { redirect } from 'next/navigation';

export default async function SchedulePage() {
    const session = await auth();
    if (!session?.user) redirect('/login');

    const { appointments, error } = await getAppointments();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Your Schedule</h1>
            {error && <p className="text-red-500">{error}</p>}
            {appointments && <AppointmentList appointments={appointments} userRole={session.user.role} />}
        </div>
    );
}

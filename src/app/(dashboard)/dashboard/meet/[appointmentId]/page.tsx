
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function MeetingPage({ params }: { params: Promise<{ appointmentId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');

    const { appointmentId } = await params;

    // Verify appointment exists and user is participant
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
    });

    if (!appointment) {
        return <div>Appointment not found</div>;
    }

    if (appointment.seekerId !== session.user.id && appointment.guideId !== session.user.id) {
        return <div>Unauthorized</div>;
    }

    // Use the stored link if available, otherwise generate one (fallback, though we should store it)
    // For MVP compatibility with existing records, we can generate if missing.
    const meetingUrl = appointment.meetingLink || `https://meet.jit.si/antigravity-${appointmentId}`;

    return (
        <div className="h-[calc(100vh-theme(spacing.24))] flex flex-col bg-gray-900">
            <div className="p-4 text-white bg-gray-800 flex justify-between items-center">
                <h1 className="text-lg font-semibold">Video Call</h1>
                <a href="/dashboard/schedule" className="text-sm hover:underline text-gray-300">Exit</a>
            </div>
            <iframe
                src={meetingUrl}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                className="w-full h-full border-0"
            ></iframe>
        </div>
    );
}

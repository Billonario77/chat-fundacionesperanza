
import { auth } from '@/auth';
import OnboardingForm from '@/components/profile/onboarding-form';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function OnboardingPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
    });

    if (existingProfile) {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome, {session.user.name || 'Friend'}
                    </h1>
                </div>
                <OnboardingForm userRole={session.user.role || 'USER'} />
            </div>
        </div>
    );
}

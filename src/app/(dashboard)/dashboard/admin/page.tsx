
import { auth } from '@/auth';
import { getSystemStats } from '@/actions/admin';
import StatsCard from '@/components/admin/stats-card';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

    const { stats, error } = await getSystemStats();

    if (error) {
        return <div className="p-6 text-red-500">Error loading stats: {error}</div>;
    }

    // Icons would be better as SVG components, but using emojis/text for MVP simplicity or just omit
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Link href="/dashboard/admin/users" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Manage Users
                </Link>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Users" value={stats.users} color="border-blue-500" />
                    <StatsCard title="Active Guides" value={stats.guides} color="border-purple-500" />
                    <StatsCard title="Appointments" value={stats.appointments} color="border-green-500" />
                    <StatsCard title="Messages" value={stats.messages} color="border-yellow-500" />
                </div>
            )}

            <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link href="/dashboard/guides" className="text-blue-600 hover:underline">View Guide Directory</Link>
                    <span className="text-gray-300">|</span>
                    <Link href="/dashboard/schedule" className="text-blue-600 hover:underline">View Your Schedule</Link>
                </div>
            </div>
        </div>
    );
}

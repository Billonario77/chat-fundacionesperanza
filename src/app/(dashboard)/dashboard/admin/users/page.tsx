
import { auth } from '@/auth';
import { getUsers } from '@/actions/admin';
import UserTable from '@/components/admin/user-table';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminUsersPage() {
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') redirect('/dashboard');

    const { users, error } = await getUsers();

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link href="/dashboard/admin" className="text-sm text-gray-500 hover:underline">← Back to Dashboard</Link>
                <h1 className="text-3xl font-bold mt-2">User Management</h1>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {users && <UserTable users={users} />}
        </div>
    );
}

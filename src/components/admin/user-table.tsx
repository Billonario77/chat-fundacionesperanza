'use client';

import { useState, useTransition } from 'react';
import { deleteUser } from '@/actions/admin';
import { Button } from '@/components/button';
import { Role } from '@/generated/prisma/client';

type UserData = {
    id: string;
    name: string | null;
    email: string | null;
    role: Role;
    createdAt: Date;
    appointmentCount: number;
};

export default function UserTable({ users }: { users: UserData[] }) {
    const [userList, setUserList] = useState(users);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = userList.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">All Users</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name/Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Activity (Apts)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                            <UserRow key={user.id} user={user} onDelete={(id) => setUserList(prev => prev.filter(u => u.id !== id))} />
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-4 text-center text-gray-500">No users found.</div>
                )}
            </div>
        </div>
    );
}

function UserRow({ user, onDelete }: { user: UserData, onDelete: (id: string) => void }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        startTransition(async () => {
            const result = await deleteUser(user.id);
            if (!result.error) {
                onDelete(user.id);
            } else {
                alert(result.error);
            }
        });
    };

    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold">
                        {user.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name || 'Unnamed'}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    user.role === 'GUIDE' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                    {user.role}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {user.appointmentCount}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {user.role !== 'ADMIN' && (
                    <Button
                        size="sm"
                        variant="secondary"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? '...' : 'Delete'}
                    </Button>
                )}
            </td>
        </tr>
    );
}

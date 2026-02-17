'use client';

import { ChatUser } from '@/actions/chat';
import Link from 'next/link';

export default function ConversationList({ conversations, currentUserId }: { conversations: ChatUser[], currentUserId?: string }) {
    if (conversations.length === 0) {
        return <p className="text-gray-500 p-4">No conversations yet.</p>;
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto w-full md:w-1/3 min-w-[300px]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Messages</h2>
            </div>
            <ul>
                {conversations.map((user) => (
                    <li key={user.id}>
                        <Link
                            href={`/dashboard/chat/${user.id}`}
                            className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out border-b border-gray-100 dark:border-gray-700 ${currentUserId === user.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300">
                                {user.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name || 'Unknown'}</h3>
                                    {user.lastMessageTime && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(user.lastMessageTime).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {user.lastMessage || 'No messages'}
                                </p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

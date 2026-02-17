
import { auth } from '@/auth';
import { getConversations } from '@/actions/chat';
import ConversationList from '@/components/chat/conversation-list';
import { redirect } from 'next/navigation';

export default async function ChatPage() {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');

    const { conversations, error } = await getConversations();

    return (
        <div className="flex h-[calc(100vh-theme(spacing.24))] bg-gray-100 dark:bg-gray-900 overflow-hidden rounded-lg shadow-xl">
            <ConversationList conversations={conversations || []} currentUserId={session.user.id} />
            <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400">
                <p>Select a conversation to start chatting.</p>
            </div>
        </div>
    );
}

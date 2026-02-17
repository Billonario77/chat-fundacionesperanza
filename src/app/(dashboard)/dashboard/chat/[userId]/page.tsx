
import { auth } from '@/auth';
import { getConversations } from '@/actions/chat';
import ConversationList from '@/components/chat/conversation-list';
import ChatWindow from '@/components/chat/chat-window';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function ChatUserPage({ params }: { params: Promise<{ userId: string }> }) {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');

    const { userId } = await params;

    // Verify other user exists
    const otherUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true },
    });

    if (!otherUser) {
        return <div>User not found</div>;
    }

    const { conversations } = await getConversations();

    // Ensure current conversation is in the list even if no messages yet (optimistic UI)
    // Actually, getConversations only returns existing chats. 
    // If starting a new chat, we might want to manually add the user to the list or handle it in the UI.
    // For simplicity, we just pass the existing list.

    return (
        <div className="flex h-[calc(100vh-theme(spacing.24))] bg-gray-100 dark:bg-gray-900 overflow-hidden rounded-lg shadow-xl">
            <div className="hidden md:block w-1/3 min-w-[300px]">
                <ConversationList conversations={conversations || []} currentUserId={otherUser.id} />
            </div>
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-800">
                <ChatWindow otherUserId={otherUser.id} otherUserName={otherUser.name || 'User'} />
            </div>
        </div>
    );
}

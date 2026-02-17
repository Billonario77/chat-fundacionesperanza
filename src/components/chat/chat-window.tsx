'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { getMessages, sendMessage } from '@/actions/chat';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Message } from '@/generated/prisma/client';

// Fetcher for SWR
const fetcher = async (key: string) => {
    const [, otherUserId] = key.split(':');
    const { messages, error } = await getMessages(otherUserId);
    if (error) throw new Error(error);
    return messages as Message[];
};

export default function ChatWindow({ otherUserId, otherUserName }: { otherUserId: string, otherUserName: string }) {
    const { data: messages, error, mutate } = useSWR(`chat:${otherUserId}`, fetcher, {
        refreshInterval: 120000, // Poll every 2 seconds
    });
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsSending(true);
        const content = newMessage;
        setNewMessage(''); // Optimistic clear

        // Optimistic update (optional, but good for UX)
        // await mutate([...(messages || []), { id: 'temp', content, senderId: 'me', receiverId: otherUserId, createdAt: new Date() } as Message], false);

        await sendMessage(otherUserId, content);
        await mutate(); // Re-fetch to get the real message with ID and server timestamp
        setIsSending(false);
    };

    if (error) return <div className="text-red-500">Failed to load chat.</div>;
    if (!messages) return <div className="text-gray-500">Loading...</div>;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Chat with {otherUserName}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">No messages yet. Say hello!</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderId === otherUserId ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.senderId === otherUserId
                                    ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none'
                                    : 'bg-blue-500 text-white rounded-br-none'
                                }`}>
                                <p>{msg.content}</p>
                                <p className="text-[10px] opacity-70 mt-1 text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isSending}
                    className="flex-1"
                />
                <Button type="submit" disabled={isSending || !newMessage.trim()}>
                    Send
                </Button>
            </form>
        </div>
    );
}

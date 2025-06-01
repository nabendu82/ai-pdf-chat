'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as React from 'react';

interface Doc {
    pageContent?: string;
    metdata?: {
        loc?: {
            pageNumber?: number;
        };
        source?: string;
    };
}
interface IMessage {
    role: 'assistant' | 'user';
    content?: string;
    documents?: Doc[];
    timestamp: string;
}

const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatComponent: React.FC = () => {
    const [message, setMessage] = React.useState<string>('');
    const [messages, setMessages] = React.useState<IMessage[]>([]);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Scroll to bottom on new message
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendChatMessage = async () => {
        const userMsg: IMessage = {
            role: 'user',
            content: message,
            timestamp: getCurrentTimestamp(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setMessage('');
        const res = await fetch(`http://localhost:8000/chat?message=${message}`);
        const data = await res.json();
        const assistantMsg: IMessage = {
            role: 'assistant',
            content: data?.message,
            documents: data?.docs,
            timestamp: getCurrentTimestamp(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
    };

    return (
        <div className="relative h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className="py-4 px-8 border-b bg-white font-bold text-lg shadow-sm sticky top-0 z-10">
                Dog Chat
            </div>
            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-end mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.role === 'assistant' && (
                            <div className="mr-2 flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xl">🤖</div>
                            </div>
                        )}
                        <div
                            className={`max-w-xl px-4 py-3 rounded-lg shadow relative
                                ${message.role === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                }`}
                        >
                            <div className="mb-1 whitespace-pre-line">{message.content}</div>
                            {message.role === 'assistant' && message.documents && (
                                <div className="mt-3">
                                    <div className="font-semibold mb-2">Relevant PDF Snippets:</div>
                                    {message.documents.map((doc, docIdx) => (
                                        <div
                                            key={docIdx}
                                            className="mb-3 p-3 bg-white border border-gray-200 rounded"
                                        >
                                            <div className="text-sm whitespace-pre-line">{doc.pageContent}</div>
                                            {doc.metdata?.loc?.pageNumber && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Page: {doc.metdata.loc.pageNumber}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                                {message.timestamp}
                            </div>
                        </div>
                        {message.role === 'user' && (
                            <div className="ml-2 flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xl text-white">🧑</div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {/* Input bar */}
            <div className="absolute bottom-0 left-0 w-full flex gap-3 px-6 py-4 bg-white border-t">
                <Input
                    value={message}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setMessage(e.target.value)}
                    placeholder="Type your message here"
                    onKeyDown={e => {
                        if (e.key === 'Enter' && message.trim()) handleSendChatMessage();
                    }}
                />
                <Button onClick={handleSendChatMessage} disabled={!message.trim()}>Send</Button>
            </div>
        </div>
    );
};

export default ChatComponent;

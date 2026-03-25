import React from 'react';
import { Bot } from 'lucide-react';
import { MessageItem } from './MessageItem';

export function MessageList({ messages, isLoading, bottomRef }) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
          <Bot size={48} className="opacity-20" />
          <p>Posez-moi une question pour commencer...</p>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageItem key={`${message.role}-${index}`} message={message} isLoading={isLoading} />
      ))}
      <div ref={bottomRef} />
    </main>
  );
}

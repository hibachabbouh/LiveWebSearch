import React from 'react';
import { Bot } from 'lucide-react';

export function ChatHeader({ checkpointId }) {
  return (
    <header className="p-4 border-b bg-white flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Bot className="text-white w-5 h-5" />
        </div>
        <h1 className="font-bold text-lg tracking-tight">Llama-3 Agent</h1>
      </div>
      
    </header>
  );
}

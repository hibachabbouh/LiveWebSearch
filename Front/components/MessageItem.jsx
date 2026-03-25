import React from 'react';
import { Bot, Globe, Loader2, User } from 'lucide-react';
import { cn } from '../utils/cn';

function SourcePills({ sources }) {
  if (!sources?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {sources.map((url, index) => {
        let hostname = url;
        try {
          hostname = new URL(url).hostname;
        } catch {
          hostname = url;
        }

        return (
          <a
            key={`${url}-${index}`}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-600 truncate max-w-[150px]"
          >
            {hostname}
          </a>
        );
      })}
    </div>
  );
}

export function MessageItem({ message, isLoading }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-4 max-w-3xl mx-auto', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
          isUser ? 'bg-slate-800' : 'bg-indigo-100 text-indigo-600'
        )}
      >
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} />}
      </div>

      <div className={cn('flex flex-col space-y-2', isUser ? 'items-end' : 'items-start')}>
        {message.isSearching && (
          <div className="flex items-center gap-2 text-xs text-indigo-500 animate-pulse font-medium">
            <Globe size={14} /> Recherche : {message.searchQuery}...
          </div>
        )}

        <div
          className={cn(
            'px-4 py-3 rounded-2xl shadow-sm border',
            isUser ? 'bg-indigo-600 text-white border-transparent' : 'bg-white border-slate-200'
          )}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          {!message.content && isLoading && !isUser && <Loader2 className="animate-spin" />}
        </div>

        <SourcePills sources={message.sources} />
      </div>
    </div>
  );
}

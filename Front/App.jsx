import React, { useEffect, useRef, useState } from 'react';
import { ChatComposer } from './components/ChatComposer';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { useChatStream } from './hooks/useChatStream';

const App = () => {
  const [input, setInput] = useState('');
  const { messages, isLoading, checkpointId, sendMessage, stopStream } = useChatStream();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input, () => setInput(''));
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
      <ChatHeader checkpointId={checkpointId} />
      <MessageList messages={messages} isLoading={isLoading} bottomRef={scrollRef} />
      <ChatComposer
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        onStop={stopStream}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;

import { useCallback, useEffect, useRef, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';

export function useChatStream() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkpointId, setCheckpointId] = useState(null);
  const abortControllerRef = useRef(null);

  const updateLastAssistantMessage = useCallback((updater) => {
    setMessages((previousMessages) => {
      if (previousMessages.length === 0) {
        return previousMessages;
      }

      const nextMessages = [...previousMessages];
      const lastMessageIndex = nextMessages.length - 1;
      nextMessages[lastMessageIndex] = updater(nextMessages[lastMessageIndex]);
      return nextMessages;
    });
  }, []);

  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setIsLoading(false);
  }, []);

  const processSSEChunk = useCallback((rawChunk, onEvent) => {
    const lines = rawChunk.split('\n');

    for (const line of lines) {
      if (!line.startsWith('data: ')) {
        continue;
      }

      const payload = line.slice(6).trim();
      if (!payload) {
        continue;
      }

      try {
        const data = JSON.parse(payload);
        onEvent(data);
      } catch (error) {
        console.error('Invalid SSE event payload:', error);
      }
    }
  }, []);

  const sendMessage = useCallback(
    (rawInput, onSent) => {
      const userMessage = rawInput.trim();
      if (!userMessage || isLoading) {
        return;
      }

      onSent?.();
      setIsLoading(true);

      setMessages((previousMessages) => [
        ...previousMessages,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: '', sources: [], isSearching: false, searchQuery: '' },
      ]);

      stopStream();
      setIsLoading(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const handleEvent = (data) => {
        if (data.type === 'checkpoint') {
          setCheckpointId(data.checkpoint_id);
          return;
        }

        if (data.type === 'content') {
          updateLastAssistantMessage((previousMessage) => ({
            ...previousMessage,
            content: previousMessage.content + data.content,
          }));
          return;
        }

        if (data.type === 'search_start') {
          updateLastAssistantMessage((previousMessage) => ({
            ...previousMessage,
            isSearching: true,
            searchQuery: data.query || '',
          }));
          return;
        }

        if (data.type === 'search_results') {
          updateLastAssistantMessage((previousMessage) => ({
            ...previousMessage,
            isSearching: false,
            sources: Array.isArray(data.urls) ? data.urls : [],
          }));
          return;
        }

        if (data.type === 'end') {
          stopStream();
        }
      };

      (async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/chat_stream`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: userMessage,
              checkpoint_id: checkpointId,
            }),
            signal: controller.signal,
          });

          if (!response.ok || !response.body) {
            stopStream();
            return;
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split('\n\n');
            buffer = events.pop() || '';

            for (const eventText of events) {
              processSSEChunk(eventText, handleEvent);
            }
          }

          if (buffer) {
            processSSEChunk(buffer, handleEvent);
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Stream request failed:', error);
          }
        } finally {
          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null;
            setIsLoading(false);
          }
        }
      })();
    },
    [checkpointId, isLoading, processSSEChunk, stopStream, updateLastAssistantMessage]
  );

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    messages,
    isLoading,
    checkpointId,
    sendMessage,
    stopStream,
  };
}

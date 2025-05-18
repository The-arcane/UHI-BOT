import React, { useEffect, useRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChatContext } from '../context/ChatContext';

const ChatInterface: React.FC = () => {
  const { messages, isLoading } = useChatContext();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 overflow-y-auto hidden md:block">
        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        <ul className="space-y-2">
          <li className="cursor-pointer text-blue-600 hover:underline">Chat with doctor</li>
          <li className="cursor-pointer text-blue-600 hover:underline">Diet tips</li>
          <li className="cursor-pointer text-blue-600 hover:underline">Exercise advice</li>
        </ul>
      </aside>

      {/* Main chat window */}
      <div className="flex flex-col flex-1 bg-white">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <HeartPulseIcon className="h-16 w-16 text-blue-200 mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">Welcome to HealthBot</h2>
              <p className="text-gray-500 max-w-md">
                Ask me any health-related questions. I can provide general health information,
                but I'm not a substitute for professional medical advice.
              </p>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <MessageInput disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

const HeartPulseIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  );
};

export default ChatInterface;

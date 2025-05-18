import React from 'react';
import { HeartPulse } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

const Header: React.FC = () => {
  const { clearChat } = useChatContext();

  return (
    <header className="bg-white shadow-sm">
      <div className="w-full px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <HeartPulse className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">HealthBot</h1>
        </div>
        <button
          onClick={clearChat}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          New Chat
        </button>
      </div>
    </header>
  );
};

export default Header;

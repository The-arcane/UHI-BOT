import React from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <ChatProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </ChatProvider>
  );
}

export default App;


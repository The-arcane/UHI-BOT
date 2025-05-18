// import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
// import { Message } from '../types';
// import { sendMessageToGemini } from '../services/geminiService';

// interface ChatContextType {
//   messages: Message[];
//   isLoading: boolean;
//   sendMessage: (text: string) => void;
//   clearChat: () => void;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export const useChatContext = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error('useChatContext must be used within a ChatProvider');
//   }
//   return context;
// };

// interface ChatProviderProps {
//   children: ReactNode;
// }

// export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const sendMessage = useCallback(async (text: string) => {
//     // Add user message
//     const userMessage: Message = { text, isBot: false };
//     setMessages(prev => [...prev, userMessage]);
    
//     // Set loading state
//     setIsLoading(true);
    
//     try {
//       // Call API and wait for response
//       const response = await sendMessageToGemini(text, messages);
      
//       // Add bot response
//       const botMessage: Message = { text: response, isBot: true };
//       setMessages(prev => [...prev, botMessage]);
//     } catch (error) {
//       console.error('Error sending message:', error);
//       // Add error message
//       const errorMessage: Message = { 
//         text: "I'm sorry, I couldn't process your request. Please try again later.", 
//         isBot: true 
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [messages]);

//   const clearChat = useCallback(() => {
//     setMessages([]);
//   }, []);

//   return (
//     <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (text: string, fromVoice?: boolean) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (text: string, fromVoice: boolean = false) => {
    if (!text.trim()) return;

    const userMessage: Message = { text, isBot: false };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);

    try {
      const response = await sendMessageToGemini(text, messages);
      const botMessage: Message = { text: response, isBot: true };
      setMessages(prev => [...prev, botMessage]);

      if (fromVoice) {
        speak(response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: "I'm sorry, I couldn't process your request. Please try again later.",
        isBot: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
}

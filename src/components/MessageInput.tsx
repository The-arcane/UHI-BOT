import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { useChatContext } from '../context/ChatContext';

const MessageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { sendMessage, isLoading } = useChatContext();

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput('');
      sendMessage(transcript, true); // true = fromVoice
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 px-2">
      <div className="flex-1 relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your health question or use the mic..."
          rows={1}
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
          style={{ minHeight: '50px', maxHeight: '150px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>
      <button type="button" onClick={handleMicClick} className={`p-3.5 rounded-full ${
          isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}
          title="Toggle voice input"
      >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </button>
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className={`p-3 rounded-full ${
          isLoading || !input.trim()
            ? 'bg-gray-200 text-gray-500'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } transition-colors`}
      >
        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </button>
    </form>
  );
};

export default MessageInput;


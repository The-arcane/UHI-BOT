import React from 'react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
          <div 
            className={`max-w-[80%] p-4 rounded-lg ${
              message.isBot 
                ? 'bg-blue-50 text-gray-800' 
                : 'bg-blue-600 text-white'
            }`}
          >
            {message.isBot ? (
              <div className="prose" dangerouslySetInnerHTML={{ __html: formatBotMessage(message.text) }} />
            ) : (
              <p>{message.text}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const formatBotMessage = (text: string): string => {
  let formattedText = text;

  // Headings (### Text or 🌩️ Heading)
  formattedText = formattedText.replace(/(###|🌩️)\s?(.+)/g, '<h3 class="text-lg font-semibold text-blue-700 mb-2">$2</h3>');

  // Important notes (**💡 Important:** Text)
  formattedText = formattedText.replace(
    /\*\*💡 Important:\*\* (.+)/g,
    '<div class="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800"><span class="font-bold">💡 Important:</span> $1</div>'
  );
  formattedText = formattedText.replace(
    /💡 Important: (.+)/g,
    '<div class="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800"><span class="font-bold">💡 Important:</span> $1</div>'
  );

  // ✅ Bullet points (handles both `- Bullet` and `* Bullet`)
  formattedText = formattedText.replace(/(?:^|\n)[*-]\s(.+)/g, '<li>$1</li>');

  // ✅ Wrap consecutive <li> into <ul>
  formattedText = formattedText.replace(/(<li>[\s\S]+?<\/li>)/g, '<ul class="my-2 list-disc pl-5">$1</ul>');

  // ✅ Inline bold (**text**)
  formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // ✅ Inline italic (*text*)
  formattedText = formattedText.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // ✅ Newline spacing (preserve emoji bullets and line breaks)
  formattedText = formattedText.replace(/\n{2,}/g, '<br/><br/>');

  return formattedText;
};


export default MessageList;
import React from 'react';
import { MessageCircle } from 'lucide-react';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No messages yet. Start a conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageList;

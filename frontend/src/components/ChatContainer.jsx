import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Sidebar from './Sidebar';
import ErrorAlert from './ErrorAlert';
import { useChat } from '../context/ChatContext';
import { createMessage, validateMessage, handleApiError } from '../utils/helpers';
import chatService from '../services/chatService';

const ChatContainer = () => {
  const { 
    messages, 
    setMessages, 
    isLoading, 
    setIsLoading, 
    error, 
    setErrorMessage, 
    clearError 
  } = useChat();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate initial bot message
  useEffect(() => {
    const initialMessage = {
      id: 1,
      text: "Hello! 👋 I'm your chatbot assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, []);

  const handleSendMessage = async (text) => {
    if (!validateMessage(text)) {
      setErrorMessage('Please enter a valid message.');
      return;
    }

    // Add user message
    const userMessage = createMessage(text, 'user', messages.length + 1);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    clearError();

    try {
      // Call the actual API
      const response = await chatService.sendMessage(text);
      const botMessage = createMessage(
        response.reply || 'Sorry, I could not process your message.',
        'bot',
        messages.length + 2
      );
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg = handleApiError(err);
      setErrorMessage(errorMsg);
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! 👋 I'm your chatbot assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setSelectedCategory(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ErrorAlert message={error} onClose={clearError} />
      
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Messages List */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Message Input */}
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;

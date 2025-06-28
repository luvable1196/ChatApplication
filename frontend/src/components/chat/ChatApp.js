import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';

// API Configuration - Replace with your backend URL
const API_BASE_URL = 'http://localhost:5000/api';
const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,
  messages: `${API_BASE_URL}/messages`
};

const ChatApp = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load existing messages when component mounts
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.messages, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setLoading(true);

    // Optimistically add the message to the UI
    const tempMessage = {
      id: Date.now(),
      text: messageText,
      sender: user.username,
      timestamp: new Date().toISOString(),
      isUser: true
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await fetch(API_ENDPOINTS.chat, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          userId: user.id
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // Replace temp message with server response
        setMessages(prev => [
          ...prev.slice(0, -1), // Remove temp message
          {
            id: data.userMessage?.id || tempMessage.id,
            text: messageText,
            sender: user.username,
            timestamp: data.userMessage?.timestamp || tempMessage.timestamp,
            isUser: true
          },
          {
            id: data.botMessage?.id || Date.now() + 1,
            text: data.response || data.message,
            sender: 'AI Assistant',
            timestamp: data.botMessage?.timestamp || new Date().toISOString(),
            isUser: false
          }
        ]);
      } else {
        // Remove temp message on error
        setMessages(prev => prev.slice(0, -1));
        console.error('Failed to send message:', data.message);
      }
    } catch (err) {
      // Remove temp message on error
      setMessages(prev => prev.slice(0, -1));
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {message.sender}
                </div>
                <div>{message.text}</div>
                <div className={`text-xs mt-1 ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={loading || !newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
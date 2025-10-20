'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ChatMessage {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  timestamp: Date;
}

interface MeetingChatProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const MeetingChat: React.FC<MeetingChatProps> = ({ isOpen, onToggle, isMobile = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock current user - in real implementation, get from Clerk
  const currentUser = {
    id: 'current-user',
    name: 'You',
    image: undefined
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      user: currentUser,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // In real implementation, send to Stream Chat API
    // Example: sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-20 right-4 z-50 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-3 shadow-lg transition-all duration-300 border border-blue-400/20"
        size="sm"
      >
        <MessageCircle size={20} className="text-white" />
        {messages.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {messages.length > 99 ? '99+' : messages.length}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div className={cn(
      "fixed z-50 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl",
      isMobile 
        ? "inset-4 top-16" 
        : "bottom-20 right-4 w-80 h-96"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-blue-400" />
          <h3 className="text-white font-semibold">Meeting Chat</h3>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg p-1"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 h-64">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-center gap-2">
                {message.user.image ? (
                  <Image 
                    src={message.user.image} 
                    alt={message.user.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white">
                    {message.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-white">
                  {message.user.name}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div className="ml-8 text-gray-200 text-sm leading-relaxed">
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={500}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2"
          >
            <Send size={16} />
          </Button>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Press Enter to send • {500 - newMessage.length} characters left
        </div>
      </div>
    </div>
  );
};

export default MeetingChat;
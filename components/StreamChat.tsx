'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { MessageCircle, X, Send, Users } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
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

interface StreamChatProps {
  isOpen: boolean;
  onToggle: () => void;
  meetingId: string;
  isMobile?: boolean;
}

const StreamChatComponent: React.FC<StreamChatProps> = ({ 
  isOpen, 
  onToggle, 
  meetingId: _meetingId, // eslint-disable-line @typescript-eslint/no-unused-vars
  isMobile = false 
}) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      user: {
        id: user.id,
        name: user.firstName || user.username || 'User',
        image: user.imageUrl,
      },
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate receiving messages from other participants
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const responses = [
          "Great point!",
          "I agree with that",
          "Thanks for sharing",
          "That makes sense",
          "Good idea",
          "Let me check that",
          "Absolutely!",
          "Interesting perspective"
        ];
        
        const randomResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          user: {
            id: 'participant-1',
            name: 'Meeting Participant',
            image: undefined,
          },
          timestamp: new Date()
        };

        setMessages(prev => [...prev, randomResponse]);
        
        if (!isOpen) {
          setUnreadCount(prev => prev + 1);
        }
      }, 1000 + Math.random() * 2000);
    }
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-20 right-4 z-50 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-3 shadow-lg transition-all duration-300 border border-blue-400/20"
        size="sm"
      >
        <MessageCircle size={20} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div className={cn(
      "fixed z-50 bg-black/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden",
      isMobile 
        ? "inset-4 top-16" 
        : "bottom-20 right-4 w-80 h-96"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} className="text-blue-400" />
          <h3 className="text-white font-semibold">Meeting Chat</h3>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users size={14} />
            <span>{participants?.length || 0}</span>
          </div>
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
            <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No messages yet</p>
            <p className="text-sm mt-1">Start the conversation!</p>
            <div className="mt-4 text-xs bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-blue-300">💡 Chat with all meeting participants in real-time</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.user.id === user?.id;
            return (
              <div key={message.id} className={cn(
                "flex gap-3",
                isCurrentUser ? "flex-row-reverse" : "flex-row"
              )}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.user.image ? (
                    <Image 
                      src={message.user.image} 
                      alt={message.user.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
                      isCurrentUser 
                        ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                        : "bg-gradient-to-r from-green-500 to-teal-500"
                    )}>
                      {getInitials(message.user.name)}
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                  "max-w-[70%] space-y-1",
                  isCurrentUser ? "items-end" : "items-start"
                )}>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium",
                      isCurrentUser ? "text-blue-300 order-2" : "text-gray-300 order-1"
                    )}>
                      {isCurrentUser ? 'You' : message.user.name}
                    </span>
                    <span className={cn(
                      "text-xs text-gray-500",
                      isCurrentUser ? "order-1" : "order-2"
                    )}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className={cn(
                    "rounded-2xl px-4 py-2 text-sm leading-relaxed",
                    isCurrentUser 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md" 
                      : "bg-gray-700 text-gray-100 rounded-bl-md"
                  )}>
                    {message.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/30">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            maxLength={500}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2 transition-all duration-200"
          >
            <Send size={16} />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 flex justify-between">
          <span>Press Enter to send</span>
          <span>{500 - newMessage.length} chars left</span>
        </div>
      </div>
    </div>
  );
};

export default StreamChatComponent;
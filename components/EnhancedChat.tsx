'use client'

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useUser } from '@clerk/nextjs';
import { MessageCircle, X, Send, Users } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { useChat } from '@/hooks/useChat';

interface EnhancedChatProps {
  isOpen: boolean;
  onToggle: () => void;
  meetingId: string;
  isMobile?: boolean;
  showFloatingButton?: boolean;
  onUnreadCountChange?: (count: number) => void;
}

const EnhancedChat: React.FC<EnhancedChatProps> = memo(({ 
  isOpen, 
  onToggle, 
  meetingId, 
  isMobile = false,
  showFloatingButton = false,
  onUnreadCountChange
}) => {
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState('');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  
  const {
    messages,
    unreadCount,
    isConnected,
    messagesEndRef,
    sendMessage,
    markAsRead,
  } = useChat(meetingId);

  // Notify parent component of unread count changes
  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  useEffect(() => {
    if (isOpen) {
      markAsRead();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen, markAsRead]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = '40px';
      const scrollHeight = inputRef.current.scrollHeight;
      const maxHeight = 120;
      inputRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const userInfo = {
      id: user.id,
      name: user.firstName || user.username || 'User',
      image: user.imageUrl,
    };

    sendMessage(newMessage.trim(), userInfo);
    setNewMessage('');
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

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set([...prev, imageUrl]));
  };

  const shouldShowImage = (imageUrl: string | undefined) => {
    return imageUrl && !imageErrors.has(imageUrl);
  };

  const getRandomColor = (userId: string) => {
    const colors = [
      'from-red-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-purple-500 to-indigo-500',
      'from-yellow-500 to-orange-500',
      'from-pink-500 to-rose-500',
    ];
    
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (!isOpen && showFloatingButton) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-20 right-4 z-50 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 p-3 shadow-lg transition-all duration-300 border border-blue-400/20 hover:scale-110"
        size="sm"
      >
        <MessageCircle size={20} className="text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </Button>
    );
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cn(
      "chat-container fixed z-50 bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col",
      isMobile 
        ? "chat-mobile inset-4 top-16 max-h-[calc(100vh-80px)]" 
        : "bottom-20 right-4 w-80 h-96 max-w-[calc(100vw-32px)]"
    )}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle size={20} className="text-blue-400" />
            {isConnected && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <div>
            <h3 className="text-white font-semibold">Meeting Chat</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Users size={12} />
              <span>{participants?.length || 0} online</span>
              {isConnected && <span className="text-green-400">• Connected</span>}
            </div>
          </div>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No messages yet</p>
            <p className="text-sm mt-1">Start the conversation!</p>
            <div className="mt-4 text-xs bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <p className="text-blue-300">💬 Chat with all meeting participants in real-time</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.user.id === user?.id;
            const isSystemMessage = message.type === 'system';
            
            if (isSystemMessage) {
              return (
                <div key={message.id} className="text-center">
                  <div className="inline-block bg-gray-700/50 text-gray-300 text-xs px-3 py-1 rounded-full">
                    {message.text}
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className={cn(
                "flex gap-3 animate-fade-in max-w-full",
                isCurrentUser ? "flex-row-reverse" : "flex-row"
              )}>
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {shouldShowImage(message.user.image) ? (
                    <div className="relative">
                      <img 
                        src={message.user.image!} 
                        alt={message.user.name}
                        className="w-8 h-8 rounded-full ring-2 ring-white/10 object-cover"
                        onError={() => {
                          console.log('Image failed to load:', message.user.image);
                          handleImageError(message.user.image!);
                        }}
                        onLoad={() => {
                          console.log('Image loaded successfully:', message.user.image);
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10",
                        isCurrentUser 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                          : `bg-gradient-to-r ${getRandomColor(message.user.id)}`
                      )}
                      title={message.user.image ? `Image failed to load: ${message.user.image}` : 'No image provided'}
                    >
                      {getInitials(message.user.name)}
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={cn(
                  "max-w-[75%] min-w-0 space-y-1 flex flex-col",
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
                    "rounded-2xl px-4 py-2 text-sm leading-relaxed relative break-words overflow-wrap-anywhere word-break-break-word",
                    isCurrentUser 
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md shadow-lg" 
                      : "bg-gray-700/80 text-gray-100 rounded-bl-md border border-gray-600/50"
                  )}>
                    <span className="whitespace-pre-wrap">{message.text}</span>
                    {/* Message reactions placeholder */}
                    <div className="absolute -bottom-2 right-2 hidden group-hover:flex gap-1">
                      {/* Add emoji reactions here */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-white/10 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="flex gap-2 items-end min-w-0">
          <div className="flex-1 relative min-w-0">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="chat-input w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 pr-20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              maxLength={500}
            />
            {/* <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-1 h-6 w-6"
              >
                <Smile size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white p-1 h-6 w-6"
              >
                <Paperclip size={14} />
              </Button>
            </div> */}
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl p-2 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
          >
            <Send size={16} />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 flex justify-between">
          <span>Press Enter to send</span>
          <span className={cn(
            "transition-colors",
            newMessage.length > 450 ? "text-red-400" : "text-gray-500"
          )}>
            {500 - newMessage.length} chars left
          </span>
        </div>
      </div>
    </div>
  );
});

EnhancedChat.displayName = 'EnhancedChat';

export default EnhancedChat;
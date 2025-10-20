import { useState, useCallback, useRef, useEffect } from 'react';
import { useCall } from '@stream-io/video-react-sdk';

export interface ChatMessage {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  timestamp: Date;
  type: 'message' | 'system';
}

export const useChat = (meetingId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const call = useCall();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    setMessages(prev => {
      // Prevent duplicate messages - optimized check
      const isDuplicate = prev.length > 0 && 
        prev[prev.length - 1].text === newMessage.text && 
        prev[prev.length - 1].user.id === newMessage.user.id &&
        Math.abs(prev[prev.length - 1].timestamp.getTime() - newMessage.timestamp.getTime()) < 1000;
      
      if (isDuplicate) return prev;
      return [...prev, newMessage];
    });
    return newMessage;
  }, []);

  const addSystemMessage = useCallback((text: string) => {
    return addMessage({
      text,
      user: { id: 'system', name: 'System' },
      type: 'system',
    });
  }, [addMessage]);

  const sendMessage = useCallback(async (text: string, user: ChatMessage['user']) => {
    if (!call) {
      console.error('No active call to send message');
      return;
    }

    const messageData = {
      text,
      user,
      messageType: 'message' as const,
      timestamp: new Date().toISOString(),
    };

    try {
      // Broadcast message to all participants using Stream's custom events
      await call.sendCustomEvent({
        type: 'chat.message',
        custom: messageData,
      });

      // Add to local state immediately for the sender
      addMessage({
        text: messageData.text,
        user: messageData.user,
        type: messageData.messageType,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [call, addMessage]);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const incrementUnread = useCallback(() => {
    setUnreadCount(prev => prev + 1);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setUnreadCount(0);
  }, []);

  // Initialize chat and listen for incoming messages
  useEffect(() => {
    if (!call) return;

    setIsConnected(true);

    // Listen for custom chat events from other participants
    const unsubscribe = call.on('custom', (event) => {
      if (event.type === 'custom' && event.custom) {
        const customData = event.custom as {
          text?: string;
          user?: { id: string; name: string; image?: string };
          messageType?: 'message' | 'system';
          timestamp?: string;
        };

        // Check if this is a chat message
        if (customData.text && customData.user && customData.messageType) {
          // Add message from other participants (not from self)
          if (customData.user.id !== call.state.localParticipant?.userId) {
            addMessage({
              text: customData.text,
              user: customData.user,
              type: customData.messageType,
            });
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [call, addMessage]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return {
    messages,
    unreadCount,
    isConnected,
    messagesEndRef,
    sendMessage,
    addSystemMessage,
    markAsRead,
    incrementUnread,
    clearMessages,
    scrollToBottom,
  };
};
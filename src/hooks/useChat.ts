import { useState, useEffect, useCallback } from 'react';
import { Message, Conversation, MessageReport } from '../types/chat';
import { chatService } from '../services/chat';
import { useAuth } from '../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const { state: { user, token } } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with some mock data for demonstration
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: uuidv4(),
        participants: ['support-1', 'user-1'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isBlocked: false,
        isEncrypted: true,
      },
      {
        id: uuidv4(),
        participants: ['support-1', 'user-2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isBlocked: false,
        isEncrypted: true,
      },
    ];

    setConversations(mockConversations);
    setLoading(false);
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    recipientId: string,
    isAnonymous: boolean = false
  ) => {
    try {
      if (!user || !activeConversation) return;

      const newMessage: Message = {
        id: uuidv4(),
        conversationId: activeConversation.id,
        senderId: user.id,
        recipientId,
        type: 'text',
        content,
        encryptedContent: content, // In real app, this would be encrypted
        timestamp: new Date().toISOString(),
        status: 'sent',
        isAnonymous,
        isReported: false,
      };

      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [user, activeConversation]);

  const reportMessage = useCallback(async (
    messageId: string,
    reason: string,
    description?: string
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');

      const report: MessageReport = {
        id: uuidv4(),
        messageId,
        reporterId: user.id,
        reason,
        description,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      // Update message as reported
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isReported: true } : msg
        )
      );

      return report;
    } catch (error) {
      console.error('Error reporting message:', error);
      throw error;
    }
  }, [user]);

  const blockUser = useCallback(async (userId: string) => {
    try {
      // Update conversation as blocked
      setConversations(prev =>
        prev.map(conv =>
          conv.participants.includes(userId)
            ? { ...conv, isBlocked: true }
            : conv
        )
      );
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }, []);

  return {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    sendMessage,
    reportMessage,
    blockUser,
    setActiveConversation,
  };
}
import { z } from 'zod';

export type MessageType = 'text' | 'image' | 'file' | 'system';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  recipientId: z.string(),
  type: z.enum(['text', 'image', 'file', 'system']),
  content: z.string(),
  encryptedContent: z.string(),
  timestamp: z.string(),
  status: z.enum(['sent', 'delivered', 'read', 'failed']),
  metadata: z.record(z.any()).optional(),
  isAnonymous: z.boolean().default(false),
  isReported: z.boolean().default(false),
});

export const conversationSchema = z.object({
  id: z.string(),
  participants: z.array(z.string()),
  lastMessage: messageSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isBlocked: z.boolean().default(false),
  isEncrypted: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

export type Message = z.infer<typeof messageSchema>;
export type Conversation = z.infer<typeof conversationSchema>;

export interface ChatParticipant {
  id: string;
  name: string;
  publicKey: string;
  isOnline: boolean;
  lastSeen?: string;
  isBlocked: boolean;
}

export interface MessageReport {
  id: string;
  messageId: string;
  reporterId: string;
  reason: string;
  description?: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
  resolution?: string;
}
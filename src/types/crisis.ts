import { z } from 'zod';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type CrisisType = 'suicide' | 'self_harm' | 'panic' | 'depression' | 'anxiety' | 'other';
export type SupportChannel = 'chat' | 'audio' | 'video';

export const crisisRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  type: z.enum(['suicide', 'self_harm', 'panic', 'depression', 'anxiety', 'other']),
  description: z.string(),
  preferredChannel: z.enum(['chat', 'audio', 'video']),
  timestamp: z.string(),
  location: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).optional(),
});

export const supportSessionSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  supporterId: z.string(),
  userId: z.string(),
  channel: z.enum(['chat', 'audio', 'video']),
  startTime: z.string(),
  endTime: z.string().optional(),
  status: z.enum(['active', 'ended', 'transferred']),
  notes: z.string().optional(),
  escalated: z.boolean(),
  escalationReason: z.string().optional(),
});

export const messageSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  senderId: z.string(),
  content: z.string(),
  timestamp: z.string(),
  type: z.enum(['text', 'system', 'resource']),
  metadata: z.record(z.any()).optional(),
});

export type CrisisRequest = z.infer<typeof crisisRequestSchema>;
export type SupportSession = z.infer<typeof supportSessionSchema>;
export type Message = z.infer<typeof messageSchema>;

export interface SupporterMetrics {
  id: string;
  supporterId: string;
  totalSessions: number;
  averageResponseTime: number;
  averageSessionDuration: number;
  escalationRate: number;
  satisfactionScore: number;
  period: 'daily' | 'weekly' | 'monthly';
  timestamp: string;
}

export interface QueueMetrics {
  totalWaiting: number;
  averageWaitTime: number;
  criticalRequests: number;
  availableSupporters: number;
  channelDistribution: Record<SupportChannel, number>;
}
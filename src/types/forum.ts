import { z } from 'zod';

export type ForumCategory = 'general' | 'support' | 'advice' | 'recovery' | 'wellness';
export type ModerationType = 'pending' | 'approved' | 'rejected' | 'flagged';

export const forumPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  authorId: z.string(),
  category: z.enum(['general', 'support', 'advice', 'recovery', 'wellness']),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  isAnonymous: z.boolean().default(false),
  moderationStatus: z.enum(['pending', 'approved', 'rejected', 'flagged']),
  moderatedBy: z.string().optional(),
  moderatedAt: z.string().optional(),
  moderationNotes: z.string().optional(),
});

export const forumCommentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  content: z.string().min(1, 'Comment is required'),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isAnonymous: z.boolean().default(false),
  moderationStatus: z.enum(['pending', 'approved', 'rejected', 'flagged']),
  moderatedBy: z.string().optional(),
  moderatedAt: z.string().optional(),
  moderationNotes: z.string().optional(),
});

export const groupChatSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['general', 'support', 'advice', 'recovery', 'wellness']),
  createdAt: z.string(),
  updatedAt: z.string(),
  moderators: z.array(z.string()),
  members: z.array(z.string()),
  isPrivate: z.boolean().default(false),
  rules: z.array(z.string()),
});

export const groupMessageSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  content: z.string(),
  authorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isAnonymous: z.boolean().default(false),
  moderationStatus: z.enum(['pending', 'approved', 'rejected', 'flagged']),
  moderatedBy: z.string().optional(),
  moderatedAt: z.string().optional(),
  moderationNotes: z.string().optional(),
});

export type ForumPost = z.infer<typeof forumPostSchema>;
export type ForumComment = z.infer<typeof forumCommentSchema>;
export type GroupChat = z.infer<typeof groupChatSchema>;
export type GroupMessage = z.infer<typeof groupMessageSchema>;
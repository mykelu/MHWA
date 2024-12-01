import { z } from 'zod';

export type ContentType = 'article' | 'video' | 'meditation' | 'exercise';
export type ContentTag = 'anxiety' | 'depression' | 'mindfulness' | 'stress' | 'sleep' | 'relationships';
export type ContentLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt';

export const contentSchema = z.object({
  id: z.string(),
  type: z.enum(['article', 'video', 'meditation', 'exercise']),
  title: z.record(z.enum(['en', 'es', 'fr', 'de', 'it', 'pt']), z.string()),
  description: z.record(z.enum(['en', 'es', 'fr', 'de', 'it', 'pt']), z.string()),
  content: z.record(z.enum(['en', 'es', 'fr', 'de', 'it', 'pt']), z.string()),
  tags: z.array(z.enum(['anxiety', 'depression', 'mindfulness', 'stress', 'sleep', 'relationships'])),
  author: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  duration: z.number().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  mediaUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});

export type Content = z.infer<typeof contentSchema>;

export interface ContentFilters {
  type?: ContentType;
  tags?: ContentTag[];
  language?: ContentLanguage;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  search?: string;
}

export interface UserProgress {
  contentId: string;
  completed: boolean;
  progress: number;
  lastAccessed: string;
  rating?: number;
  notes?: string;
}

export interface UserPreferences {
  preferredLanguage: ContentLanguage;
  contentTypes: ContentType[];
  interests: ContentTag[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reminderFrequency: 'daily' | 'weekly' | 'monthly';
  reminderTime?: string;
}
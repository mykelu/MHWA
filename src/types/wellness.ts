import { z } from 'zod';

export const moodSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  timestamp: z.string().optional(),
  value: z.number().min(1).max(10),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
});

export type Mood = z.infer<typeof moodSchema>;

export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    holdEmpty?: number;
    cycles: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  prompt: string;
  tags: string[];
  timestamp: string;
}
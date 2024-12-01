import { Mood } from '../../types/wellness';

const STORAGE_KEY = 'mindwell_moods';

export function saveMood(mood: Mood): void {
  try {
    const moods = getMoodHistory();
    const existingIndex = moods.findIndex(m => m.id === mood.id);
    
    if (existingIndex >= 0) {
      moods[existingIndex] = mood;
    } else {
      moods.push(mood);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
  } catch (error) {
    console.error('Error saving mood:', error);
    throw new Error('Failed to save mood');
  }
}

export function getMoodHistory(): Mood[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving mood history:', error);
    return [];
  }
}

export function getUserMoodHistory(userId: string): Mood[] {
  try {
    const moods = getMoodHistory();
    return moods
      .filter(mood => mood.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Error retrieving user mood history:', error);
    return [];
  }
}

export function clearMoodHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing mood history:', error);
  }
}
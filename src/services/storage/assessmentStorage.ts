import { AssessmentResponse } from '../../types/assessment';

const STORAGE_KEY = 'mindwell_assessment_history';

export function saveAssessmentResponse(response: AssessmentResponse): void {
  try {
    const history = getAssessmentHistory();
    history.push(response);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving assessment response:', error);
    throw new Error('Failed to save assessment response');
  }
}

export function getAssessmentHistory(): AssessmentResponse[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving assessment history:', error);
    return [];
  }
}

export function getUserAssessmentHistory(userId: string): AssessmentResponse[] {
  try {
    const history = getAssessmentHistory();
    return history
      .filter(response => response.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  } catch (error) {
    console.error('Error retrieving user assessment history:', error);
    return [];
  }
}

export function clearAssessmentHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing assessment history:', error);
  }
}
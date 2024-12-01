export interface User {
  id: string;
  role: 'minor' | 'adult' | 'therapist' | 'support' | 'moderator' | 'admin' | 'superadmin';
  name: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'scale' | 'multiChoice' | 'text';
  options?: string[];
}
import { UserProfile } from '../types/profile';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulated user profile storage using localStorage
const STORAGE_KEY = 'mindwell_user_profile';

export async function getUserProfile(): Promise<UserProfile | null> {
  await delay(500);
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function updateUserProfile(profile: UserProfile): Promise<UserProfile> {
  await delay(500);
  
  try {
    // Store the profile
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to save profile');
  }
}
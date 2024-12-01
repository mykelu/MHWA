import { EmergencyContact, EmergencyHotline, EmergencyResource, Coordinates } from '../types/emergency';

const MOCK_HOTLINES: EmergencyHotline[] = [
  {
    id: '1',
    name: 'National Suicide Prevention Lifeline',
    number: '1-800-273-8255',
    description: '24/7 free and confidential support',
  },
  {
    id: '2',
    name: 'Crisis Text Line',
    number: '741741',
    description: 'Text HOME to connect with a Crisis Counselor',
  },
  {
    id: '3',
    name: 'SAMHSA National Helpline',
    number: '1-800-662-4357',
    description: 'Treatment referral and information service',
  },
];

const MOCK_RESOURCES: EmergencyResource[] = [
  {
    id: '1',
    name: 'City Mental Health Center',
    address: '123 Main St, City, State',
    phone: '(555) 123-4567',
    distance: 0.8,
    directions: 'https://maps.google.com',
    type: 'mental_health',
  },
  {
    id: '2',
    name: 'Community Crisis Center',
    address: '456 Oak Ave, City, State',
    phone: '(555) 987-6543',
    distance: 1.2,
    directions: 'https://maps.google.com',
    type: 'crisis_center',
  },
];

export async function getEmergencyHotlines(): Promise<EmergencyHotline[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_HOTLINES;
}

export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  // In a real app, this would fetch from the user's profile
  return [];
}

export async function getNearbyResources(coordinates: Coordinates): Promise<EmergencyResource[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would use the coordinates to fetch nearby resources
  return MOCK_RESOURCES;
}

export async function sendEmergencyAlert(contacts: EmergencyContact[]): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would:
  // 1. Get current location
  // 2. Send notifications to emergency contacts
  // 3. Log the emergency event
  console.log('Emergency alert sent to contacts:', contacts);
}
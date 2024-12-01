export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface EmergencyHotline {
  id: string;
  name: string;
  number: string;
  description: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  directions: string;
  type: 'hospital' | 'crisis_center' | 'mental_health' | 'shelter';
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
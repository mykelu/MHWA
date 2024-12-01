import { useState, useEffect } from 'react';
import { EmergencyContact, EmergencyHotline } from '../types/emergency';
import { getEmergencyContacts, getEmergencyHotlines } from '../services/emergency';

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [hotlines, setHotlines] = useState<EmergencyHotline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const [contactsData, hotlinesData] = await Promise.all([
          getEmergencyContacts(),
          getEmergencyHotlines()
        ]);
        setContacts(contactsData);
        setHotlines(hotlinesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load emergency contacts');
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  return { contacts, hotlines, loading, error };
}
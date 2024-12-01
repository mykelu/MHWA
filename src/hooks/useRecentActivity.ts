import { useState, useEffect } from 'react';
import { Activity } from '../types/admin';
import { getRecentActivity } from '../services/api/admin';

export function useRecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const data = await getRecentActivity();
        setActivities(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, []);

  return { activities, loading, error };
}
import { useState, useEffect } from 'react';
import { EmergencyResource } from '../types/emergency';
import { getNearbyResources } from '../services/emergency';
import { useGeolocation } from './useGeolocation';

export function useNearbyResources() {
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { coordinates, error: locationError } = useGeolocation();

  useEffect(() => {
    async function fetchResources() {
      if (locationError) {
        setError('Unable to access location');
        setLoading(false);
        return;
      }

      if (!coordinates) {
        return;
      }

      try {
        const data = await getNearbyResources(coordinates);
        setResources(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load nearby resources');
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [coordinates, locationError]);

  return { resources, loading, error };
}
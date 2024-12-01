import { useState, useEffect } from 'react';
import { AdminStats } from '../types/admin';
import { getAdminStats } from '../services/api/admin';

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeTherapists: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0,
    userGrowth: 0,
    therapistGrowth: 0,
    approvalChange: 0,
    revenueGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}
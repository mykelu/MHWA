import React from 'react';
import { Users, UserCheck, AlertTriangle, DollarSign } from 'lucide-react';
import { StatCard } from './StatCard';
import { useAdminStats } from '../../../hooks/useAdminStats';

export function AdminStats() {
  const { stats, loading, error } = useAdminStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white overflow-hidden shadow rounded-lg animate-pulse"
          >
            <div className="p-5 h-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Failed to load admin statistics</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        change={stats.userGrowth}
        icon={Users}
        trend={stats.userGrowth >= 0 ? 'up' : 'down'}
      />
      <StatCard
        title="Active Therapists"
        value={stats.activeTherapists}
        change={stats.therapistGrowth}
        icon={UserCheck}
        trend={stats.therapistGrowth >= 0 ? 'up' : 'down'}
      />
      <StatCard
        title="Pending Approvals"
        value={stats.pendingApprovals}
        change={stats.approvalChange}
        icon={AlertTriangle}
        trend={stats.approvalChange <= 0 ? 'up' : 'down'}
      />
      <StatCard
        title="Monthly Revenue"
        value={`$${stats.monthlyRevenue.toLocaleString()}`}
        change={stats.revenueGrowth}
        icon={DollarSign}
        trend={stats.revenueGrowth >= 0 ? 'up' : 'down'}
      />
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminStats } from '../../components/admin/stats/AdminStats';
import { RecentActivity } from '../../components/admin/activity/RecentActivity';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/permissions';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { state } = useAuth();

  if (!state.user || !hasPermission(state.user.role, 'canManageSystem')) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Admin Dashboard</h1>
            
            <AdminStats />
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentActivity />
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">System Health</h2>
                {/* System health metrics will be added here */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
import { AdminStats, Activity, AdminUser, TherapistVerification, ContentApproval, ComplianceLog } from '../../types/admin';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAdminStats(): Promise<AdminStats> {
  await delay(1000);
  return {
    totalUsers: 1250,
    activeTherapists: 45,
    pendingApprovals: 12,
    monthlyRevenue: 52000,
    userGrowth: 15,
    therapistGrowth: 8,
    approvalChange: -5,
    revenueGrowth: 12,
  };
}

export async function getRecentActivity(): Promise<Activity[]> {
  await delay(1000);
  return [
    {
      id: '1',
      type: 'user_registered',
      description: 'New user registration:',
      user: 'John Doe',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'therapist_verified',
      description: 'Therapist verification completed for:',
      user: 'Dr. Sarah Smith',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'content_approved',
      description: 'New content approved by:',
      user: 'Admin Team',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      type: 'payment_received',
      description: 'Payment processed for:',
      user: 'Premium Subscription',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: '5',
      type: 'compliance_check',
      description: 'Monthly compliance audit completed by:',
      user: 'Security Team',
      timestamp: new Date(Date.now() - 28800000).toISOString(),
    },
  ];
}
import { z } from 'zod';

export interface AdminStats {
  totalUsers: number;
  activeTherapists: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  userGrowth: number;
  therapistGrowth: number;
  approvalChange: number;
  revenueGrowth: number;
}

export type ActivityType =
  | 'user_registered'
  | 'content_approved'
  | 'report_generated'
  | 'alert_triggered'
  | 'payment_received'
  | 'compliance_check'
  | 'therapist_verified';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin?: string;
}

export interface TherapistVerification {
  id: string;
  userId: string;
  name: string;
  email: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface ContentApproval {
  id: string;
  title: string;
  type: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface ComplianceLog {
  id: string;
  type: 'consent' | 'data_access' | 'data_breach' | 'security_audit';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  metadata: Record<string, any>;
}
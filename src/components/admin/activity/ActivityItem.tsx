import React from 'react';
import { format } from 'date-fns';
import { Activity } from '../../../types/admin';
import {
  UserPlus,
  FileCheck,
  AlertTriangle,
  DollarSign,
  Shield,
  UserCheck,
} from 'lucide-react';

interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
}

const activityIcons = {
  user_registered: UserPlus,
  content_approved: FileCheck,
  report_generated: FileCheck,
  alert_triggered: AlertTriangle,
  payment_received: DollarSign,
  compliance_check: Shield,
  therapist_verified: UserCheck,
};

const activityColors = {
  user_registered: 'bg-blue-500',
  content_approved: 'bg-green-500',
  report_generated: 'bg-indigo-500',
  alert_triggered: 'bg-red-500',
  payment_received: 'bg-green-500',
  compliance_check: 'bg-purple-500',
  therapist_verified: 'bg-blue-500',
};

export function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const Icon = activityIcons[activity.type];
  const bgColor = activityColors[activity.type];

  return (
    <li>
      <div className="relative pb-8">
        {!isLast && (
          <span
            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        )}
        <div className="relative flex space-x-3">
          <div>
            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${bgColor}`}>
              <Icon className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
          </div>
          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
            <div>
              <p className="text-sm text-gray-500">
                {activity.description}{' '}
                <a href="#" className="font-medium text-gray-900">
                  {activity.user}
                </a>
              </p>
            </div>
            <div className="text-right text-sm whitespace-nowrap text-gray-500">
              <time dateTime={activity.timestamp}>
                {format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm')}
              </time>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
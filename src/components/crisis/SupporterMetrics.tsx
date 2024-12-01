import React from 'react';
import { Clock, Users, TrendingUp, Star } from 'lucide-react';
import { SupporterMetrics as Metrics } from '../../types/crisis';
import { format } from 'date-fns';

interface SupporterMetricsProps {
  metrics: Metrics;
}

export function SupporterMetrics({ metrics }: SupporterMetricsProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
        
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-500" />
              Total Sessions
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {metrics.totalSessions}
            </dd>
          </div>

          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
              <Clock className="h-5 w-5 mr-2 text-indigo-500" />
              Avg Response Time
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {formatDuration(metrics.averageResponseTime)}
            </dd>
          </div>

          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
              Escalation Rate
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {(metrics.escalationRate * 100).toFixed(1)}%
            </dd>
          </div>

          <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate flex items-center">
              <Star className="h-5 w-5 mr-2 text-indigo-500" />
              Satisfaction Score
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {metrics.satisfactionScore.toFixed(1)}/5
            </dd>
          </div>
        </dl>

        <div className="mt-6 text-sm text-gray-500">
          Last updated: {format(new Date(metrics.timestamp), 'MMM d, yyyy HH:mm')}
        </div>
      </div>
    </div>
  );
}
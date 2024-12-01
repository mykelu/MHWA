import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
  trend: 'up' | 'down';
}

export function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  const changeText = `${change >= 0 ? '+' : ''}${change}%`;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColor}`}>
                  <TrendIcon className="self-center flex-shrink-0 h-4 w-4 mr-1" aria-hidden="true" />
                  <span className="sr-only">{trend === 'up' ? 'Increased' : 'Decreased'} by</span>
                  {changeText}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
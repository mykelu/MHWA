import React, { useMemo } from 'react';
import { AssessmentResponse } from '../../../types/assessment';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendAnalysisProps {
  history: AssessmentResponse[];
}

export function TrendAnalysis({ history }: TrendAnalysisProps) {
  const trend = useMemo(() => {
    if (history.length < 2) return null;

    const today = new Date();
    const last30Days = history.filter(response =>
      isWithinInterval(parseISO(response.completedAt), {
        start: subDays(today, 30),
        end: today,
      })
    );

    if (last30Days.length < 2) return null;

    const firstScore = last30Days[last30Days.length - 1].score;
    const lastScore = last30Days[0].score;
    const difference = lastScore - firstScore;
    const percentageChange = ((difference / firstScore) * 100).toFixed(1);

    return {
      difference,
      percentageChange,
      isImproving: difference < 0, // Lower scores typically indicate improvement
    };
  }, [history]);

  if (!trend) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-2">30-Day Trend</h4>
      <div className="flex items-center space-x-2">
        {trend.isImproving ? (
          <div className="flex items-center text-green-600">
            <TrendingDown className="h-5 w-5 mr-1" />
            <span className="font-medium">Improving</span>
          </div>
        ) : trend.difference === 0 ? (
          <div className="flex items-center text-gray-600">
            <Minus className="h-5 w-5 mr-1" />
            <span className="font-medium">Stable</span>
          </div>
        ) : (
          <div className="flex items-center text-red-600">
            <TrendingUp className="h-5 w-5 mr-1" />
            <span className="font-medium">Increasing</span>
          </div>
        )}
        <span className="text-sm text-gray-500">
          {Math.abs(Number(trend.percentageChange))}% change
        </span>
      </div>
    </div>
  );
}
import React from 'react';
import { Assessment, AssessmentResponse } from '../../types/assessment';
import { Download } from 'lucide-react';
import { ScoreChart } from './charts/ScoreChart';
import { TrendAnalysis } from './charts/TrendAnalysis';
import { SeverityDistribution } from './charts/SeverityDistribution';

interface AssessmentProgressProps {
  assessment: Assessment;
  history: AssessmentResponse[];
}

export function AssessmentProgress({ assessment, history }: AssessmentProgressProps) {
  const exportToCsv = () => {
    const headers = ['Date', 'Score', 'Interpretation'];
    const rows = history.map(response => [
      response.completedAt,
      response.score,
      response.interpretation,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${assessment.title.toLowerCase().replace(/\s+/g, '-')}-progress.csv`;
    link.click();
  };

  if (history.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">No assessment history available yet.</p>
          <p className="text-sm text-gray-400 mt-1">Complete an assessment to see your progress.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Score Progress</h3>
          <button
            onClick={exportToCsv}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
        <ScoreChart assessment={assessment} history={history} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendAnalysis history={history} />
        
        <div className="bg-white shadow rounded-lg p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Severity Distribution</h4>
          <SeverityDistribution assessment={assessment} history={history} />
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Score Interpretation</h4>
        <div className="space-y-2">
          {assessment.scoring.ranges.map((range) => (
            <div key={range.label} className="flex items-center text-sm">
              <span className="w-24 font-medium">{range.label}:</span>
              <span className="text-gray-600">{range.min}-{range.max} points</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
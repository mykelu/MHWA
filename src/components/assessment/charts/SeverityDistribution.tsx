import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Assessment, AssessmentResponse } from '../../../types/assessment';
import '../../../utils/chartSetup';

interface SeverityDistributionProps {
  assessment: Assessment;
  history: AssessmentResponse[];
}

export function SeverityDistribution({ assessment, history }: SeverityDistributionProps) {
  const distribution = assessment.scoring.ranges.map(range => ({
    label: range.label,
    count: history.filter(response => 
      response.score >= range.min && response.score <= range.max
    ).length,
  }));

  const data = {
    labels: distribution.map(d => d.label),
    datasets: [
      {
        data: distribution.map(d => d.count),
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',  // green
          'rgba(234, 179, 8, 0.6)',   // yellow
          'rgba(249, 115, 22, 0.6)',  // orange
          'rgba(239, 68, 68, 0.6)',   // red
          'rgba(168, 85, 247, 0.6)',  // purple
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#4B5563',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const count = context.raw;
            const total = distribution.reduce((sum, d) => sum + d.count, 0);
            const percentage = ((count / total) * 100).toFixed(1);
            return `${count} assessments (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} redraw={true} />
    </div>
  );
}
import React from 'react';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { Assessment, AssessmentResponse } from '../../../types/assessment';
import '../../../utils/chartSetup';

interface ScoreChartProps {
  assessment: Assessment;
  history: AssessmentResponse[];
}

export function ScoreChart({ assessment, history }: ScoreChartProps) {
  const data = {
    labels: history.map(response => format(parseISO(response.completedAt), 'MMM d, yyyy')),
    datasets: [
      {
        label: 'Score',
        data: history.map(response => response.score),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            const score = context.raw;
            const range = assessment.scoring.ranges.find(r => score >= r.min && score <= r.max);
            return [`Score: ${score}`, `Level: ${range?.label || 'Unknown'}`];
          },
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: assessment.scoring.ranges[assessment.scoring.ranges.length - 1].max,
        ticks: {
          stepSize: 1,
          padding: 8,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} redraw={true} />
    </div>
  );
}
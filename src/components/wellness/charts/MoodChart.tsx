import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { Mood } from '../../../types/wellness';
import '../../../utils/chartSetup';

interface MoodChartProps {
  moods: Mood[];
}

export function MoodChart({ moods }: MoodChartProps) {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const sortedMoods = [...moods].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const data = {
    labels: sortedMoods.map(mood => format(parseISO(mood.timestamp), 'MMM d, yyyy')),
    datasets: [
      {
        label: 'Mood',
        data: sortedMoods.map(mood => mood.value),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
    scales: {
      y: {
        type: 'linear' as const,
        min: 1,
        max: 10,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        type: 'category' as const,
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const mood = sortedMoods[context.dataIndex];
            return [
              `Mood: ${mood.value}`,
              mood.note ? `Note: ${mood.note}` : null,
              mood.activities.length ? `Activities: ${mood.activities.join(', ')}` : null,
            ].filter(Boolean);
          },
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
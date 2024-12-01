import React from 'react';
import { format, parseISO } from 'date-fns';
import { Download } from 'lucide-react';
import { Mood } from '../../types/wellness';
import { MoodChart } from './charts/MoodChart';

interface MoodHistoryProps {
  moods: Mood[];
}

export function MoodHistory({ moods }: MoodHistoryProps) {
  const sortedMoods = [...moods].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const exportToCSV = () => {
    const headers = ['Date', 'Mood', 'Note', 'Activities'];
    const rows = sortedMoods.map(mood => [
      format(parseISO(mood.timestamp), 'yyyy-MM-dd HH:mm:ss'),
      mood.value,
      mood.note || '',
      mood.activities.join(', '),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mood-history.csv';
    link.click();
  };

  if (moods.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No mood entries yet. Start tracking your mood above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Mood History</h3>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </button>
        </div>
        <MoodChart moods={sortedMoods} />
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {sortedMoods.map((mood) => (
          <div key={mood.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {format(parseISO(mood.timestamp), 'MMMM d, yyyy h:mm a')}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Mood: {mood.value}/10
                </p>
              </div>
              {mood.activities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {mood.activities.map((activity) => (
                    <span
                      key={activity}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {mood.note && (
              <p className="mt-2 text-sm text-gray-600">{mood.note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
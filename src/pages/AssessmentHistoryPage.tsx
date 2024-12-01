import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { getUserAssessmentHistory } from '../services/api/assessment';
import { AssessmentResponse } from '../types/assessment';
import { format, parseISO } from 'date-fns';
import { AlertCircle, FileText, Download } from 'lucide-react';
import { AssessmentProgress } from '../components/assessment/AssessmentProgress';

export function AssessmentHistoryPage() {
  const { state: { user } } = useAuth();
  const [history, setHistory] = useState<AssessmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        if (!user?.id) {
          throw new Error('User not authenticated');
        }
        const data = await getUserAssessmentHistory(user.id);
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment history');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user?.id]);

  const exportHistory = () => {
    const headers = ['Date', 'Assessment', 'Score', 'Interpretation'];
    const rows = history.map(response => [
      format(parseISO(response.completedAt), 'yyyy-MM-dd'),
      response.assessmentId,
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
    link.download = 'assessment-history.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Assessment History</h1>
                <p className="mt-1 text-sm text-gray-600">
                  View your past assessments and track your progress over time
                </p>
              </div>
              <button
                onClick={exportHistory}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="h-5 w-5 mr-2" />
                Export All Data
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-6">
                {history.map((response) => (
                  <div
                    key={response.id}
                    className="bg-white shadow rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <FileText className="h-6 w-6 text-indigo-600" />
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {response.assessmentId === 'phq9' ? 'PHQ-9 Depression Scale' : 'GAD-7 Anxiety Scale'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Completed on {format(parseISO(response.completedAt), 'MMMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Score: {response.score}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">{response.interpretation}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assessments completed</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by taking your first assessment.</p>
                <div className="mt-6">
                  <a
                    href="/assessments"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Take Assessment
                  </a>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
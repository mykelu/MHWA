import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { AssessmentProgress } from '../components/assessment/AssessmentProgress';
import { Assessment, AssessmentResponse } from '../types/assessment';
import { getAssessmentById, getUserAssessmentHistory } from '../services/api/assessment';
import { useAuth } from '../contexts/AuthContext';

export function AssessmentResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const result = location.state?.result as AssessmentResponse | undefined;
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!result?.assessmentId || !authState.user?.id) {
          throw new Error('Missing required data');
        }

        const [assessmentData, historyData] = await Promise.all([
          getAssessmentById(result.assessmentId),
          getUserAssessmentHistory(authState.user.id),
        ]);

        if (!assessmentData) {
          throw new Error('Assessment not found');
        }

        // Filter history for the current assessment type
        const filteredHistory = historyData.filter(
          response => response.assessmentId === result.assessmentId
        );

        // Add the current result if it's not already in the history
        const currentResultExists = filteredHistory.some(
          response => response.id === result.id
        );
        
        if (!currentResultExists) {
          filteredHistory.unshift(result);
        }

        setAssessment(assessmentData);
        setAssessmentHistory(filteredHistory);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment data');
        console.error('Error loading assessment data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [result?.assessmentId, result?.id, authState.user?.id]);

  if (!authState.user) {
    navigate('/auth');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error || 'Assessment not found'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <div className="text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Assessment Completed</h2>
                <p className="mt-2 text-gray-600">
                  Thank you for completing the assessment. Your responses have been recorded.
                </p>
              </div>

              {result && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Your Results</h3>
                  <div className="mt-4">
                    <p className="text-gray-600">Score: {result.score}</p>
                    <p className="mt-2 text-gray-600">{result.interpretation}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/assessments')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Take Another Assessment
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            <AssessmentProgress
              assessment={assessment}
              history={assessmentHistory}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
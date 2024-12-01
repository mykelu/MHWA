import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Assessment, AssessmentResponse } from '../types/assessment';
import { getAssessmentById, submitAssessmentResponse } from '../services/api/assessment';
import { AssessmentForm } from '../components/assessment/AssessmentForm';
import { AlertCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { useAuth } from '../contexts/AuthContext';

export function AssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssessment() {
      try {
        if (!id) throw new Error('Assessment ID is required');
        const data = await getAssessmentById(id);
        if (!data) throw new Error('Assessment not found');
        setAssessment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assessment');
      } finally {
        setLoading(false);
      }
    }

    fetchAssessment();
  }, [id]);

  const handleSubmit = async (response: Omit<AssessmentResponse, 'id' | 'score' | 'interpretation' | 'completedAt'>) => {
    try {
      if (!authState.user) {
        throw new Error('User not authenticated');
      }

      const submittedResponse = await submitAssessmentResponse({
        ...response,
        userId: authState.user.id,
      });

      navigate('/assessment/results', {
        state: { result: submittedResponse }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit assessment');
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
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

  if (!assessment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <AssessmentForm
              assessment={assessment}
              onSubmit={handleSubmit}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
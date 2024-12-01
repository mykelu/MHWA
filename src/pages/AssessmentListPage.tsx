import React, { useState, useEffect } from 'react';
import { Assessment } from '../types/assessment';
import { getAssessmentTemplates } from '../services/api/assessment';
import { AssessmentList } from '../components/assessment/AssessmentList';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { AlertCircle } from 'lucide-react';

export function AssessmentListPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const data = await getAssessmentTemplates();
        setAssessments(data);
      } catch (err) {
        setError('Failed to load assessments');
        console.error('Error loading assessments:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssessments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Mental Health Assessments</h1>
              <p className="mt-2 text-gray-600">
                Complete these assessments to help us understand your mental health needs better
              </p>
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
            ) : (
              <AssessmentList assessments={assessments} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
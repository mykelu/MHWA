import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsentForm } from '../components/consent/ConsentForm';
import { ConsentFormData } from '../types/consent';
import { submitConsentForm } from '../services/consent';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function ConsentPage() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (data: ConsentFormData) => {
    try {
      setError(null);
      if (!state.user) {
        throw new Error('User not authenticated');
      }

      await submitConsentForm(state.user.id, data);
      setSuccess('Consent form submitted successfully');
      
      // Navigate to the dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit consent form');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Guardian Consent</h1>
          <p className="mt-1 text-sm text-gray-600">
            Please complete this form to provide consent for a minor to use our services
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-md bg-red-50 p-4">
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

        {success && (
          <div className="mt-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <ConsentForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
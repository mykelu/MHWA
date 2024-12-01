import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProfileForm } from '../components/profile/ProfileForm';
import { UserProfile } from '../types/profile';
import { getUserProfile, updateUserProfile } from '../services/api';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';

export function ProfilePage() {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setError(null);
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Profile loading error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (data: UserProfile) => {
    try {
      setError(null);
      setSuccess(null);
      const updatedProfile = await updateUserProfile(data);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully');
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!state.user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
              <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your personal information and preferences
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
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <ProfileForm
                  initialData={profile || undefined}
                  onSubmit={handleProfileSubmit}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
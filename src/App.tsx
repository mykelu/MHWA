import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthPage } from './pages/Auth';
import { ProfilePage } from './pages/ProfilePage';
import { ConsentPage } from './pages/ConsentPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { AssessmentListPage } from './pages/AssessmentListPage';
import { AssessmentResultsPage } from './pages/AssessmentResultsPage';
import { AssessmentHistoryPage } from './pages/AssessmentHistoryPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { MoodTrackerPage } from './pages/wellness/MoodTrackerPage';
import { JournalPage } from './pages/wellness/JournalPage';
import { BreathingPage } from './pages/wellness/BreathingPage';
import { CrisisSupportPage } from './pages/crisis/CrisisSupportPage';
import { ChatSupportPage } from './pages/support/ChatSupportPage';
import { VoiceSupportPage } from './pages/support/VoiceSupportPage';
import { ForumPage } from './pages/forum/ForumPage';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { WelcomeCard } from './components/dashboard/WelcomeCard';
import { useAuth } from './contexts/AuthContext';
import { UpcomingAppointments } from './components/dashboard/UpcomingAppointments';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  return state.user ? <>{children}</> : <Navigate to="/auth" />;
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <WelcomeCard />
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <UpcomingAppointments />
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Assessments</h3>
                <p className="mt-2 text-gray-600">No recent assessments taken</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <AppointmentsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/consent"
            element={
              <PrivateRoute>
                <ConsentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/assessments"
            element={
              <PrivateRoute>
                <AssessmentListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/assessments/history"
            element={
              <PrivateRoute>
                <AssessmentHistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/assessment/:id"
            element={
              <PrivateRoute>
                <AssessmentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/assessment/results"
            element={
              <PrivateRoute>
                <AssessmentResultsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/wellness/mood"
            element={
              <PrivateRoute>
                <MoodTrackerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/wellness/journal"
            element={
              <PrivateRoute>
                <JournalPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/wellness/breathing"
            element={
              <PrivateRoute>
                <BreathingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/crisis-support"
            element={
              <PrivateRoute>
                <CrisisSupportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatSupportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/voice-support"
            element={
              <PrivateRoute>
                <VoiceSupportPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <PrivateRoute>
                <ForumPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
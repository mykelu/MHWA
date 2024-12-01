import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { AppointmentCalendar } from '../components/appointments/AppointmentCalendar';
import { AppointmentList } from '../components/appointments/AppointmentList';
import { useAppointments } from '../hooks/useAppointments';
import { useAuth } from '../contexts/AuthContext';
import { TimeSlot } from '../types/appointment';
import { AlertCircle } from 'lucide-react';

export function AppointmentsPage() {
  const { state: { user } } = useAuth();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const {
    appointments,
    loading,
    error,
    cancelAppointment,
    rescheduleAppointment,
  } = useAppointments(user?.id || '');

  const handleCancel = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    }
  };

  const handleReschedule = (appointmentId: string) => {
    // Implementation for rescheduling
    console.log('Reschedule appointment:', appointmentId);
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
              <p className="mt-1 text-sm text-gray-600">
                Schedule and manage your therapy sessions
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AppointmentCalendar
                availableSlots={[]} // This would come from your API
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
                userTimezone={userTimezone}
              />

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Appointments</h2>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <AppointmentList
                    appointments={appointments}
                    onCancel={handleCancel}
                    onReschedule={handleReschedule}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
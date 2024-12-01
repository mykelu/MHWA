import { useState, useEffect } from 'react';
import { Appointment, TimeSlot } from '../types/appointment';
import {
  getTherapistAvailability,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getUserAppointments,
} from '../services/api/appointments';

export function useAppointments(userId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const data = await getUserAppointments(userId);
        setAppointments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [userId]);

  const handleBook = async (appointment: Omit<Appointment, 'id'>) => {
    try {
      const newAppointment = await bookAppointment(appointment);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err) {
      throw err;
    }
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId);
      setAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? { ...app, status: 'cancelled' } : app
        )
      );
    } catch (err) {
      throw err;
    }
  };

  const handleReschedule = async (
    appointmentId: string,
    newStartTime: string,
    newEndTime: string
  ) => {
    try {
      const updatedAppointment = await rescheduleAppointment(
        appointmentId,
        newStartTime,
        newEndTime
      );
      setAppointments(prev =>
        prev.map(app =>
          app.id === appointmentId ? updatedAppointment : app
        )
      );
      return updatedAppointment;
    } catch (err) {
      throw err;
    }
  };

  return {
    appointments,
    loading,
    error,
    bookAppointment: handleBook,
    cancelAppointment: handleCancel,
    rescheduleAppointment: handleReschedule,
  };
}
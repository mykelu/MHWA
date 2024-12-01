import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Video, Phone, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointments';
import { useAuth } from '../../contexts/AuthContext';
import { format, parseISO, isFuture } from 'date-fns';

const appointmentTypeIcons = {
  video: Video,
  audio: Phone,
  chat: MessageSquare,
};

export function UpcomingAppointments() {
  const { state: { user } } = useAuth();
  const { appointments, loading, error } = useAppointments(user?.id || '');

  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled' && isFuture(parseISO(apt.startTime)))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
        <div className="mt-4 space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
        <p className="mt-2 text-red-600">Failed to load appointments</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
        <Link
          to="/appointments"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {upcomingAppointments.length > 0 ? (
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => {
            const TypeIcon = appointmentTypeIcons[appointment.type];
            return (
              <div
                key={appointment.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <TypeIcon className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)} Session
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{format(parseISO(appointment.startTime), 'MMM d, yyyy')}</span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>{format(parseISO(appointment.startTime), 'h:mm a')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming sessions</h3>
          <p className="mt-1 text-sm text-gray-500">Schedule your next therapy session.</p>
          <div className="mt-6">
            <Link
              to="/appointments"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
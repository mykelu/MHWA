import React from 'react';
import { format, parseISO, isPast } from 'date-fns';
import { Appointment } from '../../types/appointment';
import { Calendar, Video, Phone, MessageSquare, Clock, X, RefreshCw } from 'lucide-react';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancel: (appointmentId: string) => Promise<void>;
  onReschedule: (appointmentId: string) => void;
}

const appointmentTypeIcons = {
  video: Video,
  audio: Phone,
  chat: MessageSquare,
};

const statusColors = {
  scheduled: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800',
  rescheduled: 'bg-yellow-100 text-yellow-800',
};

export function AppointmentList({
  appointments,
  onCancel,
  onReschedule,
}: AppointmentListProps) {
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedAppointments.map((appointment) => {
        const TypeIcon = appointmentTypeIcons[appointment.type];
        const isPastAppointment = isPast(parseISO(appointment.endTime));
        const canModify = !isPastAppointment && appointment.status === 'scheduled';

        return (
          <div
            key={appointment.id}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TypeIcon className="h-5 w-5 text-indigo-600 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)} Session
                  </h3>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(parseISO(appointment.startTime), 'MMM d, yyyy')}
                    </span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>
                      {format(parseISO(appointment.startTime), 'h:mm a')} - {format(parseISO(appointment.endTime), 'h:mm a')}
                    </span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[appointment.status]}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>

            {canModify && (
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => onReschedule(appointment.id)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reschedule
                </button>
                <button
                  onClick={() => onCancel(appointment.id)}
                  className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        );
      })}

      {sortedAppointments.length === 0 && (
        <div className="text-center py-6 bg-white rounded-lg shadow">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by booking your first session.</p>
        </div>
      )}
    </div>
  );
}
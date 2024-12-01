import React, { useState } from 'react';
import { format, parseISO, addDays, isSameDay } from 'date-fns';
import { TimeSlot } from '../../types/appointment';
import { Calendar, Clock } from 'lucide-react';

interface AppointmentCalendarProps {
  availableSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
  userTimezone: string;
}

export function AppointmentCalendar({
  availableSlots,
  selectedSlot,
  onSlotSelect,
  userTimezone,
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const daySlots = availableSlots.filter(slot =>
    isSameDay(parseISO(slot.startTime), selectedDate)
  );

  const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date & Time</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {nextSevenDays.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center p-3 rounded-lg min-w-[100px] ${
                isSameDay(date, selectedDate)
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-sm font-medium">
                {format(date, 'EEE')}
              </span>
              <span className="text-lg font-semibold">
                {format(date, 'd')}
              </span>
              <span className="text-sm">
                {format(date, 'MMM')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {daySlots.length > 0 ? (
          daySlots.map((slot) => (
            <button
              key={slot.startTime}
              onClick={() => onSlotSelect(slot)}
              disabled={!slot.available}
              className={`w-full flex items-center justify-between p-3 rounded-lg ${
                selectedSlot?.startTime === slot.startTime
                  ? 'bg-indigo-100 text-indigo-700'
                  : slot.available
                  ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {format(parseISO(slot.startTime), 'h:mm a')}
                </span>
              </div>
              {!slot.available && (
                <span className="text-sm text-gray-500">Unavailable</span>
              )}
            </button>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No available slots for this date
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Timezone: {userTimezone}</span>
        </div>
      </div>
    </div>
  );
}
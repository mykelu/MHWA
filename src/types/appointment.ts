import { z } from 'zod';

export const appointmentSchema = z.object({
  id: z.string(),
  therapistId: z.string(),
  userId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(['scheduled', 'cancelled', 'completed', 'rescheduled']),
  type: z.enum(['video', 'audio', 'chat']),
  notes: z.string().optional(),
  timezone: z.string(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface TherapistAvailability {
  id: string;
  therapistId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface AppointmentNotification {
  id: string;
  appointmentId: string;
  userId: string;
  type: 'reminder' | 'cancellation' | 'rescheduled';
  message: string;
  timestamp: string;
  read: boolean;
}
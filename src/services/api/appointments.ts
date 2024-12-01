import { Appointment, TimeSlot, TherapistAvailability } from '../../types/appointment';
import { format, parseISO, addMinutes } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// Simulated database
const appointments = new Map<string, Appointment>();
const availabilities = new Map<string, TherapistAvailability[]>();

export async function getTherapistAvailability(
  therapistId: string,
  date: string,
  timezone: string
): Promise<TimeSlot[]> {
  const slots: TimeSlot[] = [];
  const dayOfWeek = parseISO(date).getDay();
  
  // Get therapist's availability for this day
  const therapistAvail = availabilities.get(therapistId)?.filter(a => a.dayOfWeek === dayOfWeek) || [];
  
  for (const avail of therapistAvail) {
    let currentTime = parseISO(`${date}T${avail.startTime}`);
    const endTime = parseISO(`${date}T${avail.endTime}`);
    
    // Create 30-minute slots
    while (currentTime < endTime) {
      const slotEnd = addMinutes(currentTime, 30);
      const isAvailable = !Array.from(appointments.values()).some(
        apt => 
          apt.therapistId === therapistId &&
          apt.status === 'scheduled' &&
          parseISO(apt.startTime) < slotEnd &&
          parseISO(apt.endTime) > currentTime
      );
      
      slots.push({
        startTime: format(currentTime, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        endTime: format(slotEnd, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        available: isAvailable,
      });
      
      currentTime = slotEnd;
    }
  }
  
  return slots;
}

export async function bookAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
  const id = crypto.randomUUID();
  const newAppointment: Appointment = {
    ...appointment,
    id,
  };
  
  appointments.set(id, newAppointment);
  return newAppointment;
}

export async function cancelAppointment(id: string): Promise<void> {
  const appointment = appointments.get(id);
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  appointment.status = 'cancelled';
  appointments.set(id, appointment);
}

export async function rescheduleAppointment(
  id: string,
  newStartTime: string,
  newEndTime: string
): Promise<Appointment> {
  const appointment = appointments.get(id);
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  const updatedAppointment: Appointment = {
    ...appointment,
    startTime: newStartTime,
    endTime: newEndTime,
    status: 'rescheduled',
  };
  
  appointments.set(id, updatedAppointment);
  return updatedAppointment;
}

export async function getUserAppointments(userId: string): Promise<Appointment[]> {
  return Array.from(appointments.values()).filter(apt => apt.userId === userId);
}

export async function getTherapistAppointments(therapistId: string): Promise<Appointment[]> {
  return Array.from(appointments.values()).filter(apt => apt.therapistId === therapistId);
}
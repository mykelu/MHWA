import { z } from 'zod';

export const consentFormSchema = z.object({
  minorName: z.string().min(2, 'Minor name must be at least 2 characters'),
  minorDateOfBirth: z.string(),
  guardianName: z.string().min(2, 'Guardian name must be at least 2 characters'),
  guardianRelationship: z.string().min(2, 'Please specify your relationship'),
  guardianEmail: z.string().email('Invalid email address'),
  guardianPhone: z.string().min(10, 'Please enter a valid phone number'),
  consentItems: z.object({
    accountCreation: z.boolean(),
    therapy: z.boolean(),
    dataCollection: z.boolean(),
    emergencyContact: z.boolean(),
  }),
  signature: z.string().min(2, 'Digital signature is required'),
  dateOfConsent: z.string(),
});

export type ConsentFormData = z.infer<typeof consentFormSchema>;

export interface ConsentRecord {
  id: string;
  userId: string;
  guardianId: string;
  consentData: ConsentFormData;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}
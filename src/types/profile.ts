import { z } from 'zod';

export const genderIdentitySchema = z.enum([
  'male',
  'female',
  'non_binary',
  'transgender',
  'other',
  'prefer_not_to_say'
]);

export const pronounSchema = z.enum([
  'he/him',
  'she/her',
  'they/them',
  'ze/zir',
  'prefer_name',
  'other'
]);

export const therapyPreferencesSchema = z.object({
  preferredGender: z.enum(['male', 'female', 'non_binary', 'no_preference']),
  preferredLanguages: z.array(z.string()).min(1, 'At least one preferred language is required'),
  preferredModality: z.array(z.enum(['video', 'audio', 'chat', 'in_person'])).min(1, 'Please select at least one session type'),
  specializations: z.array(z.string()).min(1, 'At least one area of focus is required'),
});

export const locationSchema = z.object({
  country: z.string().min(2, 'Country is required'),
  state: z.string(),
  city: z.string(),
  timezone: z.string(),
});

export const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string(),
  frequency: z.string(),
  startDate: z.string(),
});

export const healthHistorySchema = z.object({
  diagnoses: z.array(z.string()),
  medications: z.array(medicationSchema),
  allergies: z.array(z.string()),
  previousTherapy: z.boolean(),
  previousTherapyDetails: z.string(),
});

export const contactPreferencesSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  push: z.boolean(),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private', 'therapist_only']),
  shareHealthHistory: z.boolean(),
  shareJournals: z.boolean(),
  shareAssessments: z.boolean(),
});

export const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Emergency contact name is required'),
  relationship: z.string().min(2, 'Relationship is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
});

export const userProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  dateOfBirth: z.string(),
  genderIdentity: genderIdentitySchema,
  pronouns: pronounSchema,
  location: locationSchema,
  therapyPreferences: therapyPreferencesSchema,
  healthHistory: healthHistorySchema,
  contactPreferences: contactPreferencesSchema,
  privacySettings: privacySettingsSchema,
  emergencyContact: emergencyContactSchema,
});

export type GenderIdentity = z.infer<typeof genderIdentitySchema>;
export type Pronouns = z.infer<typeof pronounSchema>;
export type TherapyPreferences = z.infer<typeof therapyPreferencesSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Medication = z.infer<typeof medicationSchema>;
export type HealthHistory = z.infer<typeof healthHistorySchema>;
export type ContactPreferences = z.infer<typeof contactPreferencesSchema>;
export type PrivacySettings = z.infer<typeof privacySettingsSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
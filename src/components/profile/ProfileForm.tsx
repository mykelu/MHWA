import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserProfile, userProfileSchema } from '../../types/profile';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { ContactPreferencesSection } from './sections/ContactPreferencesSection';
import { EmergencyContactSection } from './sections/EmergencyContactSection';
import { TherapyPreferencesSection } from './sections/TherapyPreferencesSection';
import { HealthHistorySection } from './sections/HealthHistorySection';
import { PrivacySettingsSection } from './sections/PrivacySettingsSection';
import { useNavigate } from 'react-router-dom';

interface ProfileFormProps {
  initialData?: Partial<UserProfile>;
  onSubmit: (data: UserProfile) => Promise<void>;
}

export function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      ...initialData,
      contactPreferences: initialData?.contactPreferences || {
        email: false,
        sms: false,
        push: false,
      },
      privacySettings: initialData?.privacySettings || {
        profileVisibility: 'private',
        shareHealthHistory: false,
        shareJournals: false,
        shareAssessments: false,
      },
      location: initialData?.location || {
        country: '',
        state: '',
        city: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      therapyPreferences: initialData?.therapyPreferences || {
        preferredLanguages: [],
        preferredModality: [],
        specializations: [],
      },
      healthHistory: initialData?.healthHistory || {
        diagnoses: [],
        medications: [],
        allergies: [],
        previousTherapy: false,
        previousTherapyDetails: '',
      },
    },
  });

  const handleFormSubmit = async (data: UserProfile) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <PersonalInfoSection
        register={register}
        errors={errors}
        control={control}
      />

      <ContactPreferencesSection
        register={register}
        errors={errors}
      />

      <EmergencyContactSection
        register={register}
        errors={errors}
      />

      <TherapyPreferencesSection
        register={register}
        errors={errors}
        control={control}
      />

      <HealthHistorySection
        register={register}
        errors={errors}
        control={control}
      />

      <PrivacySettingsSection
        register={register}
        errors={errors}
      />

      <div className="flex justify-end space-x-4 sticky bottom-0 bg-gray-50 p-4 rounded-lg shadow-md">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
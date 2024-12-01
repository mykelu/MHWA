import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { UserProfile } from '../../../types/profile';

interface ContactPreferencesSectionProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
}

export function ContactPreferencesSection({
  register,
  errors,
}: ContactPreferencesSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Contact Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('contactPreferences.email')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-3 block text-sm font-medium text-gray-700">
            Email notifications
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('contactPreferences.sms')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-3 block text-sm font-medium text-gray-700">
            SMS notifications
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('contactPreferences.push')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label className="ml-3 block text-sm font-medium text-gray-700">
            Push notifications
          </label>
        </div>
      </div>
    </div>
  );
}
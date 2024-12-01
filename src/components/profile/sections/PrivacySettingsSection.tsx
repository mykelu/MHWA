import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { UserProfile } from '../../../types/profile';
import { Shield } from 'lucide-react';

interface PrivacySettingsSectionProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
}

export function PrivacySettingsSection({
  register,
  errors,
}: PrivacySettingsSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-6 w-6 text-indigo-600" />
        <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700">
            Profile Visibility
          </label>
          <select
            {...register('privacySettings.profileVisibility')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="public">Public - Visible to all users</option>
            <option value="private">Private - Only visible to you</option>
            <option value="therapist_only">Therapist Only - Visible to your therapist</option>
          </select>
          {errors.privacySettings?.profileVisibility && (
            <p className="mt-1 text-sm text-red-600">{errors.privacySettings.profileVisibility.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('privacySettings.shareHealthHistory')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              Share health history with therapist
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('privacySettings.shareJournals')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              Share journal entries with therapist
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('privacySettings.shareAssessments')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              Share assessment results with therapist
            </label>
          </div>
        </div>

        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Privacy Notice</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Your privacy is important to us. Information shared with your therapist is protected
                  by our privacy policy and applicable healthcare privacy laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
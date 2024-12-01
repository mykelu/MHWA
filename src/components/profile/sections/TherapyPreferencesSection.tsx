import React from 'react';
import { Control, UseFormRegister, FieldErrors, useFieldArray } from 'react-hook-form';
import { UserProfile } from '../../../types/profile';
import { Plus, X, AlertCircle } from 'lucide-react';

interface TherapyPreferencesSectionProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
  control: Control<UserProfile>;
}

export function TherapyPreferencesSection({
  register,
  errors,
  control,
}: TherapyPreferencesSectionProps) {
  const { fields: languages, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'therapyPreferences.preferredLanguages',
  });

  const { fields: specializations, append: appendSpecialization, remove: removeSpecialization } = useFieldArray({
    control,
    name: 'therapyPreferences.specializations',
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Therapy Preferences</h3>
      
      {/* Required Fields Notice */}
      <div className="mb-6 rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Fields marked with an asterisk (*) are required to help us match you with the most suitable therapist.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="preferredGender" className="block text-sm font-medium text-gray-700">
            Preferred Therapist Gender *
          </label>
          <select
            {...register('therapyPreferences.preferredGender')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Please select a preference</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non_binary">Non-binary</option>
            <option value="no_preference">No Preference</option>
          </select>
          {errors.therapyPreferences?.preferredGender && (
            <p className="mt-1 text-sm text-red-600">Please select your preferred therapist gender</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            This helps us match you with a therapist you'll feel most comfortable with
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Languages *
          </label>
          <div className="space-y-2">
            {languages.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  {...register(`therapyPreferences.preferredLanguages.${index}`)}
                  placeholder="Enter a language"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendLanguage('')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Language
            </button>
            {languages.length === 0 && (
              <p className="text-sm text-red-600">Please add at least one preferred language</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Session Type *
          </label>
          <div className="space-y-2">
            {['video', 'audio', 'chat', 'in_person'].map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  {...register('therapyPreferences.preferredModality')}
                  value={type}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-3 block text-sm font-medium text-gray-700">
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </label>
              </div>
            ))}
            {errors.therapyPreferences?.preferredModality && (
              <p className="text-sm text-red-600">Please select at least one session type</p>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Select all types of therapy sessions you're comfortable with
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Areas of Focus *
          </label>
          <div className="space-y-2">
            {specializations.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  {...register(`therapyPreferences.specializations.${index}`)}
                  placeholder="E.g., Anxiety, Depression, Relationships"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeSpecialization(index)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSpecialization('')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Area of Focus
            </button>
            {specializations.length === 0 && (
              <p className="text-sm text-red-600">Please add at least one area of focus</p>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Specify the main areas you'd like to work on with your therapist
          </p>
        </div>
      </div>
    </div>
  );
}
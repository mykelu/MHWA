import React from 'react';
import { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { format } from 'date-fns';
import { UserProfile, GenderIdentity, Pronouns } from '../../../types/profile';

interface PersonalInfoSectionProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
  control: Control<UserProfile>;
}

export function PersonalInfoSection({
  register,
  errors,
  control,
}: PersonalInfoSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <input
            type="text"
            {...register('displayName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            {...register('dateOfBirth')}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="genderIdentity" className="block text-sm font-medium text-gray-700">
            Gender Identity
          </label>
          <select
            {...register('genderIdentity')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select gender identity</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non_binary">Non-binary</option>
            <option value="transgender">Transgender</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
          {errors.genderIdentity && (
            <p className="mt-1 text-sm text-red-600">{errors.genderIdentity.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700">
            Pronouns
          </label>
          <select
            {...register('pronouns')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select pronouns</option>
            <option value="he/him">He/Him</option>
            <option value="she/her">She/Her</option>
            <option value="they/them">They/Them</option>
            <option value="ze/zir">Ze/Zir</option>
            <option value="prefer_name">Prefer name only</option>
            <option value="other">Other</option>
          </select>
          {errors.pronouns && (
            <p className="mt-1 text-sm text-red-600">{errors.pronouns.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                {...register('location.country')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State/Province
              </label>
              <input
                type="text"
                {...register('location.state')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                {...register('location.city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
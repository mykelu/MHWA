import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { UserProfile } from '../../../types/profile';

interface EmergencyContactSectionProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
}

export function EmergencyContactSection({
  register,
  errors,
}: EmergencyContactSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Emergency Contact</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700">
            Contact Name
          </label>
          <input
            type="text"
            {...register('emergencyContact.name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.emergencyContact?.name && (
            <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700">
            Relationship
          </label>
          <input
            type="text"
            {...register('emergencyContact.relationship')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.emergencyContact?.relationship && (
            <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.relationship.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            {...register('emergencyContact.phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.emergencyContact?.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="emergencyEmail" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            {...register('emergencyContact.email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.emergencyContact?.email && (
            <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.email.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
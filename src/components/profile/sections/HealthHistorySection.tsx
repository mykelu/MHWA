import React from 'react';
import { Control, UseFormRegister, FieldErrors, useFieldArray } from 'react-hook-form';
import { UserProfile } from '../../../types/profile';
import { Plus, X } from 'lucide-react';

interface HealthHistorySectionProps {
  register: UseFormRegister<UserProfile>;
  errors: FieldErrors<UserProfile>;
  control: Control<UserProfile>;
}

export function HealthHistorySection({
  register,
  errors,
  control,
}: HealthHistorySectionProps) {
  const { fields: diagnoses, append: appendDiagnosis, remove: removeDiagnosis } = useFieldArray({
    control,
    name: 'healthHistory.diagnoses',
  });

  const { fields: medications, append: appendMedication, remove: removeMedication } = useFieldArray({
    control,
    name: 'healthHistory.medications',
  });

  const { fields: allergies, append: appendAllergy, remove: removeAllergy } = useFieldArray({
    control,
    name: 'healthHistory.allergies',
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Health History</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Diagnoses
          </label>
          <div className="space-y-2">
            {diagnoses.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  {...register(`healthHistory.diagnoses.${index}`)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeDiagnosis(index)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendDiagnosis('')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Diagnosis
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Medications
          </label>
          <div className="space-y-4">
            {medications.map((field, index) => (
              <div key={field.id} className="space-y-2 p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      {...register(`healthHistory.medications.${index}.name`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dosage</label>
                    <input
                      type="text"
                      {...register(`healthHistory.medications.${index}.dosage`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frequency</label>
                    <input
                      type="text"
                      {...register(`healthHistory.medications.${index}.frequency`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      {...register(`healthHistory.medications.${index}.startDate`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendMedication({
                name: '',
                dosage: '',
                frequency: '',
                startDate: '',
              })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Allergies
          </label>
          <div className="space-y-2">
            {allergies.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  {...register(`healthHistory.allergies.${index}`)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => removeAllergy(index)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendAllergy('')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Allergy
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              {...register('healthHistory.previousTherapy')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              Previous therapy experience
            </label>
          </div>
          {errors.healthHistory?.previousTherapy && (
            <p className="mt-1 text-sm text-red-600">{errors.healthHistory.previousTherapy.message}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Additional Details
            </label>
            <textarea
              {...register('healthHistory.previousTherapyDetails')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Please share any relevant details about your previous therapy experience"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
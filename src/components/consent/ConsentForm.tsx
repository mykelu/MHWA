import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConsentFormData, consentFormSchema } from '../../types/consent';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ConsentFormProps {
  onSubmit: (data: ConsentFormData) => Promise<void>;
  initialData?: Partial<ConsentFormData>;
}

export function ConsentForm({ onSubmit, initialData }: ConsentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConsentFormData>({
    resolver: zodResolver(consentFormSchema),
    defaultValues: {
      ...initialData,
      dateOfConsent: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Guardian Consent Form</h3>

        <div className="space-y-6">
          {/* Minor Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="minorName" className="block text-sm font-medium text-gray-700">
                Minor's Full Name
              </label>
              <input
                type="text"
                {...register('minorName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.minorName && (
                <p className="mt-1 text-sm text-red-600">{errors.minorName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="minorDateOfBirth" className="block text-sm font-medium text-gray-700">
                Minor's Date of Birth
              </label>
              <input
                type="date"
                {...register('minorDateOfBirth')}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.minorDateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.minorDateOfBirth.message}</p>
              )}
            </div>
          </div>

          {/* Guardian Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="guardianName" className="block text-sm font-medium text-gray-700">
                Guardian's Full Name
              </label>
              <input
                type="text"
                {...register('guardianName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.guardianName && (
                <p className="mt-1 text-sm text-red-600">{errors.guardianName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="guardianRelationship" className="block text-sm font-medium text-gray-700">
                Relationship to Minor
              </label>
              <input
                type="text"
                {...register('guardianRelationship')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.guardianRelationship && (
                <p className="mt-1 text-sm text-red-600">{errors.guardianRelationship.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="guardianEmail" className="block text-sm font-medium text-gray-700">
                Guardian's Email
              </label>
              <input
                type="email"
                {...register('guardianEmail')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.guardianEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.guardianEmail.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="guardianPhone" className="block text-sm font-medium text-gray-700">
                Guardian's Phone
              </label>
              <input
                type="tel"
                {...register('guardianPhone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.guardianPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.guardianPhone.message}</p>
              )}
            </div>
          </div>

          {/* Consent Items */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Consent Items</h4>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    {...register('consentItems.accountCreation')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Account Creation</label>
                  <p className="text-gray-500">I consent to the creation of an account for the minor</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    {...register('consentItems.therapy')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Therapy Services</label>
                  <p className="text-gray-500">I consent to the minor receiving therapy services</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    {...register('consentItems.dataCollection')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Data Collection</label>
                  <p className="text-gray-500">I consent to the collection and processing of the minor's data</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    {...register('consentItems.emergencyContact')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700">Emergency Contact</label>
                  <p className="text-gray-500">I agree to be contacted in case of emergency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Signature */}
          <div>
            <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
              Digital Signature
            </label>
            <input
              type="text"
              {...register('signature')}
              placeholder="Type your full name as signature"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.signature && (
              <p className="mt-1 text-sm text-red-600">{errors.signature.message}</p>
            )}
          </div>

          {/* Date of Consent */}
          <div>
            <label htmlFor="dateOfConsent" className="block text-sm font-medium text-gray-700">
              Date of Consent
            </label>
            <input
              type="date"
              {...register('dateOfConsent')}
              defaultValue={format(new Date(), 'yyyy-MM-dd')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              readOnly
            />
          </div>

          {/* Legal Notice */}
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Legal Notice</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    By signing this form, you acknowledge that you are the legal guardian of the minor
                    and have the authority to provide consent for their participation in our services.
                    This consent is valid for one year from the date of signature and can be revoked at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Consent Form'}
          </button>
        </div>
      </div>
    </form>
  );
}
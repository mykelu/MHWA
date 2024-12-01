import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QRCodeSVG } from 'qrcode.react';
import { MFASetupFormData, mfaSetupSchema } from '../../types/auth';
import { AlertCircle } from 'lucide-react';

interface MFASetupProps {
  secretKey: string;
  qrCodeUrl: string;
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
}

export function MFASetup({ secretKey, qrCodeUrl, onVerify, onCancel }: MFASetupProps) {
  const [error, setError] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MFASetupFormData>({
    resolver: zodResolver(mfaSetupSchema),
  });

  const onSubmit = async (data: MFASetupFormData) => {
    try {
      setError(null);
      await onVerify(data.code);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify MFA code');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication Setup</h3>
        <p className="mt-1 text-sm text-gray-600">
          Scan the QR code with your authenticator app or enter the secret key manually
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <QRCodeSVG value={qrCodeUrl} size={200} />
        </div>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowSecret(!showSecret)}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          {showSecret ? 'Hide' : 'Show'} secret key
        </button>
        {showSecret && (
          <div className="p-2 bg-gray-50 rounded text-center font-mono text-sm">
            {secretKey}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <input
            {...register('code')}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="000000"
          />
          {errors.code && (
            <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { Fingerprint, AlertCircle } from 'lucide-react';
import { verifyBiometric } from '../../utils/biometric';

interface BiometricPromptProps {
  onVerify: (credential: any) => Promise<void>;
  onCancel: () => void;
}

export function BiometricPrompt({ onVerify, onCancel }: BiometricPromptProps) {
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleBiometricAuth = async () => {
    try {
      setIsVerifying(true);
      setError(null);
      const credential = await verifyBiometric();
      if (credential) {
        await onVerify(credential);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Biometric verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Use Biometric Login</h3>
        <p className="mt-1 text-sm text-gray-600">
          Verify your identity using your device's biometric sensor
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
        <button
          onClick={handleBiometricAuth}
          disabled={isVerifying}
          className={`p-4 rounded-full transition-colors ${
            isVerifying
              ? 'bg-gray-100 text-gray-400'
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          }`}
          aria-label="Authenticate with biometrics"
        >
          <Fingerprint className="h-12 w-12" />
        </button>
      </div>

      <div className="space-y-2">
        {isVerifying && (
          <p className="text-sm text-gray-600">
            Waiting for biometric verification...
          </p>
        )}
        <button
          onClick={onCancel}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Use password instead
        </button>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormData, loginSchema } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import { BiometricPrompt } from './BiometricPrompt';
import { MFASetup } from './MFASetup';
import { isBiometricAvailable } from '../../utils/biometric';
import { generateTOTPSecret } from '../../utils/twoFactor';
import { loginUser, verifyMFA, verifyBiometricAuth } from '../../utils/auth';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, state, clearError } = useAuth();
  const [showBiometric, setShowBiometric] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [mfaSecret, setMFASecret] = useState<{ secret: string; qrCode: string } | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    let mounted = true;

    const checkBiometric = async () => {
      try {
        const available = await isBiometricAvailable();
        if (mounted) {
          setBiometricSupported(available);
        }
      } catch (error) {
        console.warn('Biometric check failed:', error);
        if (mounted) {
          setBiometricSupported(false);
        }
      }
    };

    checkBiometric();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (state.error) {
      setLoginError(state.error);
      clearError();
    }
  }, [state.error, clearError]);

  useEffect(() => {
    if (state.user) {
      navigate('/');
    }
  }, [state.user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      const response = await loginUser(data.email, data.password);
      
      // Check if MFA is required
      if (response.user.mfaEnabled) {
        const { secret, qr } = generateTOTPSecret(data.email);
        setMFASecret({ secret, qrCode: qr });
        setShowMFA(true);
        return;
      }

      login(response.token);
      navigate('/');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'An error occurred during login');
      console.error('Login error:', error);
    }
  };

  const handleBiometricVerify = async (credential: any) => {
    try {
      setLoginError(null);
      const response = await verifyBiometricAuth(credential);
      login(response.token);
      navigate('/');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Biometric verification failed');
      console.error('Biometric verification error:', error);
      setShowBiometric(false);
    }
  };

  const handleMFAVerify = async (code: string) => {
    try {
      setLoginError(null);
      if (!mfaSecret) {
        throw new Error('MFA secret not initialized');
      }

      const response = await verifyMFA(code, mfaSecret.secret);
      login(response.token);
      navigate('/');
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'MFA verification failed');
      throw error;
    }
  };

  if (showBiometric) {
    return (
      <BiometricPrompt
        onVerify={handleBiometricVerify}
        onCancel={() => setShowBiometric(false)}
      />
    );
  }

  if (showMFA && mfaSecret) {
    return (
      <MFASetup
        secretKey={mfaSecret.secret}
        qrCodeUrl={mfaSecret.qrCode}
        onVerify={handleMFAVerify}
        onCancel={() => {
          setShowMFA(false);
          setMFASecret(null);
          reset();
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {loginError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{loginError}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </button>

      {biometricSupported && (
        <button
          type="button"
          onClick={() => setShowBiometric(true)}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Use biometric login
        </button>
      )}
    </form>
  );
}
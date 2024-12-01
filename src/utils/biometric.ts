import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

export async function isBiometricAvailable(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    
    // Check for WebAuthn support
    const available = window.PublicKeyCredential !== undefined &&
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
    // Check for secure context
    if (!window.isSecureContext) {
      console.warn('Biometric authentication requires a secure context (HTTPS)');
      return false;
    }
    
    return available;
  } catch (error) {
    console.warn('Biometric availability check failed:', error);
    return false;
  }
}

export async function registerBiometric(userId: string, username: string) {
  try {
    if (!await isBiometricAvailable()) {
      throw new Error('Biometric authentication is not available on this device');
    }

    // Generate random challenge
    const challengeBuffer = new Uint8Array(32);
    crypto.getRandomValues(challengeBuffer);
    const challenge = Buffer.from(challengeBuffer).toString('base64');
    
    const options = {
      challenge,
      rp: {
        name: 'MindWell',
        id: window.location.hostname
      },
      user: {
        id: Buffer.from(userId).toString('base64'),
        name: username,
        displayName: username
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' } // RS256
      ],
      timeout: 60000,
      attestation: 'none' as const,
      authenticatorSelection: {
        authenticatorAttachment: 'platform' as const,
        userVerification: 'preferred' as const,
        residentKey: 'preferred' as const
      }
    };

    const credential = await startRegistration(options);
    return credential;
  } catch (error) {
    handleBiometricError(error);
  }
}

export async function verifyBiometric() {
  try {
    if (!await isBiometricAvailable()) {
      throw new Error('Biometric authentication is not available on this device');
    }

    // Generate random challenge
    const challengeBuffer = new Uint8Array(32);
    crypto.getRandomValues(challengeBuffer);
    const challenge = Buffer.from(challengeBuffer).toString('base64');
    
    const options = {
      challenge,
      timeout: 60000,
      userVerification: 'preferred' as const,
      rpId: window.location.hostname
    };

    const credential = await startAuthentication(options);
    return credential;
  } catch (error) {
    handleBiometricError(error);
  }
}

function handleBiometricError(error: any): never {
  // Standardize error messages
  if (error.name === 'NotAllowedError') {
    throw new Error('Biometric authentication was denied by the user or device');
  }
  if (error.name === 'SecurityError') {
    throw new Error('Biometric authentication is not available in this context');
  }
  if (error.name === 'AbortError') {
    throw new Error('Biometric authentication was cancelled');
  }
  if (error.name === 'NotSupportedError') {
    throw new Error('Biometric authentication is not supported on this device');
  }
  
  // For unknown errors, provide a generic message
  throw new Error('Biometric authentication failed. Please try again or use password login.');
}
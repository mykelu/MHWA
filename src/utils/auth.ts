import { jwtDecode } from 'jwt-decode';
import { User, RegisterFormData } from '../types/auth';
import { verifyConsent } from '../services/consent';
import { verifyTOTPToken } from './twoFactor';

interface AuthResponse {
  token: string;
  user: User;
}

// Simulated user database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'test@example.com': {
    password: 'password123',
    user: {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'adult',
      mfaEnabled: false,
      biometricEnabled: false,
    },
  },
};

export function validateToken(token: string): User {
  try {
    // First try to decode the token
    let decoded: any;
    try {
      decoded = JSON.parse(atob(token));
    } catch {
      throw new Error('Invalid token format');
    }
    
    // Verify token structure and required fields
    if (!decoded || typeof decoded !== 'object') {
      throw new Error('Invalid token structure');
    }

    const requiredFields = ['id', 'email', 'role', 'name'];
    for (const field of requiredFields) {
      if (!decoded[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Verify token expiration
    if (!decoded.exp || typeof decoded.exp !== 'number') {
      throw new Error('Invalid expiration time');
    }

    if (decoded.exp < Date.now()) {
      throw new Error('Token has expired');
    }

    // Return user data with proper type checking
    return {
      id: String(decoded.id),
      email: String(decoded.email),
      name: String(decoded.name),
      role: decoded.role,
      mfaEnabled: Boolean(decoded.mfaEnabled),
      biometricEnabled: Boolean(decoded.biometricEnabled),
    };
  } catch (error) {
    console.error('Token validation error:', error);
    throw new Error('Invalid token');
  }
}

export async function registerUser(data: RegisterFormData): Promise<AuthResponse> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    if (MOCK_USERS[data.email]) {
      throw new Error('Email already registered');
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: data.role,
      mfaEnabled: false,
      biometricEnabled: false,
    };

    // Store user (in a real app, this would be in a database)
    MOCK_USERS[data.email] = {
      password: data.password,
      user: newUser,
    };

    // Generate token
    const token = generateToken(newUser);

    return { token, user: newUser };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const userRecord = MOCK_USERS[email];
    if (!userRecord || userRecord.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Check if consent is required for minors
    if (userRecord.user.role === 'minor') {
      const hasConsent = await verifyConsent(userRecord.user.id);
      if (!hasConsent) {
        throw new Error('Guardian consent required');
      }
    }

    // Generate token
    const token = generateToken(userRecord.user);
    return { token, user: userRecord.user };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function verifyMFA(code: string, secret: string): Promise<AuthResponse> {
  try {
    const isValid = verifyTOTPToken(code, secret);
    if (!isValid) {
      throw new Error('Invalid MFA code');
    }

    const mockUser = MOCK_USERS['test@example.com'].user;
    const token = generateToken(mockUser);
    return { token, user: mockUser };
  } catch (error) {
    console.error('MFA verification error:', error);
    throw error;
  }
}

export async function verifyBiometricAuth(credential: any): Promise<AuthResponse> {
  try {
    const mockUser = MOCK_USERS['test@example.com'].user;
    const token = generateToken(mockUser);
    return { token, user: mockUser };
  } catch (error) {
    console.error('Biometric verification error:', error);
    throw error;
  }
}

function generateToken(user: User): string {
  // Create token payload with proper typing
  const payload = {
    ...user,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  try {
    // Ensure all required fields are present and of correct type
    const tokenData = {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role,
      mfaEnabled: Boolean(payload.mfaEnabled),
      biometricEnabled: Boolean(payload.biometricEnabled),
      iat: Number(payload.iat),
      exp: Number(payload.exp),
    };

    // Convert to base64
    return btoa(JSON.stringify(tokenData));
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
}
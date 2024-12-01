import { z } from 'zod';

export type UserRole = 'minor' | 'adult' | 'therapist' | 'support' | 'moderator' | 'admin' | 'superadmin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  mfaEnabled: boolean;
  biometricEnabled: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  mfaRequired: boolean;
  biometricAvailable: boolean;
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
  role: z.enum(['minor', 'adult', 'therapist']),
  dateOfBirth: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const mfaSetupSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type MFASetupFormData = z.infer<typeof mfaSetupSchema>;

export interface RolePermissions {
  canAccessTherapy: boolean;
  canAccessChat: boolean;
  canAccessAssessments: boolean;
  canModerateContent: boolean;
  canManageUsers: boolean;
  canManageSystem: boolean;
}
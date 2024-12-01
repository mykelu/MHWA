import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthState, User } from '../types/auth';
import { validateToken } from '../utils/auth';

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_MFA_REQUIRED'; payload: boolean }
  | { type: 'SET_BIOMETRIC_AVAILABLE'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
  mfaRequired: false,
  biometricAvailable: false,
};

const AuthContext = createContext<{
  state: AuthState;
  login: (token: string) => void;
  logout: () => void;
  clearError: () => void;
  setMFARequired: (required: boolean) => void;
  setBiometricAvailable: (available: boolean) => void;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
        mfaRequired: false,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
        mfaRequired: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_MFA_REQUIRED':
      return {
        ...state,
        mfaRequired: action.payload,
      };
    case 'SET_BIOMETRIC_AVAILABLE':
      return {
        ...state,
        biometricAvailable: action.payload,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      try {
        const user = validateToken(state.token);
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: state.token },
        });
      } catch (error) {
        localStorage.removeItem('token');
        dispatch({
          type: 'LOGIN_ERROR',
          payload: error instanceof Error ? error.message : 'Invalid token',
        });
      }
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const login = (token: string) => {
    try {
      const user = validateToken(token);
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error instanceof Error ? error.message : 'Invalid token format',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const setMFARequired = (required: boolean) => {
    dispatch({ type: 'SET_MFA_REQUIRED', payload: required });
  };

  const setBiometricAvailable = (available: boolean) => {
    dispatch({ type: 'SET_BIOMETRIC_AVAILABLE', payload: available });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        clearError,
        setMFARequired,
        setBiometricAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
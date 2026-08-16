'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '../app/AuthAxios';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'secretary' | string;
  [key: string]: unknown;
}

export interface AuthContextValue {
  /** Authenticated user, or null when logged-out / loading */
  user: User | null;
  /** True while the initial hydration from localStorage is running */
  initializing: boolean;
  /** True while a login/logout request is in-flight */
  loading: boolean;
  /** Sign the user in and redirect to their role dashboard */
  login: (email: string, password: string) => Promise<void>;
  /** Clear the session and redirect to /signin */
  logout: () => void;
  /** Update the in-memory user (e.g. after a profile update) */
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────────
// API helpers (cloned & centralised from signin/page.tsx)
// ─────────────────────────────────────────────

async function apiLogin(email: string, password: string): Promise<string> {
  const response = await axiosInstance.post('api/auth/login', { email, password });
  return response.data.token.access_token as string;
}

async function apiFetchMe(): Promise<User> {
  const response = await axiosInstance.post<User>('api/auth/me');
  return response.data;
}

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  // Hydrate user from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored) as User);
      }
    } catch {
      // Corrupted data — clear it
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setInitializing(false);
    }
  }, []);

  /**
   * login
   * Calls the login endpoint, stores the token & user in localStorage,
   * updates context state, then redirects the user to their role dashboard.
   */
  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const token = await apiLogin(email, password);
        localStorage.setItem('token', token);

        const me = await apiFetchMe();
        localStorage.setItem('user', JSON.stringify(me));

        setUser(me);
        router.push(`/${me.role}`);
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  /**
   * logout
   * Clears the session and sends the user back to /signin.
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/signin');
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, initializing, loading, login, logout, setUser }),
    [user, initializing, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

/**
 * useAuth – consume the auth context anywhere inside <AuthProvider />.
 * Throws if used outside of a provider so bugs surface immediately.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

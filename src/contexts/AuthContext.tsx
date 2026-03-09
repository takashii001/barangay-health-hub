import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types/auth';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapDbUserToUser(dbUser: any): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.full_name || dbUser.email,
    role: dbUser.role || 'citizen',
    avatar: dbUser.avatar_url,
    phone: dbUser.phone,
    address: dbUser.address,
  };
}

function buildUserFromSession(sessionUser: any): User {
  const userRole = sessionUser.user_metadata?.role || 'citizen';
  return {
    id: sessionUser.id,
    email: sessionUser.email || '',
    name: sessionUser.user_metadata?.full_name || sessionUser.email || '',
    role: userRole as UserRole,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile from DB without blocking the auth listener
  const fetchAndSetUser = useCallback((sessionUser: any) => {
    // For admin emails, set admin role directly without DB dependency
    if (sessionUser.email === 'admin@barangay.gov') {
      setUser({
        id: sessionUser.id,
        email: sessionUser.email || '',
        name: sessionUser.user_metadata?.full_name || sessionUser.email || 'Admin',
        role: 'admin' as UserRole,
      });
      return;
    }

    // Try to fetch from users table, but handle gracefully if table doesn't exist
    supabase
      .from('users')
      .select('*')
      .eq('id', sessionUser.id)
      .single()
      .then(({ data: profile, error }) => {
        if (profile && !error) {
          setUser(mapDbUserToUser(profile));
        } else {
          // Fallback: determine role from email pattern or default to citizen
          let role: UserRole = 'citizen';
          if (sessionUser.email?.includes('@barangay.gov')) {
            role = 'admin';
          } else if (sessionUser.email?.includes('@health.gov')) {
            role = 'health_worker';
          }
          
          setUser({
            id: sessionUser.id,
            email: sessionUser.email || '',
            name: sessionUser.user_metadata?.full_name || sessionUser.email || '',
            role,
          });
        }
      });
  }, []);

  useEffect(() => {
    let mounted = true;

    // Step 1: Get the initial session synchronously from storage
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return;
      setSession(initialSession);
      if (initialSession?.user) {
        fetchAndSetUser(initialSession.user);
      }
      // Always clear loading after initial session check
      setIsLoading(false);
    }).catch(() => {
      if (mounted) setIsLoading(false);
    });

    // Step 2: Listen for subsequent auth changes (sign in, sign out, token refresh)
    // CRITICAL: Do NOT use async/await inside this callback — it causes deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user) {
        fetchAndSetUser(newSession.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchAndSetUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signup = useCallback(async (email: string, password: string, fullName: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;

    if (data.user) {
      await supabase.from('users').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
      });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setSession(null);
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

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
    // Always try to fetch from users table first (source of truth)
    supabase
      .from('users')
      .select('*')
      .eq('id', sessionUser.id)
      .maybeSingle()
      .then(({ data: profile, error }) => {
        if (profile && !error) {
          setUser(mapDbUserToUser(profile));
        } else {
          // Fallback: use metadata or email-based inference
          const metadataRole = sessionUser.user_metadata?.role;
          let role: UserRole = 'citizen';
          const email = sessionUser.email || '';

          if (metadataRole && ['citizen', 'business_owner', 'bhw', 'sanitation_inspector', 'nurse', 'admin'].includes(metadataRole)) {
            role = metadataRole as UserRole;
          } else if (email === 'admin@barangay.gov') {
            role = 'admin';
          } else if (email.startsWith('bhw@')) {
            role = 'bhw';
          } else if (email.includes('sanitation')) {
            role = 'sanitation_inspector';
          } else if (email.startsWith('nurse@') || email.includes('@health.gov')) {
            role = 'nurse';
          } else if (email.includes('business')) {
            role = 'business_owner';
          }

          // Try to build a readable name from metadata or email
          const fallbackName = sessionUser.user_metadata?.full_name
            || email.split('@')[0]?.replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
            || 'User';

          setUser({
            id: sessionUser.id,
            email,
            name: fallbackName,
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

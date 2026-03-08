import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User, UserRole, ROLE_LABELS } from '@/types/auth';
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

// Demo users for prototype fallback (when Supabase is not configured)
const DEMO_USERS: Record<UserRole, User> = {
  citizen: {
    id: '1',
    email: 'juan.delacruz@email.com',
    name: 'Juan Dela Cruz',
    role: 'citizen',
  },
  business_owner: {
    id: '2',
    email: 'maria.santos@business.com',
    name: 'Maria Santos',
    role: 'business_owner',
  },
  bhw: {
    id: '3',
    email: 'ana.reyes@lgu.gov.ph',
    name: 'Ana Reyes',
    role: 'bhw',
  },
  sanitation_inspector: {
    id: '4',
    email: 'pedro.garcia@lgu.gov.ph',
    name: 'Pedro Garcia',
    role: 'sanitation_inspector',
  },
  nurse: {
    id: '5',
    email: 'rosa.cruz@lgu.gov.ph',
    name: 'Rosa Cruz',
    role: 'nurse',
  },
  admin: {
    id: '6',
    email: 'admin@lgu.gov.ph',
    name: 'Dr. Jose Rizal',
    role: 'admin',
  },
};

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if Supabase is configured
  const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);

      if (newSession?.user) {
        // Fetch user profile from users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', newSession.user.id)
          .single();

        if (profile) {
          setUser(mapDbUserToUser(profile));
        } else {
          // Fallback: use auth user data
          setUser({
            id: newSession.user.id,
            email: newSession.user.email || '',
            name: newSession.user.user_metadata?.full_name || newSession.user.email || '',
            role: 'citizen',
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', existingSession.user.id)
          .single();

        if (profile) {
          setUser(mapDbUserToUser(profile));
        } else {
          setUser({
            id: existingSession.user.id,
            email: existingSession.user.email || '',
            name: existingSession.user.user_metadata?.full_name || existingSession.user.email || '',
            role: 'citizen',
          });
        }
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isSupabaseConfigured]);

  const login = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode: match by email or default to citizen
      await new Promise(resolve => setTimeout(resolve, 500));
      const matchedUser = Object.values(DEMO_USERS).find(u => u.email === email);
      if (matchedUser) {
        setUser(matchedUser);
      } else {
        // Use the role from email pattern or default
        setUser(DEMO_USERS.citizen);
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, [isSupabaseConfigured]);

  const signup = useCallback(async (email: string, password: string, fullName: string, role: UserRole) => {
    if (!isSupabaseConfigured) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser({ id: '99', email, name: fullName, role });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;

    // Create user profile in users table
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
      });
    }
  }, [isSupabaseConfigured]);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  }, [isSupabaseConfigured]);

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

// Helper hook for demo mode quick login
export function useDemoLogin() {
  const { login } = useAuth();

  const demoLogin = useCallback(async (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      await login(demoUser.email, 'demo123');
    }
  }, [login]);

  return { demoLogin, demoUsers: DEMO_USERS };
}

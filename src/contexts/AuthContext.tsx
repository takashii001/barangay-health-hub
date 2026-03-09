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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetUser = useCallback(async (sessionUser: any) => {
    try {
      // Query users table using user_id (not id)
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', sessionUser.id)
        .single();

      if (!error && dbUser) {
        setUser({
          id: dbUser.user_id,
          email: dbUser.email,
          name: dbUser.full_name || dbUser.email,
          role: dbUser.user_type || 'citizen',
          phone: dbUser.contact_no,
          address: dbUser.address,
        });
        return;
      }
    } catch (err) {
      console.warn('Could not fetch user from users table, using session metadata:', err);
    }

    // Fallback to session metadata
    const meta = sessionUser.user_metadata || {};
    const displayName =
      meta.full_name ||
      meta.name ||
      sessionUser.email?.split('@')[0]?.replace(/[._]/g, ' ')?.replace(/\b\w/g, (c: string) => c.toUpperCase()) ||
      'User';

    const metaRole = meta.user_type || meta.role;
    let role: UserRole = 'citizen';
    if (metaRole && ['citizen', 'business_owner', 'health_worker', 'inspector', 'admin'].includes(metaRole)) {
      role = metaRole as UserRole;
    }

    setUser({
      id: sessionUser.id,
      email: sessionUser.email || '',
      name: displayName,
      role,
      phone: meta.contact_no,
      address: meta.address,
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return;
      setSession(initialSession);
      if (initialSession?.user) {
        fetchAndSetUser(initialSession.user);
      }
      setIsLoading(false);
    }).catch(() => {
      if (mounted) setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
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
        data: { full_name: fullName, user_type: role },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;

    if (data.user) {
      try {
        await supabase.from('users').upsert({
          user_id: data.user.id,
          email,
          full_name: fullName,
          user_type: role,
        });
      } catch (err) {
        console.warn('Could not insert into users table:', err);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
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

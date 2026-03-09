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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile from DB with graceful fallback to session metadata
  const fetchAndSetUser = useCallback(async (sessionUser: any) => {
    try {
      // First try to get user from the users table
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (profile && !error) {
        setUser(mapDbUserToUser(profile));
        return;
      }

      // Log specific database errors for debugging
      if (error) {
        console.log('Database query error:', error.code, error.message);
        
        // Check if it's a table not found or column not found error
        if (error.code === '42P01' || error.code === '42703') {
          console.log('Database schema not ready, using session metadata');
        }
      }
    } catch (error: any) {
      console.log('Database not accessible:', error.message);
    }

    // Fallback: Create user from session metadata
    const metadataRole = sessionUser.user_metadata?.role;
    const email = sessionUser.email || '';
    let role: UserRole = 'citizen';

    // Role inference logic
    if (metadataRole && ['citizen', 'business_owner', 'health_worker', 'inspector', 'admin'].includes(metadataRole)) {
      role = metadataRole as UserRole;
    } else if (email === 'admin@barangay.gov' || email === 'admin@lgu.gov.ph') {
      role = 'admin';
    } else if (email.includes('health') || email.startsWith('ana.')) {
      role = 'health_worker';
    } else if (email.includes('inspector') || email.includes('sanitation') || email.startsWith('pedro.')) {
      role = 'inspector';  
    } else if (email.includes('business') || email.startsWith('maria.')) {
      role = 'business_owner';
    }

    // Create a proper display name from metadata or email
    let displayName = sessionUser.user_metadata?.full_name || 'User';
    
    if (!sessionUser.user_metadata?.full_name && email) {
      const emailPrefix = email.split('@')[0];
      if (emailPrefix) {
        const nameMap: Record<string, string> = {
          'admin': 'Administrator',
          'health': 'Health Worker',
          'inspector': 'Inspector',
          'ana.reyes': 'Ana Reyes',
          'pedro.garcia': 'Pedro Garcia',
          'maria.santos': 'Maria Santos',
          'juan.delacruz': 'Juan dela Cruz'
        };
        
        displayName = nameMap[emailPrefix] || 
          emailPrefix.replace(/[._]/g, ' ')
                    .replace(/\b\w/g, (c: string) => c.toUpperCase());
      }
    }

    setUser({
      id: sessionUser.id,
      email,
      name: displayName,
      role,
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    // Step 1: Get the initial session
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

    // Step 2: Listen for auth changes
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

    // Try to insert into users table if it exists
    if (data.user) {
      try {
        await supabase.from('users').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          role,
        });
      } catch (error) {
        console.log('Could not insert into users table:', error);
        // Don't throw error - user can still work with session metadata
      }
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
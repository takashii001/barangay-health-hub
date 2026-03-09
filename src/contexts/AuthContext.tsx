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
  const fetchAndSetUser = useCallback(async (sessionUser: any) => {
    // Try to fetch from users table first, but handle gracefully if it doesn't exist
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (profile && !error) {
        setUser(mapDbUserToUser(profile));
        return;
      }
    } catch (error) {
      // Table doesn't exist or other DB error - continue with fallback
      console.log('Users table not accessible, using fallback');
    }

    // Fallback: Create user from metadata and email patterns
    const metadataRole = sessionUser.user_metadata?.role;
    const email = sessionUser.email || '';
    let role: UserRole = 'citizen';

    // Role inference logic
    if (metadataRole && ['citizen', 'business_owner', 'health_worker', 'inspector', 'admin'].includes(metadataRole)) {
      role = metadataRole as UserRole;
    } else if (email === 'admin@barangay.gov') {
      role = 'admin';
    } else if (email.startsWith('health@') || email.includes('health')) {
      role = 'health_worker';
    } else if (email.includes('inspector') || email.includes('sanitation')) {
      role = 'inspector';  
    } else if (email.includes('business')) {
      role = 'business_owner';
    }

    // Create a proper display name from email
    let displayName = sessionUser.user_metadata?.full_name || 'User';
    
    if (!sessionUser.user_metadata?.full_name && email) {
      // Extract name from email prefix and create proper capitalization
      const emailPrefix = email.split('@')[0];
      if (emailPrefix) {
        // Convert email prefixes like "admin", "bhw", "resident" to proper names
        const nameMap: Record<string, string> = {
          'admin': 'Administrator',
          'bhw': 'Barangay Health Worker',
          'resident': 'Resident User',
          'sanitation': 'Sanitation Inspector',
          'nurse': 'Nurse Practitioner'
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

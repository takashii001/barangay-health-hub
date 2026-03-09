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
    role: dbUser.user_type || 'citizen',
    avatar: dbUser.avatar_url,
    phone: dbUser.contact_no,
    address: dbUser.address,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user from database, fallback to session metadata
  const fetchAndSetUser = useCallback(async (sessionUser: any) => {
    try {
      // First try to get user from database
      const { data: dbUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (!error && dbUser) {
        // Use database user data
        setUser(mapDbUserToUser(dbUser));
        return;
      }
    } catch (error) {
      console.log('Could not fetch user from database, using session metadata');
    }

    // Fallback to session metadata
    let freshMetadata = sessionUser.user_metadata || {};
    try {
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      if (freshUser?.user_metadata) {
        freshMetadata = freshUser.user_metadata;
      }
    } catch (err) {
      console.log('Could not fetch fresh user data, using session metadata');
    }

    const displayName = 
      freshMetadata.full_name || 
      freshMetadata.name || 
      freshMetadata.display_name ||
      sessionUser.email?.split('@')[0]?.replace(/[._]/g, ' ')?.replace(/\b\w/g, (c: string) => c.toUpperCase()) ||
      'User';

    const metadataRole = freshMetadata.user_type || freshMetadata.role;
    const email = sessionUser.email || '';
    let role: UserRole = 'citizen';

    if (metadataRole && ['citizen', 'business_owner', 'health_worker', 'inspector', 'admin'].includes(metadataRole)) {
      role = metadataRole as UserRole;
    }

    setUser({
      id: sessionUser.id,
      email,
      name: displayName,
      role,
      avatar: freshMetadata.avatar_url,
      phone: freshMetadata.contact_no || freshMetadata.phone,
      address: freshMetadata.address,
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
        data: { full_name: fullName, user_type: role },
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
          user_type: role,
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
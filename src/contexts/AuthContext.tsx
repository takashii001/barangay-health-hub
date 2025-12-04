import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole, ROLE_LABELS } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for prototype
const DEMO_USERS: Record<UserRole, User> = {
  resident: {
    id: '1',
    email: 'juan.delacruz@email.com',
    name: 'Juan Dela Cruz',
    role: 'resident',
  },
  bhw: {
    id: '2',
    email: 'maria.santos@barangay.gov.ph',
    name: 'Maria Santos',
    role: 'bhw',
  },
  bsi: {
    id: '3',
    email: 'pedro.reyes@barangay.gov.ph',
    name: 'Pedro Reyes',
    role: 'bsi',
  },
  clerk: {
    id: '4',
    email: 'ana.garcia@barangay.gov.ph',
    name: 'Ana Garcia',
    role: 'clerk',
  },
  captain: {
    id: '5',
    email: 'jose.rizal@barangay.gov.ph',
    name: 'Kap. Jose Rizal',
    role: 'captain',
  },
  sysadmin: {
    id: '6',
    email: 'admin@barangay.gov.ph',
    name: 'System Admin',
    role: 'sysadmin',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(DEMO_USERS[role]);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser(DEMO_USERS[role]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
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

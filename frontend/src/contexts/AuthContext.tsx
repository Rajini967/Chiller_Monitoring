import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const mockUsers: Record<string, User> = {
  'operator@logbook.io': {
    id: 'op-001',
    name: 'James Wilson',
    email: 'operator@logbook.io',
    role: 'operator',
    siteId: 'site-001',
  },
  'supervisor@logbook.io': {
    id: 'sv-001',
    name: 'Sarah Chen',
    email: 'supervisor@logbook.io',
    role: 'supervisor',
    siteId: 'site-001',
  },
  'customer@logbook.io': {
    id: 'cu-001',
    name: 'Michael Foster',
    email: 'customer@logbook.io',
    role: 'customer',
    siteId: 'site-001',
  },
  'admin@logbook.io': {
    id: 'ad-001',
    name: 'Emily Rodriguez',
    email: 'admin@logbook.io',
    role: 'super_admin',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    const foundUser = mockUsers[email.toLowerCase()];
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
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

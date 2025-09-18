import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  dateOfBirth?: string;
  location?: string;
  contactNumber?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('navbus_user');
    const savedAuth = localStorage.getItem('navbus_authenticated');
    
    if (savedUser && savedAuth === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem('navbus_user', JSON.stringify(user));
      localStorage.setItem('navbus_authenticated', 'true');
    } else {
      localStorage.removeItem('navbus_user');
      localStorage.removeItem('navbus_authenticated');
    }
  }, [user, isAuthenticated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would call your backend
    if (email && password) {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        surname: 'Doe',
        email: email,
        dateOfBirth: '1990-05-15',
        location: 'New York, NY',
        contactNumber: '',
        phoneNumber: ''
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const signup = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock registration - in real app, this would call your backend
    const newUser: User = {
      id: Date.now().toString(),
      firstName: userData.firstName || '',
      surname: userData.surname || '',
      email: userData.email,
      dateOfBirth: userData.dateOfBirth || '',
      location: userData.location || '',
      contactNumber: userData.contactNumber || '',
      phoneNumber: userData.phoneNumber || ''
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export interface User {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  sendOtp: (phone: string) => Promise<{ error: string | null }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ error: string | null }>;
}

export interface FormErrors {
  [key: string]: string;
}

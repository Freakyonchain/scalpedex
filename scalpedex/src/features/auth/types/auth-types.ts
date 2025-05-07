// /src/features/auth/types/auth-types.ts

export interface User {
    id: string;
    email: string;
    username?: string;
    createdAt?: string;
  }
  
  export interface SignInCredentials {
    email: string;
    password: string;
  }
  
  export interface SignUpData {
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface ResetPasswordData {
    email: string;
  }
  
  export interface NewPasswordData {
    password: string;
    confirmPassword: string;
    token: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    user?: User | null;
    error?: string;
    message?: string;
  }
  
  export interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
  }
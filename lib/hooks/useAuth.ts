import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useAuthStore } from '../zustand/authStore';
import { LOGIN_USER, REGISTER_USER, LOGIN_ADMIN } from '../graphql/mutations';

interface LoginResponse {
  loginUser?: {
    user?: { id: string; email: string };
    token?: string;
    errors?: string[];
  };
}

interface RegisterResponse {
  registerUser?: {
    user?: { id: string; email: string };
    token?: string;
    errors?: string[];
  };
}

interface LoginAdminResponse {
  loginAdmin?: {
    adminUser?: { id: string; email: string };
    token?: string;
    errors?: string[];
  };
}

export const useAuth = () => {
  const { user, token, loginUser, loginAdmin, logout: logoutStore, isAuthenticated, isAdmin } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const [loginUserMutation, { loading: loginLoading }] = useMutation<LoginResponse>(LOGIN_USER);
  const [registerUserMutation, { loading: registerLoading }] = useMutation<RegisterResponse>(REGISTER_USER);
  const [loginAdminMutation, { loading: loginAdminLoading }] = useMutation<LoginAdminResponse>(LOGIN_ADMIN);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const { data } = await loginUserMutation({
        variables: { email, password },
      });

      if (data?.loginUser?.errors && data.loginUser.errors.length > 0) {
        setError(data.loginUser.errors.join(', '));
        return false;
      }

      if (data?.loginUser?.token) {
        loginUser(data.loginUser.token);
        return true;
      }

      setError('Login failed. Please try again.');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      return false;
    }
  };

  const register = async (email: string, password: string, passwordConfirmation: string): Promise<boolean> => {
    setError(null);
    try {
      const { data } = await registerUserMutation({
        variables: { email, password, passwordConfirmation },
      });

      if (data?.registerUser?.errors && data.registerUser.errors.length > 0) {
        setError(data.registerUser.errors.join(', '));
        return false;
      }

      if (data?.registerUser?.token) {
        loginUser(data.registerUser.token);
        return true;
      }

      setError('Registration failed. Please try again.');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      return false;
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const { data } = await loginAdminMutation({
        variables: { email, password },
      });

      if (data?.loginAdmin?.errors && data.loginAdmin.errors.length > 0) {
        setError(data.loginAdmin.errors.join(', '));
        return false;
      }

      if (data?.loginAdmin?.token) {
        loginAdmin(data.loginAdmin.token);
        return true;
      }

      setError('Admin login failed. Please try again.');
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during admin login');
      return false;
    }
  };

  const logout = () => {
    logoutStore();
    setError(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return {
    user,
    token,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    register,
    loginAsAdmin,
    logout,
    loading: loginLoading || registerLoading || loginAdminLoading,
    error,
  };
};


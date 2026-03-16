import { useState } from 'react';
import type { LoginRequest, LoginResponse } from '../types/auth';
import { login as loginApi } from '../api/mock/auth';

export const useAuth = () => {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi(data);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, loading, error, login, logout };
};

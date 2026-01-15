'use client';

import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api/auth';
import { transactionApi } from '@/lib/api/transaction';
import { apiClient } from '@/lib/api/client';
import { LoginRequest, SignupRequest, AuthResponse } from '@/lib/types/auth';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const currentUser = authApi.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      refreshBalance();
    }
    setLoading(false);
  }, []);

  const refreshBalance = useCallback(async () => {
    try {
      const data = await transactionApi.getBalance();
      setUser((prev: any) => ({
        ...prev,
        balance: data.balance,
        accountNumber: data.accountNumber
      }));
    } catch (err) {
      console.error("Failed to refresh balance", err);
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(credentials);
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles,
        balance: response.balance,
        accountNumber: response.accountNumber
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (userData: SignupRequest) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register(userData);
      router.push('/login');
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    router.push('/login');
  }, [router]);

  const isAuthenticated = useCallback(() => {
    if (!isMounted) return false;
    return !!user;
  }, [user, isMounted]);

  const recharge = useCallback(async (amount: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getClient().post('/api/user/recharge', { amount: Number(amount) });
      setUser((prev: any) => ({
        ...prev,
        balance: response.data.balance
      }));
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Recharge failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.getClient().post('/api/user/change-password', { oldPassword, newPassword });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Password change failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isMounted,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    refreshBalance,
    recharge,
    changePassword,
  };
};

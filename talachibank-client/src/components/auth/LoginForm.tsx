'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'; // Need to ensure these are imported

import { useAuth } from '@/hooks/useAuth';
import ToastNotification, { showSuccess, showError } from '../ui/ToastNotification';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    setLoading(true);

    try {
      await login({
        username: formData.username,
        password: formData.password
      });
      // Component-level redirection
      window.location.replace('/dashboard');
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastNotification />

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-900 rounded-lg flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              TB
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Talachi Bank
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Post-Quantum Secure Access
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">

              {/* Username */}
              <div className="relative group">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="peer w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder-transparent"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <label
                  htmlFor="username"
                  className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-indigo-600"
                >
                  Username
                </label>
              </div>

              {/* Password */}
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="peer w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all placeholder-transparent"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-400 peer-focus:-top-2.5 peer-focus:text-primary-600"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-gray-900">Remember me</label>
              </div>
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-900 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-500">Don't have an account? </span>
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
                Register now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

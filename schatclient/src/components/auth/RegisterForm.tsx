'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { useAuth } from '@/hooks/useAuth';
import ToastNotification, { showSuccess, showError, showWarning } from '../ui/ToastNotification';

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  // State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validation State
  const [validations, setValidations] = useState({
    usernameLength: false,
    usernameFormat: false,
    emailFormat: false,
    pwdLength: false,
    pwdUpper: false,
    pwdLower: false,
    pwdNumber: false,
    pwdSpecial: false,
    pwdMatch: false,
  });

  // Real-time validation effect
  useEffect(() => {
    const v = {
      usernameLength: formData.username.length >= 3 && formData.username.length <= 20,
      usernameFormat: /^[a-zA-Z0-9_]+$/.test(formData.username),
      emailFormat: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      pwdLength: formData.password.length >= 8,
      pwdUpper: /[A-Z]/.test(formData.password),
      pwdLower: /[a-z]/.test(formData.password),
      pwdNumber: /[0-9]/.test(formData.password),
      pwdSpecial: /[!@#$%^&*]/.test(formData.password),
      pwdMatch: formData.password === formData.confirmPassword && formData.password !== '',
    };

    setValidations(v);
    setIsValid(Object.values(v).every(Boolean));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      showWarning("Please meet all requirements before registering.");
      return;
    }

    setLoading(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      showSuccess("Registration successful! Welcome aboard.");
      router.push('/login');
    } catch (err: any) {
      console.error(err);
      showError(err.message || "Registration failed. Please try again.");
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
              Open Account
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Secure onboarding with <span className="text-primary-600 font-semibold">Post-Quantum</span> keys
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">

              {/* Username Field */}
              <div className="relative group">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`peer w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-offset-0 outline-none transition-all duration-200 placeholder-transparent ${validations.usernameLength && validations.usernameFormat
                    ? 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
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

                <div className="mt-1 text-xs text-gray-400 pl-1 flex space-x-3">
                  <span className={validations.usernameLength ? 'text-green-600' : ''}>3-20 chars</span>
                  <span className={validations.usernameFormat ? 'text-green-600' : ''}>Alphanumeric + _</span>
                </div>
              </div>

              {/* Email Field */}
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`peer w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all placeholder-transparent ${validations.emailFormat
                    ? 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-indigo-600"
                >
                  Email Address
                </label>
              </div>

              {/* Password Field */}
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
                <label htmlFor="password" className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-400 peer-focus:-top-2.5 peer-focus:text-primary-600">
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

              {/* Confirm Password Field */}
              <div className="relative group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`peer w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-all placeholder-transparent ${validations.pwdMatch
                    ? 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                    }`}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <label htmlFor="confirmPassword" className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-indigo-600">
                  Confirm Password
                </label>
              </div>

              {/* Password Requirements Card */}
              <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 border border-gray-100">
                <p className="font-semibold mb-2">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Requirement label="Min 8 characters" met={validations.pwdLength} />
                  <Requirement label="Uppercase letter" met={validations.pwdUpper} />
                  <Requirement label="Lowercase letter" met={validations.pwdLower} />
                  <Requirement label="Number" met={validations.pwdNumber} />
                  <Requirement label="Special char (!@#...)" met={validations.pwdSpecial} />
                  <Requirement label="Passwords match" met={validations.pwdMatch} />
                </div>
              </div>

            </div>

            <div>
              <button
                type="submit"
                disabled={!isValid || loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-900 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Processing...' : 'Register Securely'}
              </button>
            </div>

            <div className="text-center text-sm">
              <span className="text-gray-500">Already a member? </span>
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-all">
                Sign in now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const Requirement = ({ label, met }: { label: string, met: boolean }) => (
  <div className={`flex items-center space-x-1.5 transition-colors duration-300 ${met ? 'text-green-600' : 'text-slate-400'}`}>
    <span>{label}</span>
  </div>
);

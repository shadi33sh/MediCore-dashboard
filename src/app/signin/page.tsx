'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import axiosInstance from '../AuthAxios';
import Loading from '../../Components/loading';
import { useAlert } from '../../Components/Alert';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('api/auth/login', formData);
      localStorage.setItem('token', response.data.token.access_token);

      const user = await axiosInstance.post('api/auth/me');
      localStorage.setItem('user', JSON.stringify(user.data));

      showAlert('success', 'Logged in successfully');
      router.push(`/${user.data.role}`);
    } catch (err : any) {
      showAlert('error', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-Primary/10 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* LEFT SIDE - FORM AREA */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-20">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-Primary/10">
              <img src="/images/Logo.png" alt="Logo" className="h-9 w-9 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Medi<span className="text-Primary">Core</span>
            </h1>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to continue to your dashboard.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-Primary/10 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-Primary/10 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-gray-900"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Welcome back</span>
              <Link href="/forgot-password" className="font-medium text-Primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full max-h-12 items-center justify-center rounded-xl bg-Primary px-4 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Loading color='#fff' /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - DECORATIVE AREA */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-Primary/20 via-indigo-200/30 to-purple-200/30 dark:from-Primary/10 dark:via-blue-900/20 dark:to-teal-900/20" />

        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 bg-Primary rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-indigo-300 dark:bg-blue-700/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-purple-300 dark:bg-teal-700/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse animation-delay-4000" />

        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <div className="text-center px-10 max-w-lg">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Medi<span className="text-Primary">Core</span>
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              The ultimate platform for doctors to manage patients, appointments, and medical records with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
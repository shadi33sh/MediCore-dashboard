'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Loading from '../../Components/loading';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../AuthAxios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('api/password/request', { email });
    } catch {
      // Ignored: To prevent email enumeration, we show success state regardless of the 422 error
    } finally {
      setIsSubmitted(true);
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

          {!isSubmitted ? (
            <>
              {/* Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('Auth.ForgotPassword.title', 'Forgot Password?')}
                </h2>
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  {t('Auth.ForgotPassword.subtitle', 'Enter your email address and we will send you a link to reset your password.')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('Auth.SignIn.email', 'Email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('Auth.SignIn.emailPlaceholder', 'you@example.com')}
                    required
                    className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-Primary/10 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full max-h-12 items-center justify-center rounded-xl bg-Primary px-4 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <Loading color='#fff' /> : t('Auth.ForgotPassword.submitButton', 'Send Reset Link')}
                </button>

                <div className="text-center mt-4">
                  <Link href="/signin" className="text-sm font-medium text-Primary hover:underline">
                    {t('Auth.ForgotPassword.backToSignIn', 'Back to Sign In')}
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-900/30">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {t('Auth.ForgotPassword.success', 'If this email exists, a confirmation link has been sent.')}
              </h2>
              <div className="mt-8">
                <Link href="/signin" className="text-sm font-medium text-Primary hover:underline">
                  {t('Auth.ForgotPassword.backToSignIn', 'Back to Sign In')}
                </Link>
              </div>
            </div>
          )}
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
              {t('Auth.ForgotPassword.recoveryTitle1', 'Password ')}<span className="text-Primary">{t('Auth.ForgotPassword.recoveryTitle2', 'Recovery')}</span>
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('Auth.ForgotPassword.recoveryDesc', 'Don\'t worry, we\'ll help you get back to managing your patients and appointments.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

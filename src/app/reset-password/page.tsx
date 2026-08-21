'use client';

import Link from 'next/link';
import React, { useState, useEffect, Suspense } from 'react';
import Loading from '../../Components/loading';
import { useAlert } from '../../Components/Alert';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../AuthAxios';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const { showAlert } = useAlert();
  const { t } = useTranslation();

  // Validate Token
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setIsValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        await axiosInstance.post('api/password/confirm', { token });
        setIsValidToken(true);
      } catch {
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      showAlert('error', t('Auth.ResetPassword.errorLength', 'Password must be at least 8 characters.'));
      return;
    }

    if (password !== confirmPassword) {
      showAlert('error', t('Auth.ResetPassword.errorMatch', 'Passwords do not match.'));
      return;
    }

    setIsResetting(true);

    try {
      await axiosInstance.post('api/password/reset', { token, password });
      showAlert('success', t('Auth.ResetPassword.success', 'Password has been reset successfully.'));
      router.push('/signin');
    } catch {
      showAlert('error', t('Auth.ResetPassword.errorToken', 'Invalid or expired token.'));
    } finally {
      setIsResetting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loading color="#3b82f6" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          {t('Auth.ResetPassword.validating', 'Validating token...')}
        </p>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="text-center py-8">
        <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/30">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          {t('Auth.ResetPassword.errorToken', 'Invalid or expired token.')}
        </h2>
        <div className="mt-8">
          <Link href="/forgot-password" className="text-sm font-medium text-Primary hover:underline">
            {t('Auth.ResetPassword.backToForgot', 'Back to Forgot Password')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('Auth.ResetPassword.title', 'Reset Password')}
        </h2>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {t('Auth.ResetPassword.subtitle', 'Enter your new password below.')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Auth.ResetPassword.newPassword', 'New Password')}
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-Primary/10 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-gray-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('Auth.ResetPassword.confirmPassword', 'Confirm Password')}
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 focus:ring-Primary/10 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:bg-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={isResetting}
          className="flex w-full max-h-12 items-center justify-center rounded-xl bg-Primary px-4 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isResetting ? <Loading color='#fff' /> : t('Auth.ResetPassword.submitButton', 'Reset Password')}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();

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

          <Suspense fallback={<div className="flex justify-center py-12"><Loading color="#3b82f6" /></div>}>
            <ResetPasswordForm />
          </Suspense>
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

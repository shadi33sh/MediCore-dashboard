'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { useAlert } from '../../Components/Alert';
import axiosInstance from '../AuthAxios';
import Loading from '../../Components/loading';

export default function VerificationPage() {
  const [formData, setFormData] = useState({ code: '' });
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Verify code after registration
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post('api/varify', formData);
      showAlert('success', 'Verification successful');
    } catch (err) {
      showAlert('error', 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br  from-white  to-Primary dark:from-gray-950 dark:to-gray-900 flex justify-center items-center dark:text-white">
          <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-Primary rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-200 dark:bg-blue-800/20  rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 dark:bg-teal-800/60 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-4000"></div>
        </div>
      <form
        onSubmit={handleVerifyCode}
        className="p-16 rounded-xl text-center md:bg-gray-200/30 md:dark:bg-gray-700/40 w-[580px] flex flex-col items-center gap-8 z-10">
        <h1 className="font-bold text-3xl">Verify Your Account</h1>
        <img className="w-[120px]" src="/images/Logo.png" alt="Logo" />

        {/* Verification Code Input */}
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6"
          placeholder="Enter 6-digit code"
          required
        />

        {/* Button */}
        <div className="w-full h-16 center">
          {!loading ? (
            <button type="submit" className="p-4 bg-Primary rounded-xl w-full flex justify-center">
              <p className="font-bold text-white">Verify Code</p>
            </button>
          ) : (
            <Loading />
          )}
        </div>

        {/* Resend Code Option */}
        <p className="text-Gray font-semibold">
          Didn't receive a code?{' '}
          <button type='button' onClick={() => axiosInstance.get('api/resendCode')} className="text-Primary underline">
            Resend Code
          </button>
        </p>
      </form>
    </div>
  );
}

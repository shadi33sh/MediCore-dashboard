'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import axiosInstance from '../AuthAxios';
import { useRouter } from 'next/navigation';
import { useAlert } from '../../Components/Alert';
import Loading from '../../Components/loading';

export default function page() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const navigator = useRouter();
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('api/auth/register', formData);
      localStorage.setItem('token', response.data.token.access_token);
      showAlert('success', 'Registration successful. Redirecting to verification...');
      navigator.push('/email-verification'); // Navigate to email verification page
    } catch (err) {
      showAlert('error', err.response?.data?.data || 'Registration failed. Please try again.');
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
        onSubmit={handleSubmit}
        className="p-16 rounded-xl text-center md:bg-gray-200/30 md:dark:bg-gray-700/40 w-[580px] flex flex-col items-center gap-8 z-10">

        <h1 className="font-bold text-3xl">
          Create <span className="text-Primary">Medi</span>Core Account
        </h1>
        <img className="w-[120px]" src="/images/Logo.png" alt="Logo" />

        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6"
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6"
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6"
          placeholder="+963XXXXXXXXX"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6"
          placeholder="Password (Min 8 characters)"
          required
        />
        <input
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6"
          placeholder="Confirm Password"
          required
        />
        <div className='w-full h-16 center'>
          { !loading ?
                  <button type="submit" className="p-4 bg-Primary rounded-xl w-full flex justify-center">
                  <p className="font-bold text-white">Sign In</p>
                </button>
                :
              <Loading/>
          }
        </div>

        <p className="text-Gray font-semibold">
          Already have an account? <Link href="/login" className="text-Primary">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

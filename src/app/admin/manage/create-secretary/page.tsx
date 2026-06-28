'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import axiosInstance from '../../../AuthAxios';
import { useAlert } from '../../../../Components/Alert';

export default function page() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const {showAlert} = useAlert()

  const handleChange = (e : any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await axiosInstance.post('api/admin/secretary', formData);
      showAlert('success' , 'Secretary account created successfully.')
    } catch (err : any) {showAlert('error' , err.response?.data?.msg)}

  };

  return (
    <div className=" mt-20 flex justify-center items-center dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="p-16 rounded-xl bg-gray-200 dark:bg-gray-700/40 w-[780px] flex flex-col items-center gap-8"
      >
        <h1 className="font-bold text-3xl">
          Register as a Secretary <span className="text-Primary">Medi</span>Core
        </h1>
        <img className="w-[120px]" src="/images/Logo.png" alt="Logo" />

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"
          placeholder="+963XXXXXXXXX"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"
          placeholder="Password (Min 8 characters)"
          required
        />
        <input
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 border-Primary"
          placeholder="Confirm Password"
          required
        />

        <button type="submit" className="p-4 bg-Primary rounded-xl w-full flex justify-center">
          <p className="font-bold text-white">Sign Up</p>
        </button>

        <p className="text-Gray font-semibold">
          Already registered? <Link href="/login" className="text-Primary">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

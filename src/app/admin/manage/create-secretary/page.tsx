'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import axiosInstance from '../../../AuthAxios';
import { useAlert } from '../../../../Components/Alert';
import FormShell, { Field, FieldRow, SubmitBtn } from '../FormShell';
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi';
import { IoDocumentTextOutline } from 'react-icons/io5';

export default function page() {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleChange = (e: any) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axiosInstance.post('api/admin/secretary', formData);
      showAlert('success', 'Secretary account created successfully.');
    } catch (err: any) {
      showAlert('error', err.response?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell
      title="Register New Secretary"
      subtitle="Create a secretary account in MediCore"
      icon={<IoDocumentTextOutline size={22} />}
      accentColor="from-emerald-500 to-teal-600"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldRow>
          <Field label="First Name" icon={<FiUser size={14} />} type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First name" required />
          <Field label="Last Name"  icon={<FiUser size={14} />} type="text" name="last_name"  value={formData.last_name}  onChange={handleChange} placeholder="Last name"  required />
        </FieldRow>

        <Field label="Email" icon={<FiMail size={14} />}  type="email" name="email" value={formData.email} onChange={handleChange} placeholder="secretary@hospital.com" required />
        <Field label="Phone" icon={<FiPhone size={14} />} type="text"  name="phone" value={formData.phone} onChange={handleChange} placeholder="+963XXXXXXXXX" required />

        <FieldRow>
          <Field label="Password"         icon={<FiLock size={14} />} type="password" name="password"              value={formData.password}              onChange={handleChange} placeholder="Min 8 characters" required />
          <Field label="Confirm Password" icon={<FiLock size={14} />} type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Repeat password" required />
        </FieldRow>

        <SubmitBtn label="Create Secretary" loading={loading} accentColor="from-emerald-500 to-teal-600" />

        <p className="text-center text-sm text-gray-400">
          Already registered?{' '}
          <Link href="/login" className="text-Primary font-semibold hover:underline">Sign in</Link>
        </p>
      </form>
    </FormShell>
  );
}

'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../AuthAxios';
import Loading from '../../../../Components/loading';
import LoadingScreen from '../../../../Components/loadingScreen';
import { useAlert } from '../../../../Components/Alert';
import FormShell, { Field, SelectField, FieldRow, SubmitBtn } from '../FormShell';
import { FiUser, FiMail, FiPhone, FiLock, FiFileText, FiDollarSign, FiAward } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';



export default function Page() {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', bio: '', department: '', email: '', phone: '', subscription: '', price_of_examination: '', password: '', password_confirmation: '' });
  const { showAlert } = useAlert();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axiosInstance.get('api/department');
        setDepartments(response.data.data.departments);
      } catch (err: any) {
        console.error('Error fetching departments:', err);
      }
    }
    fetchDepartments();
  }, []);

  const handleChange = (e: any) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));


  const handleSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      await axiosInstance.post('api/admin/doctor', formData);
      showAlert('success', 'Doctor registration successful');
    } catch (err: any) {
      showAlert('error', err.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  if (!departments) return <LoadingScreen />;

  return (
    <FormShell
      title="Register New Doctor"
      subtitle="Add a doctor to the MediCore system"
      icon={<FiUser size={22} />}
      accentColor="from-Primary to-Primary/80"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldRow>
          <Field label="First Name" icon={<FiUser size={14} />} type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First name" />
          <Field label="Last Name" icon={<FiUser size={14} />} type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last name" />
        </FieldRow>

        <SelectField label="Department" icon={<MdOutlineLocalHospital size={15} />} name="department" value={formData.department} onChange={handleChange}>
          <option value="" disabled>Select department</option>
          {departments?.map((dept: any) => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </SelectField>

        <Field label="Short Bio" icon={<FiFileText size={14} />} type="text" name="bio" value={formData.bio} onChange={handleChange} placeholder="Brief professional summary" />
        <Field label="Email" icon={<FiMail size={14} />} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@hospital.com" />
        <Field label="Phone" icon={<FiPhone size={14} />} type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+963XXXXXXXXX" />

        <FieldRow>
          <Field label="Subscription Fee" icon={<FiAward size={14} />} type="number" name="subscription" value={formData.subscription} onChange={handleChange} placeholder="e.g. 50000" />
          <Field label="Exam Price" icon={<FiDollarSign size={14} />} type="number" name="price_of_examination" value={formData.price_of_examination} onChange={handleChange} placeholder="e.g. 15000" />
        </FieldRow>

        <FieldRow>
          <Field label="Password" icon={<FiLock size={14} />} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" />
          <Field label="Confirm Password" icon={<FiLock size={14} />} type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Repeat password" />
        </FieldRow>

        <SubmitBtn label="Register Doctor" loading={loading} accentColor="from-violet-500 to-purple-600" loadingComponent={<Loading />} />

        <p className="text-center text-sm text-gray-400">
          Already registered?{' '}
          <Link href="/login" className="text-Primary font-semibold hover:underline">Sign in</Link>
        </p>
      </form>
    </FormShell>
  );
}

'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axiosInstance from '../../../../AuthAxios';

export default function page() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    department: '',
    email: '',
    phone: '',
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const doctorId = useParams().id
  // Fetch doctor details and department list
  useEffect(() => {
    async function fetchDoctorData() {
      try {
        const response = await  axiosInstance.get(`api/admin/doctor/${doctorId}`);
        setFormData(response.data.data);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
      }
    }

    async function fetchDepartments() {
      try {
        const response = await axiosInstance.get('api/department');
        setDepartments(response.data.data.departments);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    }

    fetchDoctorData();
    fetchDepartments();
  }, [doctorId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axiosInstance.put(`api/admin/doctor/${doctorId}`, formData);
      console.log('Doctor updated successfully:', response.data);
      setSuccess('Doctor details updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed. Please try again.');
      console.log('Update error:', err);
    }
  };

  return (
    <div className="w-screen mt-20 flex justify-center items-center dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="p-16 rounded-xl bg-gray-200 dark:bg-gray-700/40 w-[780px] flex flex-col items-center gap-8"
      >
        <h1 className="font-bold text-3xl">Update Doctor Information</h1>
        <img className="w-[120px]" src="/images/Logo.png" alt="Logo" />

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
        <input type="text" name="bio" value={formData.bio} onChange={handleChange} required />

        {/* Department Dropdown */}
        <select name="department" value={formData.department} onChange={handleChange} required>
          <option value="" disabled>Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>

        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

        <button type="submit" className="p-4 bg-Primary rounded-xl w-full flex justify-center">
          <p className="font-bold text-white">Update Doctor</p>
        </button>
      </form>
    </div>
  );
}

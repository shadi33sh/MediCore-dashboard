'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from './Alert';
import axiosInstance from '../app/AuthAxios';

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    patient_id: '',  // If patient exists, otherwise null
    birth_date: '',
    first_name: '',
    last_name: '',
    phone: '',
    gender: '',
    age: '',
    blood_type: '',
    chronic_diseases: '',
    medication_allergies: '',
    permanent_medications: '',
    previous_surgeries: '',
    previous_illnesses: '',
    medical_analysis: '',
    appointment_date: '',
    doctor_id: ''
  });

  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('YOUR_BACKEND_URL/reserve', formData);

      if (response.data.status === 201) {
        showAlert('success', 'Appointment added successfully!');
        setFormData({  // Reset form after success
          patient_id: '',
          birth_date: '',
          first_name: '',
          last_name: '',
          phone: '',
          gender: '',
          age: '',
          blood_type: '',
          chronic_diseases: '',
          medication_allergies: '',
          permanent_medications: '',
          previous_surgeries: '',
          previous_illnesses: '',
          medical_analysis: '',
          appointment_date: '',
          doctor_id: ''
        });
      } else {
        showAlert('error', response.data.message || 'Failed to create appointment.');
      }
    } catch (err : any) {
      showAlert('error', 'Server error. Please try again.');
    }

    setLoading(false);
  };

  return (
      
      <form onSubmit={handleSubmit} className="space-y-4 tailwind-form">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Reserve an Appointment</h2>
        {/* First Name & Last Name */}
        <div className="flex gap-3">
          <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
          <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
        </div>

        {/* Phone & Birth Date */}
        <div className="flex gap-3">
          <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          <input type="date" name="birth_date" placeholder="Birth Date" value={formData.birth_date} onChange={handleChange} />
        </div>

        {/* Gender & Age */}
        <div className="flex gap-3">
          <select name="gender" value={formData.gender} onChange={handleChange} >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
        </div>

        {/* Blood Type */}
        <select name="blood_type" value={formData.blood_type} onChange={handleChange} >
          <option value="">Select Blood Type</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Medical Details */}
        <input name="chronic_diseases" placeholder="Chronic Diseases" value={formData.chronic_diseases} onChange={handleChange} />
        <input name="medication_allergies" placeholder="Medication Allergies" value={formData.medication_allergies} onChange={handleChange} />
        <input name="permanent_medications" placeholder="Permanent Medications" value={formData.permanent_medications} onChange={handleChange} />
        <input name="previous_surgeries" placeholder="Previous Surgeries" value={formData.previous_surgeries} onChange={handleChange} />
        <input name="previous_illnesses" placeholder="Previous Illnesses" value={formData.previous_illnesses} onChange={handleChange} />
        <input name="medical_analysis" placeholder="Medical Analysis" value={formData.medical_analysis} onChange={handleChange} />

        {/* Appointment Date & Doctor Selection */}
        <div className="flex gap-3">
          <input type="datetime-local" name="appointment_date" value={formData.appointment_date} onChange={handleChange} />
          <select name="doctor_id" value={formData.doctor_id} onChange={handleChange} >
            <option value="">Select Doctor</option>
            {/* This should be dynamically fetched from the backend */}
            <option value="1">Dr. Smith</option>
            <option value="2">Dr. Johnson</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full p-2 rounded-md bg-teal-500 text-white">
          {loading ? "Processing..." : "Submit Appointment"}
        </button>
      </form>
  );
}

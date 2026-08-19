'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axiosInstance from '../../../../AuthAxios';
import { useAlert } from '../../../../../Components/Alert';
import Loading from '../../../../../Components/loading';
import FormShell, { Field, SelectField, FieldRow, SubmitBtn } from '../../FormShell';
import { FiUser, FiMail, FiPhone, FiFileText, FiDollarSign, FiAward } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

export default function page() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    department: '',
    email: '',
    phone: '',
    subscription: '',
    price_of_examination: '',
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const doctorId = useParams().id;
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchDoctorData() {
      try {
        const response = await axiosInstance.get(`api/admin/doctor/${doctorId}`);
        setFormData(response.data.data);
      } catch (err: any) {
        console.error('Error fetching doctor details:', err);
      }
    }

    async function fetchDepartments() {
      try {
        const response = await axiosInstance.get('api/department');
        setDepartments(response.data.data.departments);
      } catch (err: any) {
        console.error('Error fetching departments:', err);
      }
    }

    fetchDoctorData();
    fetchDepartments();
  }, [doctorId]);

  const handleChange = (e: any) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axiosInstance.put(`api/admin/doctor/${doctorId}`, formData);
      showAlert('success', t('Admin.Modals.UpdateDoctor.success', 'Doctor details updated successfully.'));
      setSuccess(t('Admin.Modals.UpdateDoctor.success', 'Doctor details updated successfully.'));
    } catch (err: any) {
      const msg = err.response?.data?.message || t('Admin.Modals.UpdateDoctor.error', 'Update failed. Please try again.');
      setError(msg);
      showAlert('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell
      title={t('Admin.Modals.UpdateDoctor.title', 'Update Doctor')}
      subtitle={t('Admin.Modals.UpdateDoctor.subtitle', 'Edit doctor information in MediCore')}
      icon={<FiUser size={22} />}
      accentColor="from-Primary to-Primary/80"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FieldRow>
          <Field label={t('Admin.Modals.Doctor.firstName', 'First Name')} icon={<FiUser size={14} />} type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder={t('Admin.Modals.Doctor.firstName', 'First name')} required />
          <Field label={t('Admin.Modals.Doctor.lastName', 'Last Name')}  icon={<FiUser size={14} />} type="text" name="last_name"  value={formData.last_name}  onChange={handleChange} placeholder={t('Admin.Modals.Doctor.lastName', 'Last name')}  required />
        </FieldRow>

        <SelectField label={t('Admin.Modals.Doctor.department', 'Department')} icon={<MdOutlineLocalHospital size={15} />} name="department" value={formData.department} onChange={handleChange} required>
          <option value="" disabled>{t('Admin.Modals.Doctor.selectDepartment', 'Select department')}</option>
          {departments.map((dept: any) => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </SelectField>

        <Field label={t('Admin.Modals.Doctor.bio', 'Short Bio')} icon={<FiFileText size={14} />} type="text" name="bio"   value={formData.bio}   onChange={handleChange} placeholder={t('Admin.Modals.Doctor.bioPlaceholder', 'Brief professional summary')} required />
        <Field label={t('Admin.Modals.Doctor.email', 'Email')}     icon={<FiMail size={14} />}    type="email" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@hospital.com" required />
        <Field label={t('Admin.Modals.Doctor.phone', 'Phone')}     icon={<FiPhone size={14} />}   type="text" name="phone"  value={formData.phone} onChange={handleChange} placeholder="+963XXXXXXXXX" required />

        <FieldRow>
          <Field label={t('Admin.Modals.Doctor.subscription', 'Subscription Fee')} icon={<FiAward size={14} />}       type="number" name="subscription"        value={formData.subscription}        onChange={handleChange} placeholder="e.g. 50000" />
          <Field label={t('Admin.Modals.Doctor.examPrice', 'Exam Price')}        icon={<FiDollarSign size={14} />} type="number" name="price_of_examination" value={formData.price_of_examination} onChange={handleChange} placeholder="e.g. 15000" />
        </FieldRow>

        <SubmitBtn label={t('Admin.Modals.UpdateDoctor.submitBtn', 'Update Doctor')} loading={loading} loadingComponent={<Loading />} />
      </form>
    </FormShell>
  );
}

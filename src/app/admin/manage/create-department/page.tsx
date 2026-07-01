'use client';
import React, { FormEvent, FormEventHandler, useState } from 'react';
import axiosInstance from '../../../AuthAxios';
import Loading from '../../../../Components/loading';
import { useAlert } from '../../../../Components/Alert';
import FormShell, { Field, TextareaField, SubmitBtn } from '../FormShell';
import { FiImage, FiFileText, FiTag } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';

export default function page() {
  const [formData, setFormData] = useState({ name: '', description: '', image: null });
  const [file, setfile] = useState<any>();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const departmentsData = [
    { name: 'Cardiology', description: 'Heart-related conditions and treatments.', image: file },
  ];

  const submitDepartments = async (departments: any) => {
    for (const department of departments) {
      try {
        const response = await axiosInstance.post('api/admin/department', department, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log(`✔ Successfully added: ${department.name.en}`);
      } catch (err: any) {
        console.error(`❌ Failed to add: ${department.name.en}`, err.response?.data);
      }
    }
  };

  const handleSubmit: FormEventHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.image) formDataToSend.append('image', formData.image);

      await axiosInstance.post('api/admin/department', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData({ name: '', description: '', image: null });
      setPreviewImage(null);
      showAlert('success', 'Department added successfully');
    } catch (err: any) {
      showAlert('error', err?.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    if (e.target.type === 'file' && e.target.files[0]) {
      setfile(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  return (
    <FormShell
      title="Add New Department"
      subtitle="Create a new medical department in MediCore"
      icon={<MdOutlineLocalHospital size={24} />}
      accentColor="from-cyan-500 to-teal-600"
    >
      <form onSubmit={(e) => { handleSubmit(e); submitDepartments(departmentsData); }} className="space-y-5">
        <Field
          label="Department Name"
          icon={<FiTag size={15} />}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Cardiology"
        />

        <TextareaField
          label="Description"
          icon={<FiFileText size={15} />}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of the department…"
        />

        {/* Image upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Department Image
          </label>
          <label
            className="w-full h-40 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 cursor-pointer overflow-hidden transition hover:border-Primary group bg-gray-50 dark:bg-gray-800 bg-cover bg-center"
            style={{ backgroundImage: previewImage ? `url(${previewImage})` : 'none' }}
          >
            <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
            {!previewImage && (
              <>
                <FiImage size={28} className="text-gray-300 dark:text-gray-600 group-hover:text-Primary transition mb-2" />
                <p className="text-sm text-gray-400 group-hover:text-Primary transition">Click to upload image</p>
              </>
            )}
          </label>
        </div>

        <SubmitBtn label="Add Department" loading={loading} loadingComponent={<Loading />} />
      </form>
    </FormShell>
  );
}

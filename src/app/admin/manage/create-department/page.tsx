'use client';
import React, { FormEvent, FormEventHandler, useState } from 'react';
import axiosInstance from '../../../AuthAxios';
import LoadingScreen from '../../../../Components/loadingScreen';
import Loading from '../../../../Components/loading';
import { useAlert } from '../../../../Components/Alert';

export default function page() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null, // New image field
  });
  const [file, setfile] = useState()
  
  const { showAlert } = useAlert();
  
  
  const departmentsData = [
    { name: 'Cardiology', description: 'Heart-related conditions and treatments.' , image  : file },

  ];
  const submitDepartments = async (departments : any) => {
    for (const department of departments) {
      try {
        const response = await axiosInstance.post('api/admin/department', department ,{
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log(`✔ Successfully added: ${department.name.en}`);
      } catch (err : any) {
        console.error(`❌ Failed to add: ${department.name.en}`, err.response?.data);
      }
    }
  };

  const handleSubmit  : FormEventHandler  = async (e : FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axiosInstance.post('api/admin/department', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData({ name: '', description: '', image: null }); // Clear form after success
      showAlert('success', 'Department added successfully');
    } catch (err : any) {
      showAlert('error',  err?.response?.data?.msg || 'Something went wrong');
      console.log('Error:', err);
    }
  };
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleChange = (e : any) => {
    if (e.target.type === 'file' && e.target.files[0]) {
       setfile(e.target.files[0])

      const imageUrl = URL.createObjectURL(e.target.files[0]); // Generate preview URL
      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };
  
  return (
    <div className="flex justify-center items-center dark:text-white">
      <div className="w-screen h-screen center fixed top-0 left-0 dark:bg-black bg-White bg-opacity-45 z-10">
        <form onSubmit={handleSubmit} className="tailwind-form">
          <h1 className="font-bold text-3xl">
            Add New Department <span className="text-Primary">Medi</span>Core
          </h1>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Department Name"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="dark:bg-black bg-gray-100 p-4 w-full rounded-xl pl-6 resize-none"
            placeholder="Department Description"
          />

          {/* Image Upload */}
          <label className="w-full h-40 flex items-center justify-center rounded-xl bg-cover bg-center cursor-pointer overflow-hidden"
            style={{ backgroundImage: previewImage ? `url(${previewImage})` : 'none', backgroundColor: previewImage ? 'transparent' : '#f3f4f6' }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
            {!previewImage && (
              <p className="text-gray-400">Click to upload department image</p>
            )}
          </label>


          <button type="submit"
           onClick={()=> submitDepartments(departmentsData) }
          className="p-4 bg-Primary rounded-xl w-full flex justify-center">
            <p className="font-bold text-white">Add Department</p>
          </button>
        </form>
      </div>
    </div>
  );
}

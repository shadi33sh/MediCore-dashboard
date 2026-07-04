import React, { FormEvent, FormEventHandler, useState } from 'react';
import FormShell, { Field, TextareaField, SubmitBtn } from './FormShell';
import { FiImage, FiFileText, FiTag, FiX } from 'react-icons/fi';
import { MdOutlineLocalHospital } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlert } from '../../../Components/Alert';
import Loading from '../../../Components/loading';
import axiosInstance from '../../AuthAxios';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateDepartmentModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({ name: '', description: '', image: null as File | null });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

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
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      showAlert('error', err?.response?.data?.msg || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    if (e.target.type === 'file' && e.target.files && e.target.files[0]) {
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };



  return (
    <AnimatePresence>
      {isOpen &&
        <motion.div
          className="fixed inset-0  -top-6  flex items-center justify-center bg-black/70 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-[95vw] max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl relative"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white z-10">
              <FiX size={20} />
            </button>

            <FormShell
              title="Add New Department"
              subtitle="Create a new medical department in MediCore"
              icon={<MdOutlineLocalHospital size={24} />}
              accentColor="from-cyan-500 to-teal-600"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
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
          </motion.div>
        </motion.div>
      }

    </AnimatePresence>
  );
}

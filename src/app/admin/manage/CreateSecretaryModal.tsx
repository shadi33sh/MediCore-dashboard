import React, { useState } from 'react';
import FormShell, { Field, FieldRow, SubmitBtn } from './FormShell';
import { FiUser, FiMail, FiPhone, FiLock, FiX } from 'react-icons/fi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlert } from '../../../Components/Alert';
import axiosInstance from '../../AuthAxios';
import Loading from '../../../Components/loading';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateSecretaryModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleChange = (e: any) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('api/admin/secretary', formData);
      showAlert('success', 'Secretary account created successfully.');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      showAlert('error', err.response?.data?.msg || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };



  return (
    <AnimatePresence>
      {isOpen &&
        <motion.div
          className="fixed inset-0 -top-6 flex items-center justify-center bg-black/70 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-[95vw] max-w-2xl   relative"
            initial={{ opacity: 0, scale: 1, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            onClick={e => e.stopPropagation()}
          >
            {/* <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white z-10">
              <FiX size={20} />
            </button> */}

            <FormShell
              title="Register New Secretary"
              subtitle="Create a secretary account in MediCore"
              icon={<IoDocumentTextOutline size={22} />}
              accentColor="from-emerald-500 to-teal-600"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldRow>
                  <Field label="First Name" icon={<FiUser size={14} />} type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First name" required />
                  <Field label="Last Name" icon={<FiUser size={14} />} type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last name" required />
                </FieldRow>

                <Field label="Email" icon={<FiMail size={14} />} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="secretary@hospital.com" required />
                <Field label="Phone" icon={<FiPhone size={14} />} type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+963XXXXXXXXX" required />

                <FieldRow>
                  <Field label="Password" icon={<FiLock size={14} />} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 8 characters" required />
                  <Field label="Confirm Password" icon={<FiLock size={14} />} type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder="Repeat password" required />
                </FieldRow>

                <SubmitBtn label="Create Secretary" loading={loading} accentColor="from-emerald-500 to-teal-600" loadingComponent={<Loading />} />
              </form>
            </FormShell>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
}

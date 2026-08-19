import React, { useState } from 'react';
import FormShell, { Field, FieldRow, SubmitBtn } from './FormShell';
import { FiUser, FiMail, FiPhone, FiLock, FiX } from 'react-icons/fi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlert } from '../../../Components/Alert';
import axiosInstance from '../../AuthAxios';
import Loading from '../../../Components/loading';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateSecretaryModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  const handleChange = (e: any) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('api/admin/secretary', formData);
      showAlert('success', t('Admin.Modals.secretarySuccess', 'Secretary account created successfully.'));
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      showAlert('error', err.response?.data?.msg || t('Admin.Modals.error', 'Error occurred'));
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
              title={t('Admin.Modals.Secretary.title', 'Register New Secretary')}
              subtitle={t('Admin.Modals.Secretary.subtitle', 'Create a secretary account in MediCore')}
              icon={<IoDocumentTextOutline size={22} />}
              accentColor="from-emerald-500 to-teal-600"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <FieldRow>
                  <Field label={t('Admin.Modals.Secretary.firstName', 'First Name')} icon={<FiUser size={14} />} type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder={t('Admin.Modals.Secretary.firstName', 'First name')} required />
                  <Field label={t('Admin.Modals.Secretary.lastName', 'Last Name')} icon={<FiUser size={14} />} type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder={t('Admin.Modals.Secretary.lastName', 'Last name')} required />
                </FieldRow>

                <Field label={t('Admin.Modals.Secretary.email', 'Email')} icon={<FiMail size={14} />} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="secretary@hospital.com" required />
                <Field label={t('Admin.Modals.Secretary.phone', 'Phone')} icon={<FiPhone size={14} />} type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+963XXXXXXXXX" required />

                <FieldRow>
                  <Field label={t('Admin.Modals.Secretary.password', 'Password')} icon={<FiLock size={14} />} type="password" name="password" value={formData.password} onChange={handleChange} placeholder={t('Admin.Modals.Secretary.password', 'Password')} required />
                  <Field label={t('Admin.Modals.Secretary.confirmPassword', 'Confirm Password')} icon={<FiLock size={14} />} type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} placeholder={t('Admin.Modals.Secretary.confirmPassword', 'Confirm Password')} required />
                </FieldRow>

                <SubmitBtn label={t('Admin.Modals.Secretary.submitBtn', 'Create Secretary')} loading={loading} accentColor="from-emerald-500 to-teal-600" loadingComponent={<Loading />} />
              </form>
            </FormShell>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>
  );
}

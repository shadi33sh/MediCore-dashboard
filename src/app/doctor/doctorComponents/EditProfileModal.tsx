'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaCamera, FaSpinner } from 'react-icons/fa'
import axiosInstance from '../../AuthAxios'
import { useTranslation } from 'react-i18next'
import { useAlert } from '../../../Components/Alert'
interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    user: any
    onUpdate: (user: any) => void
}
export default function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
    const { t } = useTranslation()
    const [firstName, setFirstName] = useState(user?.first_name || '')
    const [lastName, setLastName] = useState(user?.last_name || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    // Sync state if user changes
    const { showAlert } = useAlert()
    React.useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '')
            setLastName(user.last_name || '')
            setPhone(user.phone || '')
            setPassword('')
            setPasswordConfirm('')
            setImagePreview(null)
            setImageFile(null)
        }
    }, [user, isOpen])
    if (!isOpen) return null
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
            await uploadPhoto(file)
        }
    }
    const uploadPhoto = async (file: File) => {
        try {
            const formData = new FormData()
            formData.append('image', file)
            const res = await axiosInstance.post('api/imageProfileUpload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            let avatarUrl = res.data?.data || res.data?.url || res.data?.img_path || ''

            // Prepend API URL if it's a relative path
            if (avatarUrl && !avatarUrl.startsWith('http')) {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/'
                avatarUrl = `${baseUrl}${avatarUrl}`.replace(/([^:]\/)\/+/g, "$1") // clean double slashes
            }

            if (avatarUrl) {
                const updatedUser = { ...user, img_path: avatarUrl, avatar: avatarUrl }
                localStorage.setItem('user', JSON.stringify(updatedUser))
                onUpdate(updatedUser)
                showAlert('success', t('Doctor.Profile.PhotoUpdated', 'Photo updated successfully'))
            }
        } catch (err: any) {
            console.log(err?.response?.data?.message)
            showAlert('error', err?.response?.data?.message || 'Failed to upload photo')
        }
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== passwordConfirm) {
            showAlert('error', t('Doctor.Profile.PasswordMismatch', 'Passwords do not match'))
            return
        }
        setLoading(true)
        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                email: user?.email || '',

            }

            await axiosInstance.put('api/updateProfile', payload)
            const updatedUser = { ...user, ...payload }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            onUpdate(updatedUser)
            onClose()
        } catch (err: any) {
            console.log(err?.response?.data?.message)
            showAlert('error', err?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {t('Doctor.Profile.EditProfile', 'Edit Profile')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>
                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative w-24 h-24 rounded-full bg-Primary/10 border-2 border-Primary/30 flex items-center justify-center text-Primary overflow-hidden mb-2">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : user?.img_path ? (
                                <img src={user.img_path} alt="Current" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold">{user?.first_name?.[0] || ''}{user?.last_name?.[0] || ''}</span>
                            )}

                            <label className="absolute inset-0 bg-black/50 cursor-pointer flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <FaCamera className="text-white mb-1" size={20} />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">{t('Doctor.Profile.ClickToChange', 'Click photo to change')}</p>
                    </div>
                    <form onSubmit={handleSubmit} id="edit-profile-form" className="space-y-4">

                        {/* Avatar Upload */}
                        {/* Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('Doctor.Profile.Email', 'Email')}
                                </label>
                                <input
                                    type="email"
                                    readOnly
                                    value={user?.email || ''}
                                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('Doctor.Profile.FirstName', 'First Name')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-Primary text-gray-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('Doctor.Profile.LastName', 'Last Name')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-Primary text-gray-800 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('Doctor.Profile.Phone', 'Phone')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-Primary text-gray-800 dark:text-white"
                                />
                            </div>


                        </div>
                    </form>
                </div>
                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        disabled={loading}
                    >
                        {t('Common.Cancel', 'Cancel')}
                    </button>
                    <button
                        type="submit"
                        form="edit-profile-form"
                        disabled={loading}
                        className="px-6 py-2 rounded-xl bg-Primary text-white hover:bg-Primary/90 transition flex items-center gap-2 font-medium shadow-lg shadow-Primary/30"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : null}
                        {t('Common.Save', 'Save Changes')}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}


'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '../../doctorComponents/DocDashboardLayout'
import axiosInstance from '../../../AuthAxios'
import { useAlert } from '../../../../Components/Alert'
import Loading from '../../../../Components/loading'
import { motion } from 'framer-motion'
import {
  FiUser, FiFileText, FiActivity, FiArrowLeft, FiCheck, FiInfo,
  FiFilePlus, FiHeart, FiAlertCircle, FiDroplet, FiStar
} from 'react-icons/fi'

interface PatientDetails {
  name: string
  phone: string
  age: number
  gender: string
  blood_type: string
  honest_score: number
  chronic_diseases: string | null
  medication_allergies: string | null
  permanent_medications: string | null
}

export default function PatientPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { showAlert } = useAlert()
  const patientId = params.id

  const [loadingPatient, setLoadingPatient] = useState(true)
  const [patient, setPatient] = useState<PatientDetails | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    diagnoseis: '',
    diagnoseis_type: false,
    medicine: '',
    notes: '',
    status: 'Stable',
  })

  // Fetch patient details by searching the appointments list
  useEffect(() => {
    async function fetchPatientDetails() {
      try {
        const response = await axiosInstance.get('/api/getApointments')
        if (response.data.status) {
          const appointments = response.data.data.appointments || []
          const found = appointments.find((a: any) => String(a.patient_id) === String(patientId))

          if (found) {
            setPatient({
              name: found.basic_info.patient_name,
              phone: found.basic_info.patient_phone,
              age: found.patient_info.age,
              gender: found.patient_info.gender,
              blood_type: found.patient_info.blood_type,
              honest_score: found.patient_info.honest_score,
              chronic_diseases: found.patient_info.chronic_diseases,
              medication_allergies: found.patient_info.medication_allergies,
              permanent_medications: found.patient_info.permanent_medications,
            })
          } else {
            // Fallback mock details if patient not found in recent appointments
            setPatient({
              name: `Patient #${patientId}`,
              phone: 'N/A',
              age: 0,
              gender: 'N/A',
              blood_type: 'N/A',
              honest_score: 100,
              chronic_diseases: null,
              medication_allergies: null,
              permanent_medications: null,
            })
          }
        }
      } catch (err) {
        console.error('Failed to fetch appointments:', err)
      } finally {
        setLoadingPatient(false)
      }
    }

    if (patientId) {
      fetchPatientDetails()
    }
  }, [patientId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Trying the standard postPreview endpoint
      const response = await axiosInstance.post(`api/postPreview/${patientId}`, formData)

      if (response.data) {
        showAlert('success', 'Medical report added successfully!')
        router.push('/doctor')
      }
    } catch (err: any) {
      showAlert('error', err?.response?.data?.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout title="New Patient Checkup">
      <div className=" space-y-6 pb-12">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-Primary transition-colors"
        >
          <FiArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Loading patient state */}
        {loadingPatient ? (
          <div className="flex justify-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Loading size={32} />
          </div>
        ) : (
          patient && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-Primary/5 to-teal-500/5 dark:from-Primary/10 dark:to-teal-500/10 rounded-2xl p-6 border border-Primary/10 dark:border-Primary/20 relative overflow-hidden"
            >
              <div className="absolute right-6 top-6 opacity-10">
                <FiHeart size={80} className="text-Primary" />
              </div>

              <h2 className="text-xs font-bold uppercase tracking-widest text-Primary mb-4">Patient Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <FiUser className="text-Primary" size={14} />
                    {patient.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Age & Gender</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize">
                    {patient.age} yrs • {patient.gender}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Blood Type</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <FiDroplet className="text-rose-500" size={14} />
                    {patient.blood_type}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Trust Score</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
                    <FiStar className="text-amber-500" size={14} />
                    {patient.honest_score}%
                  </p>
                </div>
              </div>

              {(patient.chronic_diseases || patient.medication_allergies || patient.permanent_medications) && (
                <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {patient.chronic_diseases && (
                    <div>
                      <p className="text-xs text-rose-500 font-semibold mb-0.5">Chronic Diseases</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{patient.chronic_diseases}</p>
                    </div>
                  )}
                  {patient.medication_allergies && (
                    <div>
                      <p className="text-xs text-amber-500 font-semibold mb-0.5">Medication Allergies</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{patient.medication_allergies}</p>
                    </div>
                  )}
                  {patient.permanent_medications && (
                    <div>
                      <p className="text-xs text-blue-500 font-semibold mb-0.5">Permanent Medications</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{patient.permanent_medications}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )
        )}


        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Diagnosis Type
              </label>
              <div className="relative">
                <select
                  name="diagnoseis_type"
                  value={formData.diagnoseis_type.toString()}
                  onChange={handleChange}
                  className="w-full appearance-none px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all"
                >
                  <option value="1">Completed</option>
                  <option value="0">Not Completed</option>
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Patient Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full appearance-none px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all"
                >
                  <option value="Stable">Stable</option>
                  <option value="Unstable">Unstable</option>

                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Diagnosis details */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <FiInfo size={14} className="text-Primary" />
              Diagnosis Details
            </label>
            <textarea
              name="diagnoseis"
              value={formData.diagnoseis}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe your findings, primary complaints, and diagnosis..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all resize-none"
            />
          </div>

          {/* Prescribed Medicine */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <FiActivity size={14} className="text-Primary" />
              Prescribed Medicine
            </label>
            <textarea
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              required
              rows={3}
              placeholder="List medications, dosage, and duration..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all resize-none"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <FiFileText size={14} className="text-Primary" />
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Any additional observations or recommendations..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2">
            {submitting ? (
              <div className="flex justify-center py-2">
                <Loading size={28} />
              </div>
            ) : (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className=" px-10 py-3.5 rounded-2xl bg-gradient-to-r from-Primary to-Primary/80 text-white font-bold text-sm shadow-lg shadow-Primary/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <FiCheck size={16} />
                Submit Checkup Report
              </motion.button>
            )}
          </div>
        </form>

        {/* Preview report form */}
        {/* <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-Primary to-teal-500 px-6 py-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <FiFilePlus size={18} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Write Check-up Report</h3>
              <p className="text-xs text-white/80">Add diagnosis, prescription details and notes</p>
            </div>
          </div>


        </motion.div> */}
      </div>
    </DashboardLayout>
  )
}

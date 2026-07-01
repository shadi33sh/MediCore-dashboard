'use client'
import React, { useState, useEffect } from 'react'
import DashboardLayout from '../doctorComponents/DocDashboardLayout'
import axiosInstance from '../../AuthAxios'
import { useAlert } from '../../../Components/Alert'
import Loading from '../../../Components/loading'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  FiUser, FiPhone, FiCalendar, FiClock, FiSearch,
  FiActivity, FiHeart, FiFileText, FiPlusCircle,
  FiChevronDown, FiChevronUp, FiPlus, FiGrid, FiList
} from 'react-icons/fi'
import dayjs from 'dayjs'

interface PreviewInfo {
  id: number
  diagnoseis: string
  diagnoseis_type: number | string
  medicine: string
  notes: string
  date: string
  status: string
}

interface Patient {
  id: number
  first_name: string
  last_name: string
  age: number
  gender: string
  blood_type: string
  phone: string
  chronic_diseases: string | null
  medication_allergies: string | null
  permanent_medications: string | null
  previous_surgeries: string | null
  previous_illnesses: string | null
  medical_analysis?: {
    id: number
    name: string
    result: string
    file_url?: string
  }
  preview_info?: PreviewInfo
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedPatientId, setExpandedPatientId] = useState<number | null>(null)
  const { showAlert } = useAlert()

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await axiosInstance.get('/api/getPreviedPatients')
        if (response.data.status || response.data.patients) {
          setPatients(response.data.data || [])
        }
      } catch (err: any) {
        console.error('Error fetching patients:', err)
        showAlert('error', err.response?.data?.message || 'Failed to load patients.')
      } finally {
        setLoading(false)
      }
    }
    fetchPatients()
  }, [])

  const toggleExpand = (id: number) => {
    setExpandedPatientId(prev => (prev === id ? null : id))
  }

  const filteredPatients = patients.filter(p => {
    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase()
    const search = searchTerm.toLowerCase()
    return fullName.includes(search) || (p.phone && p.phone.includes(search))
  })

  return (
    <DashboardLayout title="My Patients">
      <div className="space-y-6">

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary transition"
            />
          </div>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-full font-medium self-end sm:self-auto">
            {filteredPatients.length} patients found
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loading size={36} />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPatients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FiUser size={48} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No patient records found</p>
          </div>
        )}

        {/* Patients Grid */}
        {!loading && filteredPatients.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {filteredPatients.map((patient) => {
              const fullName = `${patient.first_name || ''} ${patient.last_name || ''}`
              const initials = `${patient.first_name?.[0] || ''}${patient.last_name?.[0] || ''}`.toUpperCase()
              const isExpanded = expandedPatientId === patient.id

              return (
                <div
                  key={patient.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-200"
                >
                  {/* Summary Card */}
                  <div
                    onClick={() => toggleExpand(patient.id)}
                    className="p-5 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-Primary/10 border border-Primary/20 flex items-center justify-center text-sm font-bold text-Primary flex-shrink-0">
                      {initials || 'PT'}
                    </div>

                    {/* Patient Core Info */}
                    <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Patient</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                          {fullName}
                        </p>
                        <p className="text-xs text-gray-400">ID #{patient.id}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Contact</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {patient.phone || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Age & Gender</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
                          {patient.age ? `${patient.age} yrs` : 'N/A'} • {patient.gender || 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Blood Type</p>
                        <p className="text-sm font-semibold text-rose-500 font-bold">
                          {patient.blood_type || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-2 self-end md:self-auto ml-auto">
                      <Link
                        href={`/doctor/preview/${patient.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 bg-Primary/10 text-Primary border border-Primary/20 hover:bg-Primary hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition"
                      >
                        <FiPlus size={14} />
                        New Checkup
                      </Link>

                      <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800"
                      >
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">

                          {/* Last Checkup Info */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                              <FiFileText className="text-Primary" size={16} />
                              <h4 className="text-sm font-bold text-gray-800 dark:text-white">Last Checkup Report</h4>
                            </div>

                            {patient.preview_info ? (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Checkup Date</p>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                      {patient.preview_info.date ? dayjs(patient.preview_info.date).format('MMM DD, YYYY') : 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
                                    <span className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                      {patient.preview_info.status || 'Stable'}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">Diagnosis</p>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 mt-1">
                                    {patient.preview_info.diagnoseis}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">Prescribed Medicine</p>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 mt-1">
                                    {patient.preview_info.medicine}
                                  </p>
                                </div>

                                {patient.preview_info.notes && (
                                  <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Doctor Notes</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 italic">
                                      "{patient.preview_info.notes}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400 italic">No checkup reports recorded yet by you.</p>
                            )}
                          </div>

                          {/* Medical Analysis & Clinical Background */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                              <FiActivity className="text-Primary" size={16} />
                              <h4 className="text-sm font-bold text-gray-800 dark:text-white">Medical Background</h4>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Chronic Diseases</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mt-0.5">
                                  {patient.chronic_diseases || 'None'}
                                </p>
                              </div>

                              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Medication Allergies</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mt-0.5">
                                  {patient.medication_allergies || 'None'}
                                </p>
                              </div>

                              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Permanent Meds</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mt-0.5">
                                  {patient.permanent_medications || 'None'}
                                </p>
                              </div>

                              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Surgeries / Illnesses</p>
                                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mt-0.5">
                                  {patient.previous_surgeries || patient.previous_illnesses || 'None'}
                                </p>
                              </div>
                            </div>

                            {/* Medical Analysis attachment */}
                            {patient.medical_analysis && (
                              <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100/30 dark:border-blue-900/30 flex items-center justify-between">
                                <div>
                                  <p className="text-[10px] text-blue-500 dark:text-blue-400 font-bold uppercase">Medical Analysis</p>
                                  <p className="text-xs font-bold text-gray-800 dark:text-white mt-0.5">
                                    {patient.medical_analysis.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Result: {patient.medical_analysis.result}
                                  </p>
                                </div>
                                {patient.medical_analysis.file_url && (
                                  <a
                                    href={patient.medical_analysis.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold text-Primary hover:underline"
                                  >
                                    View File
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              )
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

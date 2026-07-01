'use client'
import React, { useState, useEffect } from 'react'
import DashboardLayout from './doctorComponents/DocDashboardLayout'
import { motion, AnimatePresence } from 'framer-motion'
import { PusherPrivateListener } from '../pusher'
import axiosInstance from '../AuthAxios'
import dayjs from 'dayjs'
import Loading from '../../Components/loading'
import Link from 'next/link'
import {
  FiUser, FiPhone, FiCalendar, FiClock, FiChevronDown, FiChevronUp,
  FiActivity, FiAlertCircle, FiDroplet, FiFileText, FiStar,
  FiDollarSign, FiCheckCircle, FiXCircle, FiRefreshCw, FiFilePlus,
} from 'react-icons/fi'

// ─── API shape ──────────────────────────────────────────────────────────────
interface BasicInfo {
  patient_name: string
  patient_phone: string
  patient_photo: string | null
}

interface PatientInfo {
  id: number
  age: number
  gender: string
  birth_date: string
  blood_type: string
  chronic_diseases: string | null
  medication_allergies: string | null
  permanent_medications: string | null
  previous_illnesses: string | null
  previous_surgeries: string | null
  honest_score: number
}

interface Appointment {
  id: number
  patient_id: number
  doctor_id: number
  department_id: number
  apointment_date: string
  apointment_status: string   // "immediate" | "scheduled"
  status: string              // "accepted" | "pending" | "rejected"
  enter: number
  price_after_discount: number | null
  payment_id: string | null
  created_at: string
  updated_at: string
  basic_info: BasicInfo
  patient_info: PatientInfo
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  accepted: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: <FiCheckCircle size={12} /> },
  pending:  { label: 'Pending',  color: 'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400',  icon: <FiRefreshCw size={12} /> },
  rejected: { label: 'Rejected', color: 'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',    icon: <FiXCircle size={12} /> },
}

const urgencyConfig: Record<string, { label: string; color: string }> = {
  immediate: { label: 'Immediate', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  scheduled: { label: 'Scheduled', color: 'bg-sky-100  text-sky-700  dark:bg-sky-900/30  dark:text-sky-400'  },
}

function InfoPill({ label, value, icon }: { label: string; value: string | number | null; icon?: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-100 dark:border-gray-700">
      {icon && <span className="mt-0.5 text-Primary flex-shrink-0">{icon}</span>}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{value}</p>
      </div>
    </div>
  )
}

// ─── Expandable row detail panel ─────────────────────────────────────────────
function AppointmentDetail({ appt }: { appt: Appointment }) {
  const pi = appt.patient_info
  const bi = appt.basic_info
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-200 dark:border-gray-700"
    >
      {/* Patient basics */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Patient Profile</p>
        <div className="grid grid-cols-2 gap-2">
          <InfoPill icon={<FiUser size={13} />}    label="Full Name"   value={bi.patient_name} />
          <InfoPill icon={<FiPhone size={13} />}   label="Phone"       value={bi.patient_phone} />
          <InfoPill icon={<FiUser size={13} />}    label="Age"         value={`${pi.age} yrs`} />
          <InfoPill icon={<FiUser size={13} />}    label="Gender"      value={pi.gender} />
          <InfoPill icon={<FiCalendar size={13} />} label="Birth Date"  value={pi.birth_date} />
          <InfoPill icon={<FiDroplet size={13} />} label="Blood Type"  value={pi.blood_type} />
          <InfoPill icon={<FiStar size={13} />}    label="Trust Score" value={`${pi.honest_score}%`} />
          {appt.price_after_discount != null && (
            <InfoPill icon={<FiDollarSign size={13} />} label="Price" value={`$${appt.price_after_discount}`} />
          )}
        </div>
      </div>

      {/* Medical history */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Medical History</p>
        <div className="flex flex-col gap-2">
          <InfoPill icon={<FiAlertCircle size={13} />} label="Chronic Diseases"     value={pi.chronic_diseases} />
          <InfoPill icon={<FiActivity size={13} />}    label="Medication Allergies" value={pi.medication_allergies} />
          <InfoPill icon={<FiFileText size={13} />}    label="Permanent Medications" value={pi.permanent_medications} />
          <InfoPill icon={<FiFileText size={13} />}    label="Previous Illnesses"   value={pi.previous_illnesses} />
          <InfoPill icon={<FiFileText size={13} />}    label="Previous Surgeries"   value={pi.previous_surgeries} />
          {!pi.chronic_diseases && !pi.medication_allergies && !pi.permanent_medications &&
           !pi.previous_illnesses && !pi.previous_surgeries && (
            <p className="text-sm text-gray-400 italic">No significant medical history recorded.</p>
          )}
        </div>
      </div>

      {/* Action panel */}
      <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
        <Link 
          href={`/doctor/preview/${appt.patient_id}`}
          className="flex items-center gap-2 bg-gradient-to-r from-Primary to-teal-500 hover:from-Primary/95 hover:to-teal-500/95 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-Primary/10 hover:shadow-lg transition-all"
        >
          <FiFilePlus size={14} />
          Start Check-up Report
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function page() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [openRows, setOpenRows] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get('/api/getApointments')
        if (response.data.status) {
          setAppointments(response.data.data.appointments || [])
        }
      } catch {
        // silently fail — table will show empty state
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  const toggleRow = (id: number) =>
    setOpenRows(prev => ({ ...prev, [id]: !prev[id] }))

  PusherPrivateListener(19)

  // Pull doctor name from localStorage
  const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {}
  const doctorName = `${storedUser.first_name ?? ''} ${storedUser.last_name ?? ''}`.trim() || 'Doctor'

  return (
    <DashboardLayout title={`Dr. ${doctorName} · Appointments`}>
      <div className="space-y-6">

        {/* ── Summary cards ── */}
        {!loading && appointments.length > 0 && (() => {
          const accepted  = appointments.filter(a => a.status === 'accepted').length
          const pending   = appointments.filter(a => a.status === 'pending').length
          const immediate = appointments.filter(a => a.apointment_status === 'immediate').length
          return (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total',     value: appointments.length, color: 'from-Primary to-teal-400',   icon: <FiCalendar size={18} /> },
                { label: 'Accepted',  value: accepted,            color: 'from-emerald-500 to-green-400', icon: <FiCheckCircle size={18} /> },
                { label: 'Pending',   value: pending,             color: 'from-amber-500 to-yellow-400',  icon: <FiRefreshCw size={18} /> },
                { label: 'Immediate', value: immediate,           color: 'from-rose-500 to-red-400',      icon: <FiAlertCircle size={18} /> },
              ].map(card => (
                <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 text-white shadow-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold opacity-90">{card.label}</p>
                    <div className="opacity-80">{card.icon}</div>
                  </div>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>
          )
        })()}

        {/* ── Appointments table ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-8 h-8 rounded-xl bg-Primary/10 flex items-center justify-center">
              <FiCalendar className="text-Primary" size={16} />
            </div>
            <h2 className="font-bold text-gray-800 dark:text-white">Incoming Appointments</h2>
            {!loading && (
              <span className="ml-auto text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full font-medium">
                {appointments.length} total
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loading size={36} />
            </div>
          )}

          {/* Empty */}
          {!loading && appointments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <FiCalendar size={40} className="mb-3 opacity-40" />
              <p className="text-sm font-medium">No appointments scheduled</p>
            </div>
          )}

          {/* Table */}
          {!loading && appointments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/60 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <th className="px-5 py-3 text-left">Patient</th>
                    <th className="px-5 py-3 text-left">Date</th>
                    <th className="px-5 py-3 text-left">Time</th>
                    <th className="px-5 py-3 text-left">Urgency</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Entered</th>
                    <th className="px-5 py-3 text-center">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => {
                    const dt        = dayjs(appt.apointment_date)
                    const isOpen    = !!openRows[appt.id]
                    const sCfg      = statusConfig[appt.status]  ?? statusConfig['pending']
                    const uCfg      = urgencyConfig[appt.apointment_status] ?? urgencyConfig['scheduled']
                    const initials  = appt.basic_info.patient_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

                    return (
                      <React.Fragment key={appt.id}>
                        {/* Main row */}
                        <tr
                          onClick={() => toggleRow(appt.id)}
                          className={`border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors
                            ${isOpen ? 'bg-Primary/5 dark:bg-Primary/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        >
                          {/* Patient */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-Primary/10 border border-Primary/20 flex items-center justify-center text-xs font-bold text-Primary flex-shrink-0">
                                {initials}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                  {appt.basic_info.patient_name}
                                </p>
                                <p className="text-xs text-gray-400">ID #{appt.patient_id}</p>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                              <FiCalendar size={13} className="text-gray-400 flex-shrink-0" />
                              {dt.format('MMM D, YYYY')}
                            </div>
                          </td>

                          {/* Time — CLICKABLE toggle indicator */}
                          <td className="px-5 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold cursor-pointer transition-all
                              ${isOpen ? 'bg-Primary text-white shadow-md shadow-Primary/25' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-Primary/10 hover:text-Primary'}`}>
                              <FiClock size={13} />
                              {dt.format('HH:mm')}
                              {isOpen ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                            </div>
                          </td>

                          {/* Urgency */}
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${uCfg.color}`}>
                              {uCfg.label}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${sCfg.color}`}>
                              {sCfg.icon}
                              {sCfg.label}
                            </span>
                          </td>

                          {/* Entered */}
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold
                              ${appt.enter ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
                              {appt.enter ? '✓' : '–'}
                            </span>
                          </td>

                          {/* Toggle icon */}
                          <td className="px-5 py-4 text-center">
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                            >
                              <FiChevronDown size={14} />
                            </motion.div>
                          </td>
                        </tr>

                        {/* Expandable detail row */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <tr>
                              <td colSpan={7} className="p-0">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <AppointmentDetail appt={appt} />
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}

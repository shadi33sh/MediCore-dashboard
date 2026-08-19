'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiPhone, FiX, FiClock, FiUser, FiFileText } from 'react-icons/fi'
import { useAlert } from './Alert'
import { useTranslation } from 'react-i18next'

interface Schedule {
  time: string
  patientId: string
  patientName: string
  description: string
}

interface Doctor {
  id: number
  name: string
  phone: string
  section: string
  rating: number
  image: string
  description: string
  schedules: Schedule[]
}

interface DoctorModalProps {
  doctor: Doctor
  onClose: () => void
}

// Section → gradient colour map (mirrors the page)
const sectionGradients: Record<string, string> = {
  Cardiology: 'from-rose-500 to-pink-600',
  Neurology: 'from-violet-500 to-purple-600',
  Pediatrics: 'from-sky-500 to-blue-600',
  Orthopedics: 'from-amber-500 to-orange-600',
  Dermatology: 'from-fuchsia-500 to-pink-600',
  Oncology: 'from-emerald-500 to-teal-600',
  Urology: 'from-cyan-500 to-teal-600',
  Gynecology: 'from-indigo-500 to-blue-700',
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          size={14}
          className={s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}
        />
      ))}
      <span className="ml-1.5 text-sm font-bold text-amber-500">{rating.toFixed(1)}</span>
    </div>
  )
}

import axiosInstance from '../app/AuthAxios'
import Loading from './loading'

const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, onClose }) => {
  const { showAlert } = useAlert();
  const { t } = useTranslation();
  const [localSchedules, setLocalSchedules] = useState<Schedule[]>(doctor.schedules);
  const [schedulingSlot, setSchedulingSlot] = useState<string | null>(null);
  const [patientId, setPatientId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const gradient = sectionGradients[doctor.section] ?? 'from-teal-500 to-cyan-600'

  const getFormattedDate = (slotTime: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const match = slotTime.match(/(\d+):(\d+)\s(AM|PM)/i);
    if (!match) return "";
    let h = parseInt(match[1]);
    const m = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;

    const hh = String(h).padStart(2, '0');
    return `${year}-${month}-${day} ${hh}:${m}`;
  }

  const handleSchedule = async (slot: string) => {
    if (!patientId.trim()) {
      setErrorMsg(t('DoctorModal.patientIdRequired', "Patient ID is required"));
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      const formattedDate = getFormattedDate(slot);
      const payload = {
        patient_id: patientId,
        doctor_id: doctor.id,
        apointment_date: formattedDate
      };

      const res = await axiosInstance.post("api/secretary/appointment", payload);
      showAlert("success", t('DoctorModal.appointmentCreated', "Appointment created successfully!"));

      const newAppt = res.data.data.apointment;
      const patientName = newAppt.patient ? `${newAppt.patient.first_name} ${newAppt.patient.last_name}` : `Patient ${newAppt.patient_id}`;

      setLocalSchedules(prev => [
        ...prev,
        {
          id: newAppt.id,
          time: slot,
          patientId: newAppt.patient_id,
          patientName: patientName,
          description: t('DoctorModal.instantAppointment', "Instant Appointment")
        }
      ]);

      setSchedulingSlot(null);
      setPatientId("");
      // Since we don't have a callback to refetch, we instantly updated local state
    } catch (err: any) {

      showAlert("error", err.response?.data.msg || t('DoctorModal.failedToSchedule', "Failed to schedule"));

    } finally {
      setSubmitting(false);
    }
  }

  const generateTimeSlots = () => {
    const slots: string[] = []
    const start = new Date()
    start.setHours(9, 0, 0, 0)
    const end = new Date()
    end.setHours(23, 30, 0, 0)
    const now = new Date()
    while (start < end) {
      if (start > now) {
        slots.push(start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
      }
      start.setMinutes(start.getMinutes() + 30)
    }
    return slots
  }

  const allSlots = generateTimeSlots()
  const scheduleMap = new Map<string, Schedule>()
  localSchedules.forEach((s) => {
    //fron
    const match = s.time.match(/(\d{1,2}:\d{2}\s[AP]M)/)
    if (match?.[1]) scheduleMap.set(match[1], s)
  })

  const bookedCount = scheduleMap.size
  const freeCount = allSlots.length - bookedCount

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed -inset-10 bg-black/70 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Modal panel */}
        <motion.div
          className="
                   w-[95vw] max-w-2xl max-h-[92vh] overflow-hidden
                   flex flex-col rounded-3xl shadow-2xl
                   bg-white dark:bg-gray-900 relative"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header gradient ── */}
          <div className={`relative bg-gradient-to-br ${gradient} px-6 pt-8 pb-16 text-white flex-shrink-0`}>
            {/* dot pattern */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }}
            />

            {/* Close btn */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center cursor-pointer"
            >
              <FiX size={15} />
            </button>

            {/* Section label */}
            <div className="relative z-10">
              <span className="text-xs font-semibold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                {doctor.section}
              </span>
            </div>
          </div>

          {/* ── Floating avatar ── */}
          <div className="relative flex justify-center -mt-14 flex-shrink-0 z-10">
            <div className="relative p-1 rounded-full bg-white dark:bg-gray-900 shadow-xl group cursor-default">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>
              <img
                src={doctor.image}
                alt={doctor.name}
                className="relative z-10 w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/Logo.png' }}
              />
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* Doctor info */}
            <div className="text-center mt-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{doctor.name}</h2>
              <StarRow rating={doctor.rating} />
              <div className="flex items-center justify-center gap-1.5 mt-2 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 w-max mx-auto px-3 py-1 rounded-full">
                <FiPhone size={12} className="text-Primary" />
                <span className="text-sm font-medium">{doctor.phone}</span>
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                {doctor.description}
              </p>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3.5 text-center border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                <p className="text-2xl font-black text-gray-800 dark:text-white">{allSlots.length}</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{t('DoctorModal.total', "Total")}</p>
              </div>
              <div className="bg-teal-50/50 dark:bg-teal-900/10 rounded-2xl p-3.5 text-center border border-teal-100 dark:border-teal-800/30 hover:shadow-md transition-shadow">
                <p className="text-2xl font-black text-teal-600 dark:text-teal-400">{bookedCount}</p>
                <p className="text-xs font-semibold text-teal-500/80 dark:text-teal-400/80 mt-1 uppercase tracking-wider">{t('DoctorModal.booked', "Booked")}</p>
              </div>
              <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl p-3.5 text-center border border-emerald-100 dark:border-emerald-800/30 hover:shadow-md transition-shadow">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{freeCount}</p>
                <p className="text-xs font-semibold text-emerald-500/80 dark:text-emerald-400/80 mt-1 uppercase tracking-wider">{t('DoctorModal.available', "Available")}</p>
              </div>
            </div>

            {/* Schedule table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <FiClock className="text-Primary" size={16} />
                  {t('DoctorModal.dailySchedule', "Daily Schedule")}
                </h4>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">9 AM – 5 PM</span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider w-[28%]">
                        <div className="flex items-center gap-1.5"><FiClock size={12} /> {t('DoctorModal.time', "Time")}</div>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider w-[35%]">
                        <div className="flex items-center gap-1.5"><FiUser size={12} /> {t('DoctorModal.patient', "Patient")}</div>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">
                        <div className="flex items-center gap-1.5"><FiFileText size={12} /> {t('DoctorModal.status', "Status")}</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSlots.map((slot, i) => {
                      const data = scheduleMap.get(slot)
                      const isBooked = !!data
                      const isEven = i % 2 === 0
                      const isSelected = schedulingSlot === slot

                      return (
                        <React.Fragment key={i}>
                          <tr
                            onClick={(e) => {
                              e.preventDefault()
                              if (!isBooked) {
                                setSchedulingSlot(isSelected ? null : slot);
                                setPatientId("");
                                setErrorMsg("");
                              }
                            }}
                            className={`relative group transition-all duration-200
                            ${isEven ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/40 dark:bg-gray-800/30'}
                            ${isBooked ? 'opacity-70 cursor-default' : 'cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/20'}
                            ${isSelected ? 'bg-teal-50/80 dark:bg-teal-900/30' : ''}
                          `}
                          >
                            {/* Time */}
                            <td className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isBooked ? 'bg-gray-300 dark:bg-gray-600' : (isSelected ? 'bg-teal-500' : 'bg-emerald-400')} shadow-sm`}></div>
                                <span className={`font-mono text-xs font-bold ${isBooked ? 'text-gray-500 dark:text-gray-400' : (isSelected ? 'text-teal-700 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300')}`}>
                                  {slot}
                                </span>
                              </div>
                            </td>

                            {/* Patient / free slot */}
                            <td className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                              {isBooked ? (
                                <div className="flex items-center gap-2.5">
                                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                    <FiUser size={11} className="text-gray-600 dark:text-gray-300" />
                                  </div>
                                  <span className="text-gray-600 dark:text-gray-300 text-xs font-semibold truncate max-w-[120px]">{data!.patientName}</span>
                                </div>
                              ) : (
                                <span className={`text-xs font-medium ${isSelected ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                  {isSelected ? t('DoctorModal.scheduling', 'Scheduling...') : t('DoctorModal.availableText', 'Available')}
                                </span>
                              )}
                            </td>

                            {/* Description / add hover */}
                            <td className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
                              {isBooked ? (
                                <span className="text-gray-400 dark:text-gray-500 text-xs">{data!.description}</span>
                              ) : (
                                <>
                                  <span className="text-gray-300 dark:text-gray-600 text-xs italic">—</span>
                                  {!isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-inner">
                                      <span>{t('DoctorModal.bookSlot', '+ Book Slot')}</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>

                          {/* Expandable Form Row */}
                          <AnimatePresence>
                            {isSelected && (
                              <tr>
                                <td colSpan={3} className="p-0 border-b border-gray-200 dark:border-gray-800">
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-teal-50/30 dark:bg-teal-900/10 shadow-inner"
                                  >
                                    <div className="p-5 border-l-2  shadow-sm border border-gray-100 dark:border-gray-800">
                                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">{t('DoctorModal.patientId', 'Patient ID')}</label>
                                      <div className="relative mb-4">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <FiUser className="text-gray-400" size={14} />
                                        </div>
                                        <input
                                          type="text"
                                          placeholder={t('DoctorModal.enterPatientId', "Enter patient ID to book...")}
                                          value={patientId}
                                          onChange={(e) => setPatientId(e.target.value)}
                                          onClick={(e) => e.stopPropagation()}
                                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                                          autoFocus
                                        />
                                      </div>

                                      {errorMsg && <span className="text-xs font-medium text-rose-500 block mb-3">{errorMsg}</span>}

                                      <div className="flex gap-3">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSchedule(slot);
                                          }}
                                          disabled={submitting}
                                          className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-teal-500/20"
                                        >
                                          {submitting ? <Loading size={16} stroke='2' color='#fff' /> : <><span>✓</span> {t('DoctorModal.confirmBooking', 'Confirm Booking')}</>}
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSchedulingSlot(null);
                                            setPatientId("");
                                            setErrorMsg("");
                                          }}
                                          className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-xl transition-all"
                                        >
                                          {t('DoctorModal.cancel', 'Cancel')}
                                        </button>
                                      </div>
                                    </div>
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
            </div>
          </div>
        </motion.div>
      </motion.div>


    </>
  )
}

export default DoctorModal

'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiPhone, FiX, FiClock, FiUser, FiFileText } from 'react-icons/fi'
import { useAlert } from './Alert'

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
      setErrorMsg("Patient ID is required");
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
      showAlert("success", "Appointment created successfully!");

      const newAppt = res.data.data.apointment;
      const patientName = newAppt.patient ? `${newAppt.patient.first_name} ${newAppt.patient.last_name}` : `Patient ${newAppt.patient_id}`;

      setLocalSchedules(prev => [
        ...prev,
        {
          id: newAppt.id,
          time: slot,
          patientId: newAppt.patient_id,
          patientName: patientName,
          description: "Instant Appointment"
        }
      ]);

      setSchedulingSlot(null);
      setPatientId("");
      // Since we don't have a callback to refetch, we instantly updated local state
    } catch (err: any) {

      showAlert("error", err.response?.data.msg || "Failed to schedule");

    } finally {
      setSubmitting(false);
    }
  }

  const generateTimeSlots = () => {
    const slots: string[] = []
    const start = new Date()
    start.setHours(9, 0, 0, 0)
    const end = new Date()
    end.setHours(17, 0, 0, 0)
    while (start < end) {
      slots.push(start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
      start.setMinutes(start.getMinutes() + 30)
    }
    return slots
  }

  const allSlots = generateTimeSlots()
  const scheduleMap = new Map<string, Schedule>()
  localSchedules.forEach((s) => {
    const match = s.time.match(/(\d{1,2}:\d{2}\s[AP]M)/)
    if (match?.[1]) scheduleMap.set(match[1], s)
  })

  const bookedCount = scheduleMap.size
  const freeCount = allSlots.length - bookedCount

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="absolute -top-6 left-0 center w-screen h-screen bg-black/70 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal panel */}
        <motion.div
          className="
                   w-[95vw] max-w-2xl max-h-[92vh] overflow-hidden
                   flex flex-col rounded-3xl shadow-2xl
                   bg-white dark:bg-gray-900"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        >
          {/* ── Header gradient ── */}
          <div className={`relative bg-gradient-to-br ${gradient} px-6 pt-8 pb-16 text-white flex-shrink-0`}>
            {/* dot pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '22px 22px' }}
            />

            {/* Close btn */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center"
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
            <div className={`bg-gray-900 rounded-full shadow-xl`}>
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover p-2 border-white dark:border-gray-800"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/Logo.png' }}
              />
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* Doctor info */}
            <div className="text-center mt-3 mb-5">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{doctor.name}</h2>
              <StarRow rating={doctor.rating} />
              <div className="flex items-center justify-center gap-1.5 mt-1 text-gray-400 dark:text-gray-500">
                <FiPhone size={12} />
                <span className="text-sm">{doctor.phone}</span>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                {doctor.description}
              </p>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-700">
                <p className="text-xl font-bold text-gray-800 dark:text-white">{allSlots.length}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Total Slots</p>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl p-3 text-center border border-teal-100 dark:border-teal-800/40">
                <p className="text-xl font-bold text-teal-600 dark:text-teal-400">{bookedCount}</p>
                <p className="text-[11px] text-teal-500 dark:text-teal-400 mt-0.5">Booked</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-3 text-center border border-emerald-100 dark:border-emerald-800/40">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{freeCount}</p>
                <p className="text-[11px] text-emerald-500 dark:text-emerald-400 mt-0.5">Available</p>
              </div>
            </div>

            {/* Schedule table */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <FiClock size={14} />
                Daily Schedule <span className="text-gray-400 font-normal">(9 AM – 5 PM)</span>
              </h4>

              <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wide w-[28%]">
                        <div className="flex items-center gap-1.5"><FiClock size={11} /> Time</div>
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wide w-[28%]">
                        <div className="flex items-center gap-1.5"><FiUser size={11} /> Patient</div>
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-1.5"><FiFileText size={11} /> Note</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSlots.map((slot, i) => {
                      const data = scheduleMap.get(slot)
                      const isBooked = !!data
                      const isEven = i % 2 === 0

                      if (schedulingSlot === slot) {
                        return (
                          <tr key={i} className="bg-[#0f172a]">
                            <td colSpan={3} className="p-4 border-b border-gray-800">
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 ml-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                  <span className="text-gray-200 text-xs font-bold">{slot}</span>
                                </div>
                                <div className="bg-Primary/20 rounded-xl p-3  shadow-inner">
                                  <label className="block text-[10px] text-gray-400 mb-1.5 ml-1 font-medium">Patient ID</label>
                                  <input
                                    type="text"
                                    placeholder="Enter patient ID..."
                                    value={patientId}
                                    onChange={(e) => setPatientId(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-2 text-xs border border-Primary rounded-lg bg-Primary/20 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-teal-400 transition-colors mb-3"
                                    autoFocus
                                  />
                                  {errorMsg && <span className="text-xs text-red-400 block mb-2">{errorMsg}</span>}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSchedule(slot);
                                      }}
                                      disabled={submitting}
                                      className="flex-1 py-1.5 bg-Primary text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    >
                                      {submitting ? <Loading size={14} stroke='2' color='#fff' /> : <><span>✓</span> Book Appointment</>}
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSchedulingSlot(null);
                                        setPatientId("");
                                        setErrorMsg("");
                                      }}
                                      className="px-4 py-1.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-md transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )
                      }

                      return (
                        <tr
                          key={i}
                          onClick={(e) => {
                            e.preventDefault()
                            if (!isBooked) {
                              setSchedulingSlot(slot === schedulingSlot ? null : slot);
                              setPatientId("");
                              setErrorMsg("");
                            }
                          }}
                          className={`relative group transition-colors duration-150
                          ${isEven ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/60 dark:bg-gray-800/40'}
                          ${isBooked ? 'hover:bg-teal-50 dark:hover:bg-teal-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'}
                        `}
                        >
                          {/* Time */}
                          <td className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700/60">
                            <span className={`font-mono text-xs font-semibold ${isBooked ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'}`}>
                              {slot}
                            </span>
                          </td>

                          {/* Patient / free slot */}
                          <td className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700/60">
                            {isBooked ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0">
                                  <FiUser size={10} className="text-teal-600 dark:text-teal-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-200 text-xs font-medium">{data!.patientName}</span>
                              </div>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600 text-xs italic">—</span>
                            )}
                          </td>

                          {/* Description / add hover */}
                          <td className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-700/60 relative">
                            {isBooked ? (
                              <span className="text-gray-500 dark:text-gray-400 text-xs">{data!.description}</span>
                            ) : (
                              <>
                                <span className="text-gray-300 dark:text-gray-600 text-xs italic">Free</span>
                                <div className="absolute inset-0 flex items-center justify-center bg-teal-500/90 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-r">
                                  + Add appointment
                                </div>
                              </>
                            )}
                          </td>
                        </tr>
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

'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiPhone, FiX, FiClock, FiUser, FiFileText } from 'react-icons/fi'

interface Schedule {
  time: string
  patientId: string
  patientName: string
  description: string
}

interface Doctor {
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

const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, onClose }) => {
  const gradient = sectionGradients[doctor.section] ?? 'from-teal-500 to-cyan-600'

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
  doctor.schedules.forEach((s) => {
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
        onClick={onClose}
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
            <div className={`ring-4 ring-white dark:ring-gray-900 ring-offset-0 rounded-full shadow-xl`}>
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800"
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

                      return (
                        <tr
                          key={i}
                          className={`relative group transition-colors duration-150
                          ${isEven ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/60 dark:bg-gray-800/40'}
                          ${isBooked ? 'hover:bg-teal-50 dark:hover:bg-teal-900/20' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
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

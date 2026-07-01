'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '../secretaryComponents/DashboardLayout'
import axiosInstance from '../../AuthAxios'
import { useAlert } from '../../../Components/Alert'
import {
  FiUsers,
  FiX,
  FiStar,
  FiDollarSign,
  FiMail,
  FiAward,
  FiChevronRight,
} from 'react-icons/fi'
import { MdOutlineLocalHospital } from 'react-icons/md'

// ─── Color palettes (cycles through departments) ────────────────────────────
const departmentColors = [
  {
    gradient: 'from-cyan-500 to-teal-600',
    light: 'bg-cyan-50 dark:bg-cyan-900/20',
    badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-800/40 dark:text-cyan-300',
    icon: 'text-cyan-500',
    ring: 'ring-cyan-400',
  },
  {
    gradient: 'from-violet-500 to-purple-600',
    light: 'bg-violet-50 dark:bg-violet-900/20',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-800/40 dark:text-violet-300',
    icon: 'text-violet-500',
    ring: 'ring-violet-400',
  },
  {
    gradient: 'from-rose-500 to-pink-600',
    light: 'bg-rose-50 dark:bg-rose-900/20',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-800/40 dark:text-rose-300',
    icon: 'text-rose-500',
    ring: 'ring-rose-400',
  },
  {
    gradient: 'from-amber-500 to-orange-600',
    light: 'bg-amber-50 dark:bg-amber-900/20',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-800/40 dark:text-amber-300',
    icon: 'text-amber-500',
    ring: 'ring-amber-400',
  },
  {
    gradient: 'from-emerald-500 to-green-600',
    light: 'bg-emerald-50 dark:bg-emerald-900/20',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300',
    icon: 'text-emerald-500',
    ring: 'ring-emerald-400',
  },
  {
    gradient: 'from-sky-500 to-blue-600',
    light: 'bg-sky-50 dark:bg-sky-900/20',
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-800/40 dark:text-sky-300',
    icon: 'text-sky-500',
    ring: 'ring-sky-400',
  },
  {
    gradient: 'from-indigo-500 to-blue-700',
    light: 'bg-indigo-50 dark:bg-indigo-900/20',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-800/40 dark:text-indigo-300',
    icon: 'text-indigo-500',
    ring: 'ring-indigo-400',
  },
  {
    gradient: 'from-fuchsia-500 to-pink-600',
    light: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
    badge: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-800/40 dark:text-fuchsia-300',
    icon: 'text-fuchsia-500',
    ring: 'ring-fuchsia-400',
  },
]

const avatarGradients = [
  'from-cyan-400 to-teal-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-green-500',
  'from-sky-400 to-blue-500',
]

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          size={11}
          className={
            star <= Math.round(rating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-300 dark:text-gray-600'
          }
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-amber-500">
        {Number(rating ?? 0).toFixed(1)}
      </span>
    </div>
  )
}

// ─── Doctor Card (inside dialog) ─────────────────────────────────────────────
function DoctorCard({ doctor, index }: { doctor: any; index: number }) {
  const firstName = doctor.user?.first_name ?? ''
  const lastName = doctor.user?.last_name ?? ''
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
  const avatarGrad = avatarGradients[index % avatarGradients.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.38 }}
      className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${avatarGrad} rounded-t-2xl`}
      />

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-md`}
        >
          {initials || <MdOutlineLocalHospital size={20} />}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 dark:text-white text-sm leading-tight truncate">
            Dr. {firstName} {lastName}
          </p>
          <StarRating rating={doctor.doctor?.average_rating ?? 0} />
          {doctor.user?.email && (
            <div className="flex items-center gap-1 mt-1">
              <FiMail size={9} className="text-gray-400 flex-shrink-0" />
              <span className="text-[10px] text-gray-400 truncate">
                {doctor.user.email}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stat pills */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-white dark:bg-gray-700/60 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <FiDollarSign size={10} className="text-emerald-500" />
            <span className="text-[9px] text-gray-500 dark:text-gray-400">Exam Fee</span>
          </div>
          <p className="font-bold text-sm text-gray-800 dark:text-white">
            {doctor.doctor?.price_of_examination != null
              ? Number(doctor.doctor.price_of_examination).toLocaleString()
              : '—'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-700/60 rounded-xl p-2.5 text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <FiAward size={10} className="text-violet-500" />
            <span className="text-[9px] text-gray-500 dark:text-gray-400">Subscription</span>
          </div>
          <p className="font-bold text-sm text-gray-800 dark:text-white">
            {doctor.doctor?.subscription != null
              ? Number(doctor.doctor.subscription).toLocaleString()
              : '—'}
          </p>
        </div>
      </div>

      {/* Bio */}
      {doctor.doctor?.bio && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {doctor.doctor.bio}
        </p>
      )}
    </motion.div>
  )
}

// ─── Doctors Dialog ───────────────────────────────────────────────────────────
function DoctorsDialog({
  department,
  colorScheme,
  onClose,
}: {
  department: any
  colorScheme: (typeof departmentColors)[0]
  onClose: () => void
}) {
  const doctors: any[] = department.doctors ?? []

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className={`relative bg-gradient-to-r ${colorScheme.gradient} p-6 text-white flex-shrink-0`}>
          {/* subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          <div className="relative flex items-start gap-4">
            {/* Department image / icon */}
            {department.image ? (
              <img
                onError={(e) => {
                  e.currentTarget.src = '/images/Logo.png';

                }}
                src={department.image}
                alt={department.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-lg flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
                <MdOutlineLocalHospital size={28} className="text-white" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-tight">{department.name}</h2>
              <p className="text-white/80 text-sm mt-1 line-clamp-2">
                {department.description}
              </p>
              <div className="mt-2 flex items-center gap-1.5 w-fit bg-white/20 rounded-full px-3 py-1">
                <FiUsers size={12} />
                <span className="text-xs font-semibold">
                  {doctors.length} Doctor{doctors.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center"
            aria-label="Close"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* ── Doctor grid ── */}
        <div className="flex-1 overflow-y-auto p-6">
          {doctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className={`w-16 h-16 rounded-2xl ${colorScheme.light} flex items-center justify-center mb-4`}
              >
                <MdOutlineLocalHospital size={28} className={colorScheme.icon} />
              </div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                No doctors assigned
              </h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                This department has no doctors yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctors.map((doc: any, idx: number) => (
                <DoctorCard key={doc.doctor?.id ?? idx} doctor={doc} index={idx} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Department Card ──────────────────────────────────────────────────────────
function DepartmentCard({
  dept,
  index,
  onClick,
}: {
  dept: any
  index: number
  onClick: () => void
}) {
  const colorScheme = departmentColors[index % departmentColors.length]
  const doctorCount = dept.doctors?.length ?? 0

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="text-left w-full group relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 overflow-hidden focus:outline-none"
      id={`dept-card-${dept.id}`}
    >
      {/* Top gradient accent line */}
      <div className={`h-1 w-full bg-gradient-to-r ${colorScheme.gradient}`} />

      {/* Image area */}
      <div className="relative h-36 overflow-hidden">
        {dept.image ? (
          <img
            src={dept.image}
            alt={dept.name}
            onError={(e) => {
              e.currentTarget.src = '/images/Logo.png';
              e.currentTarget.classList.remove('object-cover');
              e.currentTarget.classList.add('object-contain');
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div
            className={`w-full h-full ${colorScheme.light} flex items-center justify-center`}
          >
            <MdOutlineLocalHospital size={44} className={`${colorScheme.icon} opacity-50`} />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Doctor count badge */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white rounded-full px-2.5 py-1 text-[11px] font-semibold">
            <FiUsers size={11} />
            <span>
              {doctorCount} Doctor{doctorCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Text content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-800 dark:text-white text-xl leading-tight">
            {dept.name}
          </h3>
          <motion.div
            className={`${colorScheme.badge} rounded-full p-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            animate={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
          >
            <FiChevronRight size={12} />
          </motion.div>
        </div>

        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {dept.description}
        </p>

        {/* CTA */}
        <div
          className={`mt-4 flex items-center gap-2 ${colorScheme.badge} rounded-xl px-3 py-2`}
        >
          <FiUsers size={12} />
          <span className="text-xs font-semibold">View Doctors</span>
          <FiChevronRight size={12} className="ml-auto" />
        </div>
      </div>
    </motion.button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Page() {
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDept, setSelectedDept] = useState<{
    dept: any
    colorIdx: number
  } | null>(null)
  const { showAlert } = useAlert()

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/api/department')
      setDepartments(response.data.data.departments)
    } catch (error) {
      showAlert('Error', 'Something went wrong', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  return (
    <DashboardLayout loading={loading} title="Medical Sections">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {departments.map((dept: any, index: number) => (
          <DepartmentCard
            key={dept.id}
            dept={dept}
            index={index}
            onClick={() => setSelectedDept({ dept, colorIdx: index })}
          />
        ))}
      </div>

      {/* Doctors Dialog */}
      <AnimatePresence>
        {selectedDept && (
          <DoctorsDialog
            department={selectedDept.dept}
            colorScheme={
              departmentColors[selectedDept.colorIdx % departmentColors.length]
            }
            onClose={() => setSelectedDept(null)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
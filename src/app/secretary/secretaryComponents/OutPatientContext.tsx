'use client'
import React, {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from 'react'
import Pusher from 'pusher-js'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUserCheck, FiX, FiCheckCircle, FiClock } from 'react-icons/fi'

/* ─────────────────────── Types ─────────────────────── */

export interface OutPatientData {
  scretary_id: number
  message: string
  timestamp: string
  appointment_id?: number
  patientName?: string
  doctorName?: string
}

interface OutPatientContextValue {
  outData: OutPatientData | null
  clearOutData: () => void
}

/* ─────────────────────── Context ─────────────────────── */

const OutPatientContext = createContext<OutPatientContextValue>({
  outData: null,
  clearOutData: () => { },
})

export const useOutPatient = () => useContext(OutPatientContext)

/* ─────────────────────── Alert Modal ─────────────────────── */

function PatientOutedModal({
  data,
  onDismiss,
}: {
  data: OutPatientData
  onDismiss: () => void
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header pulse bar — amber/orange to indicate "done" */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-pulse" />

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <FiUserCheck size={22} className="text-amber-500" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white dark:border-gray-900 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Doctor Finished
              </p>
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white">
                Next Patient Ready
              </h3>
            </div>
          </div>

          {/* Message box */}
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl px-4 py-3 mb-4">
            <FiCheckCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.message}
            </p>
          </div>

          {/* Details */}
          {(data.patientName || data.doctorName) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 space-y-3 border border-gray-100 dark:border-gray-700/50">
              {data.patientName && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Patient</span>
                  <span className="font-bold text-gray-800 dark:text-white">{data.patientName}</span>
                </div>
              )}
              {data.doctorName && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Doctor</span>
                  <span className="font-bold text-gray-800 dark:text-white">{data.doctorName}</span>
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-2 mb-5">
            <FiClock size={13} className="text-gray-400" />
            <p className="text-xs text-gray-400 font-medium">{data.timestamp}</p>
          </div>

          {/* Dismiss button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onDismiss}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold text-sm shadow-lg shadow-amber-200 dark:shadow-amber-900/40"
          >
            <FiX size={15} />
            Got it — Send Next Patient
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────── Provider ─────────────────────── */

export function OutPatientProvider({ children }: { children: ReactNode }) {
  const [outData, setOutData] = useState<OutPatientData | null>(null)
  const [showModal, setShowModal] = useState(false)

  const clearOutData = useCallback(() => {
    setTimeout(() => {
      setOutData(null)
    }, 200)
    setShowModal(false)
  }, [])

  /* ── Pusher subscription — reads secretary_id from localStorage ── */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const rawUser = localStorage.getItem('user')
    const user = rawUser ? JSON.parse(rawUser) : null
    const secretaryId = user?.id ?? user?.secretary_id

    if (!secretaryId) {
      console.warn('[Pusher] secretary_id not found in localStorage — out-patient channel not subscribed')
      return
    }

    console.log('[Pusher] subscribing to out-patient.' + secretaryId)
    Pusher.logToConsole = true

    const pusher = new Pusher('c7137e2e884c3e1d021c', {
      cluster: 'eu',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    })

    const channel = pusher.subscribe(`out-patient.${secretaryId}`)

    channel.bind('patient.outed', (data: OutPatientData) => {
      console.log('[Pusher] patient.outed:', data)
      setOutData(data)
      setShowModal(true)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
    }
  }, [])

  const handleDismiss = useCallback(() => {
    setShowModal(false)
  }, [])

  return (
    <OutPatientContext.Provider value={{ outData, clearOutData }}>
      {children}

      <AnimatePresence>
        {showModal && outData && (
          <PatientOutedModal
            data={outData}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </OutPatientContext.Provider>
  )
}

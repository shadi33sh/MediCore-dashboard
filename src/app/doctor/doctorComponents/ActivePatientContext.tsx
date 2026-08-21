'use client'
import React, {
  createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef,
} from 'react'
import Pusher from 'pusher-js'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiX, FiArrowRight, FiActivity } from 'react-icons/fi'
import AuthAxios from '../../AuthAxios'
import axiosInstance from '../../AuthAxios'
import { useTranslation } from 'react-i18next'

/* ─────────────────────── Types ─────────────────────── */

export interface ActivePatientData {
  patient: {
    id: number
    first_name: string
    last_name: string
    phone: string
    birth_date: string
    gender: string
    age: number
    blood_type: string
    chronic_diseases: string | null
    medication_allergies: string | null
    permanent_medications: string | null
    honest_score: number
    discount_point: number
  }
  preview: {
    id: number
    patient_id: number
    doctor_id: number
    department_id: number
    diagnoseis: string
    diagnoseis_type: number
    apointment_id: number,
    medicine: string
    notes: string
    date: string
    status: string
    price_after_discount: number | null
    created_at: string
    updated_at: string
    medical_analysis: any[]
  }
  message: string
  timestamp: string
}

interface ActivePatientContextValue {
  activeData: ActivePatientData | null
  clearActiveData: () => void
}

/* ─────────────────────── Context ─────────────────────── */

const ActivePatientContext = createContext<ActivePatientContextValue>({
  activeData: null,
  clearActiveData: () => { },
})

export const useActivePatient = () => useContext(ActivePatientContext)

/* ─────────────────────── Modal ─────────────────────── */

function PatientEnteredModal({
  data,
  onConfirm,
  onIgnore,
}: {
  data: ActivePatientData
  onConfirm: () => void
  onIgnore: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onIgnore}
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header pulse bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-Primary via-teal-400 to-Primary animate-pulse" />

        <div className="p-6">
          {/* Icon + title */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-Primary/10 flex items-center justify-center">
                <FiUser size={22} className="text-Primary" />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-Primary">{t('ActivePatient.patientEntered', 'Patient Entered')}</p>
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white">
                {data.patient.first_name} {data.patient.last_name}
              </h3>
            </div>
          </div>

          {/* Patient quick info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: t('ActivePatient.age', 'Age'), value: `${data.patient.age} ${t('ActivePatient.yrs', 'yrs')}` },
              { label: t('ActivePatient.gender', 'Gender'), value: data.patient.gender },
              { label: t('ActivePatient.bloodType', 'Blood Type'), value: data.patient.blood_type },
              { label: t('ActivePatient.trustScore', 'Trust Score'), value: `${data.patient.honest_score}%` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Preview badge */}
          {data.preview && (
            <div className="flex items-center gap-2 bg-Primary/5 border border-Primary/20 rounded-xl px-4 py-2.5 mb-5">
              <FiActivity size={14} className="text-Primary flex-shrink-0" />
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {t('ActivePatient.activePreviewFound', 'Active preview found —')}{' '}
                <span className="font-bold text-Primary">#{data.preview.id}</span>
                {' '}({data.preview.status}, {data.preview.date})
              </p>
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-gray-400 mb-5">{t('ActivePatient.enteredAt', 'Entered at:')} {data.timestamp}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-Primary to-teal-500 text-white font-bold text-sm shadow-lg shadow-Primary/20"
            >
              <FiArrowRight size={15} />
              {t('ActivePatient.goToPreview', 'Go to Preview')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onIgnore}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <FiX size={14} />
              {t('ActivePatient.ignore', 'Ignore')}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ─────────────────────── Floating Button ─────────────────────── */

function FloatingCurrentPreview({ data, onClick }: { data: ActivePatientData; onClick: () => void }) {
  const { t } = useTranslation()

  return (
    <motion.button
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 ltr:right-6  rtl:left-6 z-[9998] flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-Primary to-teal-500 text-white font-bold text-sm shadow-xl shadow-Primary/30 hover:shadow-2xl transition-all"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
      </span>
      {t('ActivePatient.currentPreview', 'Current Preview')}
      <span className="ml-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
        {data.patient.first_name}
      </span>
    </motion.button>
  )
}

/* ─────────────────────── Provider ─────────────────────── */

export function ActivePatientProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeData, setActiveData] = useState<ActivePatientData | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showFloating, setShowFloating] = useState(false)

  const showModalRef = useRef(showModal)
  useEffect(() => { showModalRef.current = showModal }, [showModal])

  const clearActiveData = useCallback(() => {
    // setActiveData(null)
    setShowModal(false)
  }, [])

  console.log(activeData)

  /* ── API Polling — Fetch active patient every 30s ── */
  useEffect(() => {
    if (typeof window === 'undefined') return

    const fetchActivePatient = async () => {
      if (pathname.includes('/doctor/preview/')) {
        setShowFloating(false)
        setShowModal(false)
        return
      }

      try {
        const res = await axiosInstance.get('/api/getActivePatientInfo')
        console.log(res.data.data)

        if (res.data.data?.patient) {
          const p = res.data.data.patient
          const pv = res.data.data.previews || []
          const incompletePreview = pv.find((pr: any) => pr.diagnoseis_type === 0)

          setActiveData({
            patient: p,
            preview: incompletePreview,
            message: "Active patient fetched via polling",
            timestamp: new Date().toLocaleTimeString(),
          })

          if (!showModalRef.current) {
            setShowFloating(true)
          }
        } else {
          setActiveData(null)
          setShowFloating(false)
        }
      } catch (error) {
        console.error('[Polling] Error fetching active patient info:', error)
      }
    }

    fetchActivePatient()
    const intervalId = setInterval(fetchActivePatient, 6000)

    return () => clearInterval(intervalId)
  }, [pathname])

  /* ── Pusher subscription — reads doctor_id from the stored user object ── */
  useEffect(() => {
    if (typeof window === 'undefined') return

    // doctor_id lives inside the user object saved at login
    const rawUser = localStorage.getItem('user')
    const user = rawUser ? JSON.parse(rawUser) : null
    const doctorId = 9

    if (!doctorId) {
      console.warn('[Pusher] doctor_id not found in localStorage — channel not subscribed')
      return
    }

    console.log('[Pusher] subscribing to enter-patient.' + doctorId)
    Pusher.logToConsole = true
    const pusher = new Pusher('c7137e2e884c3e1d021c', {
      cluster: 'eu',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    })

    const channel = pusher.subscribe(`enter-patient.${doctorId}`)

    channel.bind('patient.entered', (data: ActivePatientData) => {
      console.log('[Pusher] patient.entered:', data)
      setActiveData(data)
      setShowModal(true)
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
    }
  }, [])



  const handleIgnore = useCallback(() => {
    setShowModal(false)
    setShowFloating(true)
  }, [])

  const handleFloatingClick = useCallback(() => {
    setShowModal(true)
  }, [])

  return (
    <ActivePatientContext.Provider value={{ activeData, clearActiveData }}>
      {children}

      <AnimatePresence>
        {showModal && activeData && (
          <PatientEnteredModal
            data={activeData}
            onConfirm={() => {

              router.push(`/doctor/preview/${activeData.preview.patient_id}/${activeData.preview.apointment_id}`)
              setShowModal(false)
              setShowFloating(false)

            }}
            onIgnore={handleIgnore}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFloating && activeData && (
          <FloatingCurrentPreview data={activeData} onClick={handleFloatingClick} />
        )}
      </AnimatePresence>
    </ActivePatientContext.Provider>
  )
}

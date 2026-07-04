"use client"

import React, { useEffect, useState } from "react"
import axiosInstance from "../../AuthAxios"
import { AnimatePresence, motion } from "framer-motion"
import { FiX, FiCalendar, FiActivity, FiInfo, FiLock, FiRefreshCw, FiFileText } from "react-icons/fi"
import Loading from "../../../Components/loading"

interface PreviewDetailsModalProps {
  previewId: number | null
  isOpen: boolean
  onClose: () => void
}

interface PreviewDetail {
  id: number
  diagnoseis: string
  diagnoseis_type: number
  medicine: string
  notes: string
  status: string
  date: string
  created_at: string
}

export default function PreviewDetailsModal({ previewId, isOpen, onClose }: PreviewDetailsModalProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<PreviewDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || previewId === null) return

    const fetchPreview = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get(`/api/getPreviewById/${previewId}`)
        if (response.data?.status) {
          setPreview(response.data.data)
        } else {
          setError("Unable to load preview details.")
        }
      } catch (err) {
        console.error("Failed to fetch preview details", err)
        setError("Unable to load preview details.")
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [isOpen, previewId])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        >
          <div className="bg-gradient-to-br from-cyan-500 to-teal-500 px-8 py-7 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />
            <div className="relative flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                  <FiFileText size={22} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/80 font-semibold mb-1">
                    Preview Details
                  </p>
                  <h2 className="text-2xl font-bold text-white">
                    {preview ? `Preview #${preview.id}` : "Loading preview"}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white hover:bg-white/25 transition"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          <div className="px-8 py-7">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-sm text-gray-500 dark:text-gray-300">
                <Loading />
                Loading preview details...
              </div>
            ) : error ? (
              <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
            ) : preview ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-2">Date</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <FiCalendar size={16} />
                      {preview.date}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mb-2">Status</p>
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${preview.status === "Stable" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"}`}>
                      {preview.status}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 p-4">
                    <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">
                      <FiInfo size={14} /> Diagnosis
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {preview.diagnoseis || "No diagnosis details provided."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 p-4">
                    <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">
                      <FiActivity size={14} /> Medicine
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {preview.medicine || "No medicine details provided."}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/60 p-4">
                    <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">
                      <FiFileText size={14} /> Notes
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                      {preview.notes || "No additional notes."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-300">
                No preview details available.
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

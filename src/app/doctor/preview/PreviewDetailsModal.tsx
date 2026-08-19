"use client"

import React, { useEffect, useState } from "react"
import axiosInstance from "../../AuthAxios"
import { AnimatePresence, motion } from "framer-motion"
import { FiX, FiCalendar, FiActivity, FiInfo, FiFileText, FiCheckCircle, FiClock } from "react-icons/fi"
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

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-3xl rounded-[2rem] bg-white/90 dark:bg-gray-900/90 shadow-2xl  dark:border-gray-800/50 overflow-hidden backdrop-blur-2xl"
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-Primary/90 to-blue-600/90 px-8 py-8">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl  flex items-center justify-center text-white shadow-lg shadow-black/10">
                  <FiFileText size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white/90 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10">
                      Medical Record
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {preview ? `Preview #${preview.id}` : "Loading..."}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 hover:rotate-90 transition-all duration-300"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-sm font-medium text-gray-500 dark:text-gray-400">
                <Loading size={40} />
                <p className="animate-pulse">Retrieving medical details...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-4">
                  <FiX size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Failed to load</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
              </div>
            ) : preview ? (
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {/* Meta info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants} className="relative overflow-hidden group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/20 p-5  dark:border-gray-700/50 hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <FiCalendar size={12} /> Date of Visit
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {preview.date}
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="relative overflow-hidden group rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/20 p-5  dark:border-gray-700/50 hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <FiCheckCircle size={12} /> Patient Status
                    </p>
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${preview.status === "Stable"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30"
                        }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
                        {preview.status}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Content blocks */}
                <div className="space-y-4">
                  {/* Diagnosis */}
                  <motion.div variants={itemVariants} className="group rounded-2xl bg-white dark:bg-gray-800/40 p-4 dark:border-gray-700/60 shadow-sm hover:shadow-lg hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <FiInfo size={16} />
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-gray-200">
                        Diagnosis
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed pl-10 border-l-2 border-blue-100 dark:border-blue-500/20">
                      {preview.diagnoseis || <span className="text-gray-400 italic">No diagnosis details provided.</span>}
                    </p>
                  </motion.div>

                  {/* Medicine */}
                  <motion.div variants={itemVariants} className="group rounded-2xl bg-white dark:bg-gray-800/40 p-4 dark:border-gray-700/60 shadow-sm hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <FiActivity size={16} />
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-gray-200">
                        Medicine
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed pl-10 border-l-2 border-emerald-100 dark:border-emerald-500/20">
                      {preview.medicine || <span className="text-gray-400 italic">No medicine details provided.</span>}
                    </p>
                  </motion.div>

                  {/* Notes */}
                  <motion.div variants={itemVariants} className="group rounded-2xl bg-white dark:bg-gray-800/40 p-4 dark:border-gray-700/60 shadow-sm hover:shadow-lg hover:border-amber-100 dark:hover:border-amber-900/30 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <FiFileText size={16} />
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-gray-200">
                        Notes
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed pl-10 border-l-2 border-amber-100 dark:border-amber-500/20">
                      {preview.notes || <span className="text-gray-400 italic">No additional notes.</span>}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-300 text-center py-10">
                No preview details available.
              </div>
            )}
          </div>

          {/* Footer (Optional, can just be empty spacing or close button) */}
          <div className="px-8 py-5 bg-gray-50/80 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

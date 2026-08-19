import React from 'react'
import { motion } from 'framer-motion'
import { FiX, FiFileText, FiActivity, FiHeart } from 'react-icons/fi'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Patient } from './page'

interface HistoryModalProps {
  patient: Patient | null;
  onClose: () => void;
}

export default function HistoryModal({ patient, onClose }: HistoryModalProps) {
  const { t } = useTranslation()

  if (!patient) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <FiFileText className="text-Primary" size={20} />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {t('Doctor.Patients.checkupHistory', 'Checkup History')} - {patient.first_name} {patient.last_name}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30 dark:bg-gray-900/30">
          {patient.preview_info && patient.preview_info.length > 0 ? (
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 sm:ml-4 rtl:border-l-0 rtl:border-r-2 rtl:ml-0 rtl:mr-3 sm:rtl:mr-4">
              {patient.preview_info.map((preview, idx) => (
                <div key={preview.id || idx} className="mb-8 ml-6 sm:ml-8 rtl:ml-0 rtl:mr-6 sm:rtl:mr-8 last:mb-0">
                  <span className="absolute flex items-center justify-center w-5 h-5 bg-Primary/20 rounded-full -left-2.5 rtl:-left-auto rtl:-right-2.5 ring-8 ring-white dark:ring-gray-900">
                    <span className="w-2.5 h-2.5 bg-Primary rounded-full"></span>
                  </span>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm transition hover:shadow-md">
                    {/* Header: Date and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{t('Doctor.Patients.checkupDate', 'Checkup Date')}</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                          {preview.date ? dayjs(preview.date).format('MMM DD, YYYY') : t('Doctor.Patients.na', 'N/A')}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {preview.status || t('Doctor.Patients.stable', 'Stable')}
                        </span>
                      </div>
                    </div>

                    {/* Body: Diagnosis & Medicine */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5 mb-1.5">
                          <FiActivity size={12} />
                          {t('Doctor.Patients.diagnosis', 'Diagnosis')}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                          {preview.diagnoseis}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5 mb-1.5">
                          <FiHeart size={12} />
                          {t('Doctor.Patients.prescribedMedicine', 'Prescribed Medicine')}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                          {preview.medicine}
                        </p>
                      </div>
                    </div>

                    {/* Footer: Notes */}
                    {preview.notes && (
                      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 -mx-5 -mb-5 p-5 rounded-b-2xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5 mb-1.5">
                          <FiFileText size={12} />
                          {t('Doctor.Patients.doctorNotes', 'Doctor Notes')}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic leading-relaxed">
                          "{preview.notes}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic text-center py-10">{t('Doctor.Patients.noCheckups', 'No checkup reports recorded yet by you.')}</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

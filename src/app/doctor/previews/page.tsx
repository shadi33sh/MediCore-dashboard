'use client'
import React, { useState, useEffect } from 'react'
import DashboardLayout from '../doctorComponents/DocDashboardLayout'
import axiosInstance from '../../AuthAxios'
import { useAlert } from '../../../Components/Alert'
import { useTranslation } from 'react-i18next'
import Loading from '../../../Components/loading'
import { FiSearch, FiActivity, FiHeart, FiFileText, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import dayjs from 'dayjs'
import { motion, AnimatePresence } from 'framer-motion'

interface PreviewItem {
  id: number
  date: string
  diagnoseis: string
  medicine: string
  notes: string
  status: string
  patient: {
    id: number
    first_name: string
    last_name: string
    gender: string
    age: number
  }
}

export default function PreviewsPage() {
  const [previews, setPreviews] = useState<PreviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedPreviewId, setExpandedPreviewId] = useState<number | null>(null)
  const { showAlert } = useAlert()
  const { t } = useTranslation()

  useEffect(() => {
    async function fetchPreviews() {
      try {
        const response = await axiosInstance.get('/api/getPreviedPatients')
        if (response.data.status || response.data.patients) {
          const rawData = response.data.data || []
          const previewsList: PreviewItem[] = []

          rawData.forEach((item: any) => {
            if (item.preview_info) {
              previewsList.push({
                id: item.preview_info.id,
                date: item.preview_info.date,
                diagnoseis: item.preview_info.diagnoseis,
                medicine: item.preview_info.medicine,
                notes: item.preview_info.notes,
                status: item.preview_info.status,
                patient: {
                  id: item.id,
                  first_name: item.first_name,
                  last_name: item.last_name,
                  gender: item.gender,
                  age: item.age,
                }
              })
            }
          })

          const uniquePreviews = Array.from(new Map(previewsList.map(p => [p.id, p])).values())
          uniquePreviews.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
          setPreviews(uniquePreviews)
        }
      } catch (err: any) {
        console.error('Error fetching previews:', err)
        showAlert('error', err.response?.data?.message || 'Failed to load checkups.')
      } finally {
        setLoading(false)
      }
    }
    fetchPreviews()
  }, [])

  const filteredPreviews = previews.filter(p => {
    const fullName = `${p.patient.first_name || ''} ${p.patient.last_name || ''}`.toLowerCase()
    const search = searchTerm.toLowerCase()
    return fullName.includes(search) || (p.diagnoseis && p.diagnoseis.toLowerCase().includes(search))
  })

  return (
    <DashboardLayout title={t('Doctor.PreviewsList.title', 'All Checkups')}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('Doctor.PreviewsList.searchPlaceholder', 'Search by patient name or diagnosis...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary transition"
            />
          </div>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1.5 rounded-full font-medium self-end sm:self-auto">
            {filteredPreviews.length} {t('Doctor.PreviewsList.recordsFound', 'records found')}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loading size={36} />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPreviews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FiFileText size={48} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">{t('Doctor.PreviewsList.noRecords', 'No checkup records found')}</p>
          </div>
        )}

        {/* Table List */}
        {!loading && filteredPreviews.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('Doctor.Patients.checkupDate', 'Checkup Date')}</th>
                    <th className="px-6 py-4 font-bold">{t('Doctor.Patients.patient', 'Patient')}</th>
                    <th className="px-6 py-4 font-bold">{t('Doctor.Patients.diagnosis', 'Diagnosis')}</th>
                    <th className="px-6 py-4 font-bold">{t('Doctor.Patients.status', 'Status')}</th>
                    <th className="px-6 py-4 font-bold text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredPreviews.map((preview, index) => {
                    const isExpanded = expandedPreviewId === preview.id;
                    return (
                      <React.Fragment key={preview.id}>
                        <tr
                          onClick={() => setExpandedPreviewId(isExpanded ? null : preview.id)}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                            {preview.date ? dayjs(preview.date).format('MMM DD, YYYY') : t('Doctor.Patients.na', 'N/A')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-Primary/10 flex items-center justify-center text-Primary font-bold text-xs flex-shrink-0">
                                {preview.patient.first_name?.[0]}{preview.patient.last_name?.[0]}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 dark:text-white">
                                  {preview.patient.first_name} {preview.patient.last_name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-[200px] truncate">
                            {preview.diagnoseis}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              {preview.status || t('Doctor.Patients.stable', 'Stable')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400">
                            <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition ml-auto">
                              {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </button>
                          </td>
                        </tr>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="p-0 border-none">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                                  className="overflow-hidden bg-gray-50/50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 shadow-inner"
                                >
                                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5 mb-2">
                                        <FiHeart size={12} />
                                        {t('Doctor.Patients.prescribedMedicine', 'Prescribed Medicine')}
                                      </p>
                                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700">
                                        {preview.medicine || t('Doctor.Patients.none', 'None')}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5 mb-2">
                                        <FiFileText size={12} />
                                        {t('Doctor.Patients.doctorNotes', 'Doctor Notes')}
                                      </p>
                                      {preview.notes ? (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 italic bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700">
                                          "{preview.notes}"
                                        </p>
                                      ) : (
                                        <p className="text-sm text-gray-400 italic bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700">
                                          {t('Doctor.Patients.none', 'None')}
                                        </p>
                                      )}
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
        )}
      </div>
    </DashboardLayout>
  )
}

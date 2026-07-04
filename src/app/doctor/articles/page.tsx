'use client'
import React, { useState, useEffect } from 'react'
import DashboardLayout from '../doctorComponents/DocDashboardLayout'
import { AnimatePresence, motion } from 'framer-motion'
import { FiPlus, FiX, FiCalendar, FiUser, FiFileText } from 'react-icons/fi'
import axiosInstance from '../../AuthAxios'
import AddArticleForm from '../doctorComponents/AddArticleForm'
import Loading from '../../../Components/loading'
import dayjs from 'dayjs'
import { useAlert } from '../../../Components/Alert'
import ArticleReviewModal from '../doctorComponents/ArticleReviewModal'

interface Article {
  id: number
  title: string
  body: string
  image: string
  created_at: string
  doctorName?: string
  doctor?: {
    user: {
      first_name: string
      last_name: string
    }
  }
}

export default function Page() {
  const [addArticleModal, setAddArticleModal] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [deletingArticleId, setDeletingArticleId] = useState<number | null>(null)
  const [reviewArticle, setReviewArticle] = useState<Article | null>(null)
  const {showAlert} = useAlert()
  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await axiosInstance.get('api/getAtricles')
      setArticles(response.data.data.data || [])
    } catch (err: any) {
      console.error('Error fetching articles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const handleDeleteArticle = async (articleId: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return
    setDeletingArticleId(articleId)
    try {
      await axiosInstance.delete(`api/deleteArticle/${articleId}`)
      setArticles((prev) => prev.filter((article) => article.id !== articleId))
      showAlert('success', 'Article deleted successfully.')
    } catch (err: any) {
      console.error('Error deleting article:', err)
      showAlert('error', err?.response?.data?.message || 'Failed to delete article')
    } finally {
      setDeletingArticleId(null)
    }
  }

  if (!mounted) return null

  return (
    <DashboardLayout title="Doctor Articles">
      <div className="space-y-6">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-base">Publications & Insights</h3>
            <p className="text-xs text-gray-400">Share knowledge, research, and healthcare tips with the community</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-Primary to-teal-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-Primary/10 hover:shadow-lg transition-all"
            onClick={() => setAddArticleModal(true)}
          >
            <FiPlus size={16} />
            Write an Article
          </motion.button>
        </div>

        {/* Modal Wrapper */}
        <AnimatePresence>
          {addArticleModal && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Centered Modal Container */}
                <motion.div
                  className="z-50
                           w-full md:max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Header inside modal */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-gray-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-Primary/10 flex items-center justify-center text-Primary">
                        <FiFileText size={16} />
                      </div>
                      <span className="font-bold text-gray-800 dark:text-white">Create New Article</span>
                    </div>
                    <button
                      onClick={() => setAddArticleModal(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition flex items-center justify-center text-gray-500"
                    >
                      <FiX size={15} />
                    </button>
                  </div>

                  {/* Body inside modal */}
                  <div className="flex-1 overflow-y-auto">
                    <AddArticleForm />
                  </div>
                </motion.div>
              </motion.div>

            </>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loading size={36} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => {
              // Format date nicely
              const formattedDate = article.created_at ? dayjs(article.created_at).format('MMMM DD, YYYY') : 'N/A'

              // Handle author names cleanly
              const authorName = article.doctorName
                ? article.doctorName
                : article.doctor?.user
                  ? `Dr. ${article.doctor.user.first_name} ${article.doctor.user.last_name}`
                  : 'Medical Expert'

              const initials = authorName.replace('Dr. ', '').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

              return (
                <motion.a
                  href={`/doctor/articles/${article.id}`}
                  target='_blank'
                  key={article.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col group transition"
                >
                  {/* Article cover image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <img
                      src={article.image || '/images/Logo.png'}
                      alt={article.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e: any) => {
                        e.target.src = '/images/default-article.jpg' // fallback placeholder
                      }}
                    />
                    <span className="absolute top-4 left-4 text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 bg-white/95 dark:bg-gray-900/95 text-Primary rounded-full shadow-sm">
                      Health Care
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      <h4 className="text-base font-bold text-gray-800 dark:text-white leading-snug line-clamp-2 group-hover:text-Primary transition">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5">
                        <FiCalendar size={12} />
                        {formattedDate}
                      </p>
                    </div>

                    {/* Author block */}
                    <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="w-8 h-8 rounded-full bg-Primary/10 border border-Primary/20 flex items-center justify-center text-[10px] font-bold text-Primary">
                        {initials}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {authorName}
                      </span>
                      <button
                      type="button"
                      onClick={() => setReviewArticle(article)}
                      className="px-3 py-2 rounded-2xl text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition"
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(article.id)}
                      disabled={deletingArticleId === article.id}
                      className={`px-3 py-2 rounded-2xl text-[11px] font-semibold transition ${
                        deletingArticleId === article.id
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60'
                      }`}
                    >
                      {deletingArticleId === article.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      )}
      <ArticleReviewModal article={reviewArticle} isOpen={Boolean(reviewArticle)} onClose={() => setReviewArticle(null)} />
    </div>
  </DashboardLayout>
  )
}

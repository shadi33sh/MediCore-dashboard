'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCalendar } from 'react-icons/fi'

type Article = {
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

interface ArticleReviewModalProps {
  article: Article | null
  isOpen: boolean
  onClose: () => void
}

function renderArticleContent(body: string) {
  return body.split('\n').map((line, index) => {
    const imageMatch = line.match(/\[(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))\]/i)
    if (imageMatch) {
      return (
        <div key={index} className="my-4">
          <img
            src={imageMatch[1]}
            alt="Article image"
            className="w-full rounded-3xl object-cover"
          />
        </div>
      )
    }

    return (
      <p key={index} className="text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-300 mb-3">
        {line}
      </p>
    )
  })
}

export default function ArticleReviewModal({ article, isOpen, onClose }: ArticleReviewModalProps) {
  if (!article) return null

  const formattedDate = article.created_at ? new Date(article.created_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  }) : 'N/A'

  const authorName = article.doctorName
    ? article.doctorName
    : article.doctor?.user
      ? `Dr. ${article.doctor.user.first_name} ${article.doctor.user.last_name}`
      : 'Medical Expert'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-x-4 top-8 md:inset-x-20 md:top-12 z-50 rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh]"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-Primary font-semibold">Review Article</p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{article.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <FiCalendar size={14} /> {formattedDate}
                  </span>
                  <span>{authorName}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {article.image && (
                <div className="mb-5 rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={article.image} alt={article.title} className="w-full object-cover h-72" />
                </div>
              )}
              <div className="space-y-4">
                {renderArticleContent(article.body)}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

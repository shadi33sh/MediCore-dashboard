'use client'
import React from 'react'
import LoadingScreen from '../../../Components/loadingScreen'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  loading?: boolean
  actions?: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, loading = false, actions }) => {
  return (
    <div className="p-6 space-y-6 h-full relative">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          {(title || actions) && (
            <div className="flex items-center justify-between">
              {title && (
                <h2 className="text-3xl max-md:text-lg max-md:pl-6 font-bold text-gray-800 dark:text-white">
                  {title}
                </h2>
              )}
              {actions && <div>{actions}</div>}
            </div>
          )}
          {children}
        </>
      )}
    </div>
  )
}

export default DashboardLayout

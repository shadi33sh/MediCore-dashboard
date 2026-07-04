'use client'
import React from 'react'
import SideBar from './DocSideBar'
import LoadingScreen from '../../../Components/loadingScreen'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  loading?: boolean
  actions?: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, loading = false, actions }) => {
  return (
    <div className="flex w-screen h-screen dark:text-white bg-gray-100 dark:bg-gray-900 scroll-hidden">
      <SideBar />
      <div className="flex-1 md:p-6 md:pl-0 overflow-y-auto">
        <div className="bg-white h-full dark:bg-black shadow-xl md:rounded-2xl p-6 overflow-scroll space-y-6 border-gray-200 dark:border-gray-700 scroll-hidden">
          {loading ? (
            <LoadingScreen />
          ) : (
            <>
              {(title || actions) && (
                <div className="flex items-center justify-between">
                  {title && (
                    <h2 className="text-3xl max-md:text-lg max-md:pl-6 font-extrabold text-gray-800 dark:text-white">
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
      </div>
    </div>
  )
}

export default DashboardLayout

'use client'
import React from 'react'
import SideBar from './adminSideBar'
import LoadingScreen from '../../../Components/loadingScreen'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  loading: boolean | null
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, loading = false }) => {
  return (
    <div className="flex w-screen h-screen dark:text-white bg-gray-100 dark:bg-gray-900">
      <SideBar />
      <div className="flex-1 md:p-6  md:pl-0 overflow-y-auto rtl:md:pl-4 scroll-hidden ">
        <div className="bg-white h-full ml-5 dark:bg-black md:rounded-2xl p-6 shadow-xl   overflow-scroll space-y-6 border-gray-200 dark:border-gray-700 scroll-hidden">
          {
            loading ? <LoadingScreen />
              :
              <>
                <div className="flex justify-between items-center">
                  {title && (<h2 className="text-3xl  max-md:text-lg max-md:pl-6 font-bold text-gray-800 dark:text-white">{title}</h2>)}
                </div>
                {children}
              </>
          }
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout

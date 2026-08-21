'use client'
import React from 'react'
import { ActivePatientProvider } from './doctorComponents/ActivePatientContext'

import SideBar from './doctorComponents/DocSideBar'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ActivePatientProvider>
      <div className="flex w-screen h-screen dark:text-white bg-gray-100 dark:bg-gray-900 scroll-hidden">
        <SideBar />
        <div className="flex-1 md:p-6 md:pl-0 overflow-y-auto rtl:md:pl-4">
          <div className="bg-white h-full dark:bg-black shadow-xl md:rounded-2xl overflow-scroll border-gray-200 dark:border-gray-700 scroll-hidden">
            {children}
          </div>
        </div>
      </div>
    </ActivePatientProvider>
  )
}

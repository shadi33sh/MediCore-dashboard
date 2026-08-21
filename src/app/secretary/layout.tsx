'use client'
import React from 'react'
import { OutPatientProvider } from './secretaryComponents/OutPatientContext'
import SideBar from './secretaryComponents/SideBar'

export default function SecretaryLayout({ children }: { children: React.ReactNode }) {
  return (
    <OutPatientProvider>
      <div className="flex w-screen h-screen dark:text-white bg-gray-100 dark:bg-gray-900">
        <SideBar />
        <div className="flex-1 md:p-6 md:pl-0 overflow-y-auto rtl:md:pl-4 scroll-hidden">
          <div className="bg-white h-full ml-5 dark:bg-black md:rounded-2xl shadow-xl overflow-scroll border-gray-200 dark:border-gray-700 scroll-hidden relative">
            {children}
          </div>
        </div>
      </div>
    </OutPatientProvider>
  )
}

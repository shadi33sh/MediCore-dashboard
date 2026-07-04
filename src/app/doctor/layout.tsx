'use client'
import React from 'react'
import { ActivePatientProvider } from './doctorComponents/ActivePatientContext'

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ActivePatientProvider>
      {children}
    </ActivePatientProvider>
  )
}

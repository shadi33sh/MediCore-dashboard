'use client'

import React from 'react'
import Link from 'next/link'
import DashboardLayout from '../../admin/managerComponents/adminDashboardLayout'
import { medicalSections } from './medicalSections'

export default function Page() {
  return (
    <DashboardLayout loading={false} title="Medical Sections">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicalSections.map((section, index) => {
          const Icon = section.icon
          return (
            <Link
              key={index}
              href={section.href}
              className={`p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.02] ${section.bg}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <Icon size={27} className="text-white" />
                <h2 className="text-xl font-semibold">{section.name}</h2>
              </div>
              <p className="text-sm opacity-90">{section.description}</p>
            </Link>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
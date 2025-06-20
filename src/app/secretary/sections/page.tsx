'use client'
import React from 'react'
import Link from 'next/link'
import { FaHeartbeat, FaTeeth, FaBaby, FaBrain, FaLungs } from 'react-icons/fa'
import SideBar from '../../admin/managerComponents/adminSideBar'
import DashboardLayout from '../../admin/managerComponents/adminDashboardLayout'

export const medicalSections = [
  {
    name: 'Cardiology',
    icon: FaHeartbeat,
    description: 'Heart and blood vessels care.',
    href: '/Secretary/Sections/Cardiology',
    bg: 'bg-red-500',
  },
  {
    name: 'Dentistry',
    icon: FaTeeth,
    description: 'Teeth and oral health.',
    href: '/Secretary/Sections/Dentistry',
    bg: 'bg-blue-700',
  },
  {
    name: 'Pediatrics',
    icon: FaBaby,
    description: 'Child healthcare services.',
    href: '/Secretary/Sections/Pediatrics',
    bg: 'bg-green-700',
  },
  {
    name: 'Neurology',
    icon: FaBrain,
    description: 'Brain and nervous system.',
    href: '/Secretary/Sections/Neurology',
    bg: 'bg-purple-700',
  },
  {
    name: 'Pulmonology',
    icon: FaLungs,
    description: 'Lung and respiratory care.',
    href: '/Secretary/Sections/Pulmonology',
    bg: 'bg-teal-700',
  },
]

export default function page() {
  return (
    <DashboardLayout title='Medical Sections'>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicalSections.map((section, index) => {
                  const Icon = section.icon // ✅ assign compo
                  return <Link
                  key={index}
                  href={section.href}
                  className={`p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.02] ${section.bg}`}
                  >
                  <div className="flex items-center gap-4 mb-4">
                  <Icon size={27} className="text-white" /> {/* ✅ Render it here */}
                    <h2 className="text-xl font-semibold">{section.name}</h2>
                  </div>
                  <p className="text-sm opacity-90">{section.description}</p>
                </Link>
               })}
            </div>
    </DashboardLayout>
  )
}

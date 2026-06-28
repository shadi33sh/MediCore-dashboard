'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaCalendarAlt,
  FaUserInjured,
  FaUserMd,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from 'react-icons/fa'

import { IoSettings } from "react-icons/io5";
import { motion, AnimatePresence } from 'framer-motion'
import ToggleModeButton from '../../../Components/ToggleModeButton'
import { medicalSections } from '../../secretary/sections/medicalSections'

const sidebarItems = [
  { label: 'Statistisc', icon: <FaCalendarAlt size={18} />, href: '/admin' },
  { label: 'Doctors', icon: <FaUserInjured size={18} />, href: '/admin/doctors' },
]

export default function SideBar() {
  const [showSections, setShowSections] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const [showSettings, setShowSettings] = useState(false)
  const [collapsed, setCollapsed] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const pathname = usePathname()

  const manageItems = [
    { name : 'Create Doctor', href: '/admin/manage/create-doctor' },
    { name : 'Create Secratary', href: '/admin/manage/create-secretary' },
    { name : 'Create Department', href: '/admin/manage/create-department' },
  ]


  // Detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Hamburger Button for Mobile */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-2  rounded-md shadow-md md:hidden"
        >
          <FaBars />
        </button>
      )}

      {/* Overlay for Mobile */}
      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
  
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        onHoverStart={()=>setCollapsed(false)}
        onHoverEnd={()=>setCollapsed(true)}

        animate={{
          x: isMobile ? (mobileOpen ? 0 : '-100%') : 0,
          width: !isMobile && collapsed ? 70 : 300,
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed top-0 left-0 h-full z-50 md:z-auto bg-white dark:bg-gray-900 shadow-lg p-4
          ${isMobile ? 'w-[75%] max-w-sm' : ''} md:static`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img className="w-[40px] h-[40px]" src="/images/Logo.png" alt="Logo" />
              <h1 className="font-extrabold text-2xl dark:text-white text-gray-800">
                <span className="text-Primary">Medi</span>Core
              </h1>
            </div>
          )}
          {/* {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {collapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
            </button>
          )} */}
        </div>

        {/* Mini logo if collapsed */}
        {!isMobile && collapsed && (
          <img className="w-[40px] h-[40px] mb-6 mx-auto" src="/images/Logo.png" alt="Logo" />
        )}

        {/* Sidebar Items */}
        <div className="flex flex-col gap-3">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 font-semibold p-3 rounded-xl transition
                ${isActive ? 'bg-Cyan/70 dark:bg-Primary' : 'bg-gray-700/10 dark:bg-gray-700/40'}
                hover:bg-Cyan/80 dark:hover:bg-Dark`}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}

          {/* Option Toggle */}
          <div
            className={`flex items-center justify-between font-semibold p-3 rounded-xl transition cursor-pointer
              ${pathname.includes('/admin/Sections') ? 'bg-Cyan/70 dark:bg-Primary' : 'bg-gray-700/10 dark:bg-gray-700/40'}
              hover:bg-Cyan/80 dark:hover:bg-Dark`}
          >
            <Link href="/Secretary/Sections" className="flex items-center gap-3">
              <FaUserMd size={18} />
              {!collapsed && <span>Manage</span>}
            </Link>
            {!collapsed && (
              <button onClick={() => setShowOptions(!showOptions)}>
                {showOptions ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </button>
            )}
          </div>

      <AnimatePresence>

          {!collapsed && showOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-4 flex flex-col gap-2"
              >
              {manageItems.map((option, idx) => {
                return (
                  <Link
                    key={idx}
                    href={option.href}
                    className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition`}>
                    <span>{option.name}</span>
                  </Link>
                )
              })}
            </motion.div>
          )}
</AnimatePresence>

          
      <div
            className={`flex items-center justify-between font-semibold p-3 rounded-xl transition cursor-pointer
              ${pathname.includes('/Secretary/Sections') ? 'bg-Cyan/70 dark:bg-Primary' : 'bg-gray-700/10 dark:bg-gray-700/40'}
              hover:bg-Cyan/80 dark:hover:bg-Dark`}
          >
            <Link href="/Secretary/Sections" className="flex items-center gap-3">
              <FaUserMd size={18} />
              {!collapsed && <span>Sections</span>}
            </Link>
            {!collapsed && (
              <button onClick={() => setShowSections(!showSections)}>
                {showSections ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </button>
            )}
          </div>

          <AnimatePresence>
          {!collapsed && showSections && (
            <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-4 flex flex-col gap-2"
            >
              {medicalSections.map((section, idx) => {
                const Icon = section.icon
                return (
                  <Link
                  key={idx}
                  href={section.href}
                  className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition
                    ${pathname.includes(section.name) ? 'bg-gray-700/10' : ''}
                    hover:bg-gray-700/10 dark:hover:bg-gray-700`}
                    >
                    <Icon size={16} />
                    <span>{section.name}</span>
                  </Link>
                )
              })}
            </motion.div>
          )}
          </AnimatePresence>

          {/* Settings Button */}
          <div
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-3 font-semibold p-3 rounded-xl transition cursor-pointer
            hover:bg-Cyan/80 dark:hover:bg-Dark"
          >
            <IoSettings size={18} />
            {!collapsed && <span>Settings</span>}
          </div>
        </div>
      </motion.div>




      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowSettings(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/3 left-1/2 w-[90%] md:w-[50%] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg z-50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-3 right-4 text-xl hover:text-red-400 transition"
              >
                &times;
              </button>
              <h1 className="text-xl font-bold mb-4">Settings</h1>
              <ToggleModeButton />
              <button className="mt-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-left">
                Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
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
  FaTimes,
} from 'react-icons/fa'
import { IoSettings } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import ToggleModeButton from '../../../Components/ToggleModeButton'
import { medicalSections } from '../../secretary/sections/medicalSections'

const sidebarItems = [
  { label: 'Home Page', icon: <FaCalendarAlt size={18} />, href: '/admin' },
  { label: 'Doctors', icon: <FaUserInjured size={18} />, href: '/admin/doctors' },
]



export default function SideBar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showManage, setShowManage] = useState(false)
  const [showSections, setShowSections] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setMobileOpen(false)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && mobileOpen) {
        setMobileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])

  const handleMobileNavigation = () => {
    if (isMobile) setMobileOpen(false)
  }

  return (
    <>
      {isMobile && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 md:hidden"
        >
          <FaBars size={18} className="text-gray-700 dark:text-gray-300" />
        </motion.button>
      )}

      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{
          x: isMobile ? (mobileOpen ? 0 : '-100%') : 0,
          width: !isMobile && collapsed ? 80 : 320,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className={`fixed top-0 left-0 h-full z-50 md:z-auto bg-white dark:bg-gray-900 shadow-xl overflow-hidden ${isMobile ? 'w-[85%] max-w-sm' : ''} md:static`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img className="w-11 h-11" src="/images/Logo.png" alt="Logo" />
                <div>
                  <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Medi<span className="text-Primary">Core</span></h1>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              {!isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {collapsed ? <FaChevronRight size={16} className="text-gray-600 dark:text-gray-300" /> : <FaChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />}
                </motion.button>
              )}
              {isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaTimes size={16} className="text-gray-600 dark:text-gray-300" />
                </motion.button>
              )}
            </div>
          </div>

          {!isMobile && collapsed && (
            <div className="p-4 flex justify-center">
              <img className="w-10 h-10" src="/images/Logo.png" alt="Logo" />
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {sidebarItems.map((item, index) => {
                const isActive = pathname === item.href
                return (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
                    <Link
                      href={item.href}
                      onClick={handleMobileNavigation}
                      className={`flex items-center gap-3 font-semibold p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-Primary text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                      <span className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>{item.icon}</span>
                      {!collapsed && <span className="flex-1">{item.label}</span>}
                    </Link>
                  </motion.div>
                )
              })}

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (sidebarItems.length + 1) * 0.04 }}>
                <div className={`rounded-xl transition-all duration-200 ${pathname.includes('/secretary/sections') ? 'bg-Primary text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  <div className="flex items-center justify-between gap-3 p-3 cursor-pointer" onClick={() => setShowSections(!showSections)}>
                    <div className="flex items-center gap-3 font-semibold">
                      <FaUserMd size={18} />
                      {!collapsed && <span>Sections</span>}
                    </div>
                    {!collapsed && <span>{showSections ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}</span>}
                  </div>
                </div>
                {!collapsed && showSections && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="ml-4 flex flex-col gap-2 overflow-hidden">
                    {medicalSections.map((section, idx) => {
                      const Icon = section.icon
                      const isActive = pathname === section.href
                      return (
                        <Link
                          key={idx}
                          href={section.href}
                          onClick={handleMobileNavigation}
                          className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                          <Icon size={16} />
                          <span>{section.name}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </motion.div>

              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-3 font-semibold p-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <IoSettings size={18} />
                {!collapsed && <span>Settings</span>}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

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

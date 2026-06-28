'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from 'react-icons/fa'
import { IoSettings } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import ToggleModeButton from '../../../Components/ToggleModeButton'
import {
  MdCalendarToday,
  MdPeople,
  MdArticle,
  MdSmartToy,
  MdLogout,
} from 'react-icons/md'

const sidebarItems = [
  { label: 'Appointments', icon: <MdCalendarToday size={18} />, href: '/doctor', badge: '3' },
  { label: 'Patients',     icon: <MdPeople size={18} />,        href: '/doctor/patients' },
  { label: 'Articles',     icon: <MdArticle size={18} />,       href: '/doctor/articles' },
  { label: 'Chat Bot AI',  icon: <MdSmartToy size={18} />,      href: '/doctor/chatbot', pill: 'AI' },
]

const doctor = {
  name: 'Dr. Sara Khoury',
  initials: 'SK',
  section: 'Cardiology',
  rating: 4.8,
}

export default function SideBar() {
  const [showSettings, setShowSettings] = useState(false)
  const [collapsed, setCollapsed]       = useState(false)
  const [isMobile, setIsMobile]         = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)

  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fullStars  = Math.floor(doctor.rating)
  const hasHalf    = doctor.rating % 1 !== 0

  return (
    <>
      {/* Hamburger – mobile only */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-5 left-4 z-50 p-2 rounded-md shadow-md md:hidden
                     bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Mobile overlay */}
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

      {/* ── Sidebar ── */}
      <motion.div
        animate={{
          x:     isMobile ? (mobileOpen ? 0 : '-100%') : 0,
          width: !isMobile && collapsed ? 70 : 260,
        }}
        transition={{ type: 'tween', duration: 0.25 }}
        className={`
          fixed top-0 left-0 h-full z-50 md:z-auto md:static
          flex flex-col
          bg-white dark:bg-gray-900
          border- border-gray-200 dark:border-gray-800
          ${isMobile ? 'w-[75%] max-w-sm' : ''}
          p-3 overflow-hidden
        `}
      >
        {/* ── Logo row ── */}
        <div className="flex items-center gap-3 px-2 mb-5">
          {!collapsed && (
            <>
              {/* Logo mark */}
       
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                <span className="text-teal-600">Medi</span>Core
              </span>
            </>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center mx-auto">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
          )}
          {!isMobile && !collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="ml-auto p-1.5 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Collapse sidebar"
            >
              <FaChevronLeft size={13} />
            </button>
          )}
          {!isMobile && collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="mt-2 p-1.5 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition mx-auto"
              aria-label="Expand sidebar"
            >
              <FaChevronRight size={13} />
            </button>
          )}
        </div>

        {/* ── Doctor card ── */}
        {!collapsed ? (
          <div className="
            relative mx-1 mb-5 p-3 rounded-xl
            bg-gray-50 dark:bg-gray-900
            border border-gray-200 dark:border-gray-800
            flex items-center gap-3
            overflow-hidden
          ">
            {/* Left accent bar */}
            <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-teal-500 rounded-r-full" />

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="
                w-11 h-11 rounded-full
                bg-teal-50 dark:bg-teal-950
                border-2 border-teal-500
                flex items-center justify-center
                text-sm font-bold text-teal-600 dark:text-teal-400
              ">
                {doctor.initials}
              </div>
              {/* Online dot */}
              <span className="
                absolute bottom-0 right-0
                w-2.5 h-2.5 rounded-full bg-emerald-500
                border-2 border-white dark:border-gray-950
              " />
            </div>

            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                {doctor.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {doctor.section}
              </p>
              <p className="text-xs text-amber-400 mt-1 tracking-wide">
                {'★'.repeat(fullStars)}{hasHalf ? '½' : ''}
                <span className="text-gray-400 dark:text-gray-500 ml-1">{doctor.rating}</span>
              </p>
            </div>
          </div>
        ) : (
          /* Collapsed avatar */
          <div className="relative mx-auto mb-4 flex-shrink-0 w-fit">
            <div className="
              w-9 h-9 rounded-full
              bg-teal-50 dark:bg-teal-950
              border-2 border-teal-500
              flex items-center justify-center
              text-xs font-bold text-teal-600 dark:text-teal-400
            ">
              {doctor.initials}
            </div>
            <span className="
              absolute bottom-0 right-0
              w-2 h-2 rounded-full bg-emerald-500
              border-2 border-white dark:border-gray-950
            " />
          </div>
        )}

        {/* ── Nav section label ── */}
        {!collapsed && (
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-600">
            Main
          </p>
        )}

        {/* ── Nav items ── */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg
                  text-sm font-medium transition-colors duration-150
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'text-teal-700 dark:text-teal-300 font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-800 dark:hover:text-gray-200'
                  }
                `}
              >
                {/* Active accent bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-teal-500 rounded-r-full" />
                )}

                <span className={`flex-shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] font-bold bg-teal-600 text-white rounded-full px-2 py-0.5 leading-tight">
                        {item.badge}
                      </span>
                    )}
                    {item.pill && (
                      <span className="ml-auto text-[10px] font-bold bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 rounded-full px-2 py-0.5 leading-tight">
                        {item.pill}
                      </span>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Divider ── */}
        <div className="my-3 border-t border-gray-200 dark:border-gray-800" />

        {/* ── Account section ── */}
        {!collapsed && (
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-600">
            Account
          </p>
        )}

        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => setShowSettings(true)}
            className={`
              flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg w-full
              text-sm font-medium text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-900
              hover:text-gray-800 dark:hover:text-gray-200
              transition-colors duration-150
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <IoSettings size={18} className="flex-shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>

          <button
            className={`
              flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg w-full
              text-sm font-medium text-red-400 dark:text-red-500
              hover:bg-red-50 dark:hover:bg-red-950/30
              transition-colors duration-150
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <MdLogout size={18} className="flex-shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </motion.div>

      {/* ── Settings Modal ── */}
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
              className="
                fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[90%] md:w-[420px]
                bg-white dark:bg-gray-900
                rounded-2xl p-6 shadow-2xl z-50
                border border-gray-200 dark:border-gray-800
              "
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1,    opacity: 1 }}
              exit={{ scale: 0.95,    opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400
                             hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 transition text-lg"
                >
                  ×
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Dark mode</span>
                  <ToggleModeButton />
                </div>

                <button className="
                  flex items-center gap-2 w-full px-3 py-2.5 rounded-xl
                  text-sm text-red-500
                  hover:bg-red-50 dark:hover:bg-red-950/30
                  transition text-left
                ">
                  <MdLogout size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
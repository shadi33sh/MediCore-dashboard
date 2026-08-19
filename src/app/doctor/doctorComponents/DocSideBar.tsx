'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes,
} from 'react-icons/fa'
import { IoSettings } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdCalendarToday,
  MdPeople,
  MdArticle,
  MdSmartToy,
} from 'react-icons/md'
import SettingsModal from '../../../Components/SettingsModal'

import { useTranslation } from "react-i18next"

export default function SideBar() {
  const { t } = useTranslation();

  const sidebarItems = [
    { label: t("Doctor.Sidebar.Appointments", "Appointments"), icon: <MdCalendarToday size={18} />, href: '/doctor', badge: '3' },
    { label: t("Doctor.Sidebar.Patients", "Patients"), icon: <MdPeople size={18} />, href: '/doctor/patients' },
    { label: t("Doctor.Sidebar.Articles", "Articles"), icon: <MdArticle size={18} />, href: '/doctor/articles' },
    { label: t("Doctor.Sidebar.ChatBotAI", "Chat Bot AI"), icon: <MdSmartToy size={18} />, href: '/doctor/chatbot', pill: 'AI' },
  ]
  const [showSettings, setShowSettings] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const pathname = usePathname()
  const router = useRouter()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // ── Load user from localStorage ──────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) setUser(JSON.parse(stored))
    } catch { setUser(null) }
  }, [])

  // ── Responsive ───────────────────────────────────────────────────────────
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

  // ── Click-outside to close on mobile ─────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && mobileOpen)
        setMobileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen])



  // Derived user display values
  const firstName = user?.first_name ?? ''
  const lastName = user?.last_name ?? ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Doctor'
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || 'DR'
  const email = user?.email ?? ''
  const role = user?.role ?? 'Doctor'

  return (
    <>
      {/* ── Hamburger (mobile) ── */}
      {isMobile && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(true)}
          className="fixed top-5 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 md:hidden"
        >
          <FaBars size={18} className="text-gray-700 dark:text-gray-300" />
        </motion.button>
      )}

      {/* ── Mobile overlay ── */}
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

      {/* ── Sidebar panel ── */}
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{
          x: isMobile ? (mobileOpen ? 0 : '-100%') : 0,
          width: !isMobile && collapsed ? 80 : 280,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 h-full z-50 md:z-auto bg-gray-100 dark:bg-gray-900 
          ${isMobile ? 'w-[85%] max-w-sm' : ''} md:static overflow-hidden flex flex-col`}
      >

        {/* ── Logo row ── */}
        <div className="flex items-center justify-between p-5">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <img className="w-9 h-9" src="/images/Logo.png" alt="Logo" />
              <h1 className="font-bold text-xl dark:text-white">
                Medi<span className="text-Primary">Core</span>
              </h1>
            </motion.div>
          )}

          {collapsed && !isMobile && (
            <div className="w-9 h-9 mx-auto">
              <img className="w-full h-full" src="/images/Logo.png" alt="Logo" />
            </div>
          )}

          <div className="flex items-center gap-1">
            {!isMobile && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {collapsed
                  ? <FaChevronRight size={14} className="text-gray-500 dark:text-gray-400" />
                  : <FaChevronLeft size={14} className="text-gray-500 dark:text-gray-400" />}
              </motion.button>
            )}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FaTimes size={14} className="text-gray-500 dark:text-gray-400" />
              </motion.button>
            )}
          </div>
        </div>

        {/* ── Doctor profile card ── */}
        {!collapsed ? (
          <div className="mx-3 mb-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center gap-3 relative overflow-hidden">
            {/* Accent bar */}
            <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-Primary rounded-r-full" />

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full bg-Primary/10 border-2 border-Primary flex items-center justify-center text-sm font-bold text-Primary">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800" />
            </div>

            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                {fullName}
              </p>
              <p className="text-xs text-Primary mt-0.5 capitalize">{role}</p>
              {email && (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{email}</p>
              )}
            </div>
          </div>
        ) : (
          /* Collapsed mini-avatar */
          <div className="relative mx-auto mb-4 flex-shrink-0 w-fit">
            <div className="w-9 h-9 rounded-full bg-Primary/10 border-2 border-Primary flex items-center justify-center text-xs font-bold text-Primary">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
          </div>
        )}

        {/* ── Nav label ── */}
        {!collapsed && (
          <p className="px-5 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-600">
            {t("Doctor.Sidebar.Main", "Main")}
          </p>
        )}

        {/* ── Nav items ── */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  onClick={() => isMobile && setMobileOpen(false)}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200
                    ${collapsed ? 'justify-center' : ''}
                    ${isActive
                      ? 'bg-Primary text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  {/* Active left bar (only when not collapsed) */}
                  {isActive && !collapsed && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-white/60 rounded-r-full" />
                  )}

                  <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-Primary'}`}>
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 leading-tight ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                          {item.badge}
                        </span>
                      )}
                      {item.pill && (
                        <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 leading-tight border ${isActive ? 'bg-white/20 border-white/30 text-white' : 'bg-Primary/10 border-Primary/20 text-Primary'}`}>
                          {item.pill}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* ── Bottom section ── */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowSettings(true)}
            className={`w-full flex items-center gap-3 font-medium p-3 rounded-xl transition-all duration-200
              text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
              ${collapsed ? 'justify-center' : ''}`}
          >
            <IoSettings size={18} />
            {!collapsed && <span className="text-sm">{t("Doctor.Sidebar.Settings", "Settings")}</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Settings Modal ── */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        compactSidebar={collapsed}
        onToggleCompactSidebar={() => setCollapsed(!collapsed)}
      />
    </>
  )
}
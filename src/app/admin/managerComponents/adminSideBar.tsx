'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'

import { IoSettings } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCalendarAlt,
  FaUserInjured,
  FaUserMd,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa'
import SettingsModal from '../../../Components/SettingsModal'
import { useTranslation } from "react-i18next"
import Link from 'next/link'

export default function SideBar() {
  const { t } = useTranslation();

  const sidebarItems = [
    { label: t('Admin.Sidebar.homePage', 'Home Page'), icon: <FaCalendarAlt size={18} />, href: '/admin' },
    { label: t('Admin.Sidebar.doctors', 'Doctors'), icon: <FaUserInjured size={18} />, href: '/admin/doctors' },
    { label: t('Admin.Sidebar.departments', 'Departments'), icon: <FaUserMd size={18} />, href: '/admin/departments' },
  ];

  const [showSettings, setShowSettings] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const pathname = usePathname()
  const router = useRouter()
  const sidebarRef = useRef<HTMLDivElement>(null)

  // ── Load user & collapsed state from localStorage ──────────────────────────
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) setUser(JSON.parse(storedUser))
    } catch { setUser(null) }

    try {
      const storedCollapsed = localStorage.getItem('adminSidebarCollapsed')
      if (storedCollapsed !== null) {
        setCollapsed(JSON.parse(storedCollapsed))
      }
    } catch { }
  }, [])

  const handleToggleCollapse = () => {
    const newVal = !collapsed
    setCollapsed(newVal)
    localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newVal))
  }

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
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Admin'
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || 'AD'
  const email = user?.email ?? ''
  const role = user?.role ?? 'Administrator'

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
        initial={{ width: !isMobile && collapsed ? 50 : 280 }}
        animate={{
          x: isMobile ? (mobileOpen ? 0 : '-100%') : 0,
          width: !isMobile && collapsed ? 50 : 280,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 max-w-[230px] w-[200px] h-full z-50 md:z-auto bg-gray-100 dark:bg-gray-900 
          ${isMobile ? 'w-[85%] max-w-sm' : ''} md:static overflow-hidden flex flex-col`}
      >

        {/* ── Logo row ── */}
        <div className={`flex items-center p-5 ${collapsed && !isMobile ? 'justify-center flex-col gap-5' : 'justify-between'}`}>
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
            <div className="w-9 h-9">
              <img className="w-full h-full" src="/images/Logo.png" alt="Logo" />
            </div>
          )}

          <div className="flex items-center gap-1">
            {!isMobile && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleCollapse}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {collapsed
                  ? <FaChevronRight size={14} className="text-gray-500 dark:text-gray-400 rtl:rotate-180" />
                  : <FaChevronLeft size={14} className="text-gray-500 dark:text-gray-400 rtl:rotate-180" />}
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

        {/* ── Admin profile card ── */}
        {!collapsed ? (
          <div className="mx-3 mb-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center gap-3 relative overflow-hidden">
            {/* Accent bar */}
            <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-Primary rounded-r-full" />

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full bg-Primary/10 border-2 border-Primary flex items-center justify-center text-sm font-bold text-Primary overflow-hidden">
                {user?.img_path || user?.avatar ? (
                  <img src={user.img_path || user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <span className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                {fullName}
              </p>
              <p className="text-xs text-Primary mt-0.5 capitalize">{role}</p>
              {email && (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate mt-0.5">{email}</p>
              )}
            </div>

            <div className="p-1.5 text-gray-400">
              <FaShieldAlt size={14} />
            </div>
          </div>
        ) : (
          /* Collapsed mini-avatar */
          <div className="relative mx-auto mb-4 flex-shrink-0 w-fit">
            <div className="w-9 h-9 rounded-full bg-Primary/10 border-2 border-Primary flex items-center justify-center text-xs font-bold text-Primary overflow-hidden">
              {user?.img_path || user?.avatar ? (
                <img src={user.img_path || user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <span className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
          </div>
        )}

        {/* ── Nav label ── */}
        {!collapsed && (
          <p className="px-5 mb-1.5 text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-600">
            {t("Admin.Sidebar.Main", "Main")}
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
                    </>
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
            {!collapsed && <span className="text-sm">{t("Admin.Sidebar.settings", "Settings")}</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Settings Modal ── */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        compactSidebar={collapsed}
        onToggleCompactSidebar={handleToggleCollapse}
      />
    </>
  )
}

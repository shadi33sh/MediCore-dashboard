'use client'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {FaCalendarAlt,FaUserInjured,FaUserMd,FaChevronDown,FaChevronUp,FaChevronLeft,FaChevronRight,FaBars,} from 'react-icons/fa'
import { IoChatbox, IoSettings } from "react-icons/io5";
import { medicalSections } from '../../secretary/sections/page'
import { motion, AnimatePresence } from 'framer-motion'
import ToggleModeButton from '../../../Components/ToggleModeButton'
import { MdChat, MdChatBubbleOutline, MdOutlineChat } from 'react-icons/md'

const sidebarItems = [
  { label: 'Appointments', icon: <FaCalendarAlt size={18} />, href: '/doctor' },
  { label: 'Patients', icon: <FaUserInjured size={18} />, href: '/doctor/patients' },
  { label: 'Articles', icon: <FaUserInjured size={18} />, href: '/doctor/articles' },
  { label: 'Chat Bot AI', icon: <MdChat size={18} />, href: '/doctor/chatbot' },


]

const doctor =  {
  name: 'Sara Khoury',
  section: 'Cardiology',
  rating: 4.8,
  image: '/images/DOC 1.jpg',
}

export default function SideBar() {
  const [showSections, setShowSections] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)



  

  const pathname = usePathname()

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
          className="fixed top-5 left-4 z-50 p-2  rounded-md shadow-md md:hidden"
        >
          <FaBars size={20}/>
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
        initial={{width : '-100%'}}
        animate={{
          x: isMobile ? (mobileOpen ? 0 : '-100%') : 0,
          width: !isMobile && collapsed ? 70 : 300,
        }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed top-0 left-0 h-full z-50 md:z-auto bg-gray-200 dark:bg-gray-900  p-4
          ${isMobile ? 'w-[75%] max-w-sm' : ''} md:static`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img className="w-[40px] h-[40px]" src="/images/Logo.png" alt="Logo" />
              <h1 className="font-extrabold text-4xl dark:text-white text-gray-800">
                <span className="text-Primary">Medi</span>Core
              </h1>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2  rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              {collapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Mini logo if collapsed */}
        {!isMobile && collapsed && (
          <img className="w-[40px] h-[40px] mb-4 mx-auto" src="/images/Logo.png" alt="Logo" />
        )}

        {/* Sidebar Items */}

        {/* Doctor Info Card */}

        {!collapsed && (
          <div className="my-3 p-2 flex items-center gap-6 bg-gray-700/10 dark:bg-gray-700/40 rounded-xl">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-[60px] rounded-full border-2 border-teal-400"
            />
            <h3 style={{letterSpacing :  1}} className="text-xl font-extrabold text-gray-800 dark:text-white">
              {doctor.name}
              
              <div className="mt-1 text-yellow-400 text-sm">
                {'★'.repeat(Math.floor(doctor.rating))}{doctor.rating % 1 !== 0 && '½'}
              
              </div>
            </h3>
          </div>
        )}

          {collapsed && (
              <img
                src={doctor.image}
                alt={doctor.name}
                className=" mb-3 w-10 h-10 rounded-full border-2 border-teal-400"
              />
          )}
          

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

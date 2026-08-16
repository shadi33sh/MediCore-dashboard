"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUserInjured,
  FaUserMd,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaList,
  FaBoxes,
  FaTimes,
  FaHome,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaPalette,
  FaLanguage,
  FaShieldAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  IoDocument,
  IoSettings,
  IoTabletLandscape,
  IoTabletPortrait,
  IoNotifications,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import ToggleModeButton from "../../../Components/ToggleModeButton";
import AddMounthlyWorkDays from "./AddmounthlyLeave";
import { medicalSections } from "../sections/medicalSections";
import SettingsModal from "../../../Components/SettingsModal";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <FaHome size={18} />,
    href: "/secretary",
    badge: null,
  },
  // { label: 'Statistics', icon: <FaCalendarAlt size={18} />, href: '/secretary/statistics', badge: null },
  {
    label: "Schedules",
    icon: <FaCalendarAlt size={18} />,
    href: "/secretary/schedules",
    badge: "3",
  },
  {
    label: "Doctors",
    icon: <FaUserInjured size={18} />,
    href: "/secretary/doctors",
    badge: null,
  },
  // { label: 'Appointments', icon: <IoDocument size={18} />, href: '/secretary/appointments', badge: '12' },
];



export default function EnhancedSideBar() {
  const [showSections, setShowSections] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReserveForm, setReserve] = useState(false);
  const [showPatienfForm, setPatienform] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [settingsTab, setSettingsTab] = useState("profile");
  const navigator = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const searchRef = useRef(null);

  // Detect mobile and handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside for mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        mobileOpen
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  // Auto-collapse on mobile navigation
  const handleMobileNavigation = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Filter items based on search
  const filteredItems = sidebarItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Hamburger Button for Mobile */}
      {isMobile && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(true)}
          className="fixed top-5 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 md:hidden"
        >
          <FaBars size={20} className="text-gray-700 dark:text-gray-300" />
        </motion.button>
      )}

      {/* Overlay for Mobile */}
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

      {/* Sidebar */}
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{
          x: isMobile ? (mobileOpen ? 0 : "-100%") : 0,
          width: !isMobile && collapsed ? 80 : 320,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed top-0 max-w-[220px] left-0 h-full z-50 md:z-auto bg-gray-100 dark:bg-gray-900 
md:static overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            {!collapsed && (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center">
                  <img
                    className="w-12 h-12"
                    src="/images/Logo.png"
                    alt="Logo"
                  />
                </div>
                <h1 className="font-bold text-2xl dark:text-white">
                  Medi
                  <span className="text-Primary">Core</span>
                </h1>
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              {!isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {collapsed ? (
                    <FaChevronRight
                      size={16}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  ) : (
                    <FaChevronLeft
                      size={16}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  )}
                </motion.button>
              )}

              {isMobile && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <FaTimes
                    size={16}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </motion.button>
              )}
            </div>
          </div>

          {/* Mini logo if collapsed */}
          {!isMobile && collapsed && (
            <div className="p-4 flex justify-center">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                <img className="w-6 h-6" src="/images/Logo.png" alt="Logo" />
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-2">
              {(searchQuery ? filteredItems : sidebarItems).map(
                (item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onHoverStart={() => setHoveredItem(index)}
                      onHoverEnd={() => setHoveredItem(null)}
                    >
                      <Link
                        href={item.href}
                        onClick={handleMobileNavigation}
                        className={`flex items-center gap-3 font-medium p-3 rounded-xl transition-all duration-200 relative group
                      ${isActive
                            ? "bg-Primary/10  text-Primary"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                      >
                        <span
                          className={`${isActive ? "text-Primary" : "text-gray-500 dark:text-gray-400 group-hover:text-Primary dark:group-hover:text-blue-400"} transition-colors`}
                        >
                          {item.icon}
                        </span>

                        {!collapsed && (
                          <>
                            <span className="flex-1 text-sm font-semibold">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`px-2 py-1 text-xs font-bold rounded-full ${isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-red-500 text-white"
                                  }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}

                        {collapsed && item.badge && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                },
              )}

              {/* Sections Toggle */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: sidebarItems.length * 0.05 }}
                className={`rounded-xl transition-all duration-200 ${pathname.includes("/secretary/sections")
                  ? "bg-gradient-to-r from-Primary to-purple-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <div className="flex items-center">
                  <Link
                    href="/secretary/sections"
                    onClick={handleMobileNavigation}
                    className="flex items-center gap-3 font-medium p-3 flex-1"
                  >
                    <FaUserMd size={18} />
                    {!collapsed && <span className="flex-1 text-sm font-semibold" >Sections</span>}
                  </Link>
                  {/* {!collapsed && (
                    <button
                      onClick={() => setShowSections(!showSections)}
                      className="p-3 hover:bg-black/10 rounded-r-xl transition-colors"
                    >
                      {showSections ? (
                        <FaChevronUp size={14} />
                      ) : (
                        <FaChevronDown size={14} />
                      )}
                    </button>
                  )} */}
                </div>
              </motion.div>

              {/* Section List */}
              {/* <AnimatePresence>
                {!collapsed && showSections && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-6 space-y-1 overflow-hidden"
                  >
                    {medicalSections.map((section, idx) => {
                      const Icon = section.icon;
                      const isActive = pathname.includes(section.name);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Link
                            href={section.href}
                            onClick={handleMobileNavigation}
                            className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-2 border-Primary"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                              }`}
                          >
                            <Icon size={16} />
                            <span>{section.name}</span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence> */}

              {/* Schedule Appointment Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (sidebarItems.length + 1) * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setReserve(true)}
                className="w-full flex items-center gap-3 font-medium p-3 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 hover:text-white group"
              >
                <FaBoxes
                  size={18}
                  className="group-hover:text-white transition-colors"
                />
                {!collapsed && <span className=" text-sm font-semibold" >Schedule Appointmen</span>}
              </motion.button>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSettings(true)}
              className="w-full flex items-center gap-3 font-medium p-3 rounded-xl transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <IoSettings size={18} />
              {!collapsed && <span>Settings</span>}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        compactSidebar={collapsed}
        onToggleCompactSidebar={() => setCollapsed(!collapsed)}
      />

      <AnimatePresence>
        {showReserveForm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 overflow-scroll center"
              onClick={() => setReserve(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="absolute overflow-hidden rounded-xl p-6 shadow-lg z-50 w-[90%] mt-[10vh] left-[5%] bg-white dark:bg-gray-800 h-fit"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setReserve(false)}
                className="absolute top-3 right-4 text-xl hover:text-red-400 transition"
              >
                {" "}
                &times;
              </button>
              <AddMounthlyWorkDays />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

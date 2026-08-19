'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaTimes,
} from 'react-icons/fa';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  compactSidebar?: boolean;
  onToggleCompactSidebar?: () => void;
}

export default function SettingsModal({ isOpen, onClose, compactSidebar, onToggleCompactSidebar }: SettingsModalProps) {
  const [user, setUser] = useState<any>(null);
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const navigator = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigator.push('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl bg-white dark:bg-[#1a1f2c] rounded-[2rem] shadow-2xl z-[70] overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('SettingsModal.title', 'Settings')}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-8 custom-scrollbar">

              {/* Profile Section */}
              {user && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5">
                    <div className="w-16 h-16 bg-gradient-to-br from-Primary to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <FaUserCircle size={32} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-gray-800 dark:text-white">
                        {user.first_name || user.name} {user.last_name}
                      </h4>
                      <p className="text-sm font-medium text-Primary capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 dark:bg-white/5 p-3 px-4 rounded-2xl">
                      <label className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-0.5">{t('SettingsModal.firstName', 'First Name')}</label>
                      <input
                        readOnly
                        value={user.first_name || user.name || ''}
                        type="text"
                        className="w-full bg-transparent text-gray-800 dark:text-white font-semibold text-sm focus:outline-none"
                      />
                    </div>
                    <div className="bg-gray-50/50 dark:bg-white/5 p-3 px-4 rounded-2xl">
                      <label className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-0.5">{t('SettingsModal.lastName', 'Last Name')}</label>
                      <input
                        readOnly
                        value={user.last_name || ''}
                        type="text"
                        className="w-full bg-transparent text-gray-800 dark:text-white font-semibold text-sm focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2 bg-gray-50/50 dark:bg-white/5 p-3 px-4 rounded-2xl">
                      <label className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-0.5">{t('SettingsModal.emailAddress', 'Email Address')}</label>
                      <input
                        readOnly
                        value={user.email || ''}
                        type="email"
                        className="w-full bg-transparent text-gray-800 dark:text-white font-semibold text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Section */}
              <div className="space-y-3">
                <h3 className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-1">{t('SettingsModal.preferences', 'Preferences')}</h3>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm dark:text-white">{t('SettingsModal.language', 'Language')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('SettingsModal.selectLanguage', 'Select preferred language')}</p>
                  </div>
                  <select
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    className="p-2 px-4 rounded-xl bg-white dark:bg-white/10 shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-200 focus:outline-none cursor-pointer border-none"
                  >
                    <option value="en" className="dark:bg-gray-800">{t('SettingsModal.english', 'English')}</option>
                    <option value="ar" className="dark:bg-gray-800">{t('SettingsModal.arabic', 'Arabic')}</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm dark:text-white">{t('SettingsModal.darkMode', 'Dark Mode')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('SettingsModal.toggleDarkMode', 'Toggle light / dark theme')}</p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`w-14 h-7 rounded-full transition-colors flex items-center px-1 ${isDark ? 'bg-Primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isDark ? 'translate-x-7' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>

                {onToggleCompactSidebar && (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/5">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm dark:text-white">{t('SettingsModal.compactSidebar', 'Compact Sidebar')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('SettingsModal.collapseSidebar', 'Collapse the main sidebar')}</p>
                    </div>
                    <button
                      onClick={onToggleCompactSidebar}
                      className={`w-14 h-7 rounded-full transition-colors flex items-center px-1 ${compactSidebar ? 'bg-Primary' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${compactSidebar ? 'translate-x-7' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Logout */}
            <div className="p-6 pt-4 bg-gray-50/30 dark:bg-white/[0.02]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold transition-all"
              >
                <FaSignOutAlt size={18} />
                <span>{t('SettingsModal.signOut', 'Sign Out')}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

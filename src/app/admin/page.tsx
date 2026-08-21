'use client'
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserMd, FaStethoscope, FaChartLine, FaArrowUp, FaArrowDown, FaPlus, FaCalendarAlt, FaCalendarCheck, FaClock, FaTimesCircle, FaStar, FaUserTie } from "react-icons/fa";
import DashboardLayout from "./managerComponents/adminDashboardLayout";
import CreateDoctorModal from "./manage/CreateDoctorModal";
import CreateSecretaryModal from "./manage/CreateSecretaryModal";
import CreateDepartmentModal from "./manage/CreateDepartmentModal";
import { useTranslation } from "react-i18next";
import axiosInstance from "../AuthAxios";
import { useAlert } from "../../Components/Alert";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

// UI Configurations to map API data to React Icons and Tailwind Colors
const overviewUiConfig = [
  { icon: FaUsers, color: 'from-blue-500 to-indigo-600' },
  { icon: FaUserMd, color: 'from-emerald-500 to-teal-600' },
  { icon: FaStethoscope, color: 'from-orange-400 to-pink-500' },
  { icon: FaCalendarCheck, color: 'from-violet-500 to-purple-600' },
];

const activityUiConfig: Record<string, { icon: React.ElementType, color: string }> = {
  appointment_booked: { icon: FaCalendarAlt, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400" },
  patient_registered: { icon: FaUsers, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" },
  appointment_canceled: { icon: FaTimesCircle, color: "text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400" },
  new_doctor: { icon: FaUserMd, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400" },
};

export default function Page() {
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isSecretaryModalOpen, setIsSecretaryModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axiosInstance.get('api/admin/dashboard/statistics');
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        showAlert("error", "Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <DashboardLayout loading={loading} title={t('Admin.Dashboard.title', "Clinic Statistics Overview")}>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={() => setIsDoctorModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl shadow-lg hover:opacity-90 transition">
          <FaPlus size={14} />
          <p className="font-semibold">
            {t('Admin.Dashboard.buttons.createDoctor', 'Create Doctor')}
          </p>
        </button>
        <button onClick={() => setIsSecretaryModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:opacity-90 transition">
          <FaPlus size={14} />
          <p className="font-semibold">
            {t('Admin.Dashboard.buttons.createSecretary', 'Create Secretary')}
          </p>
        </button>
        <button onClick={() => setIsDepartmentModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl shadow-lg hover:opacity-90 transition">
          <FaPlus size={14} />
          <p className="font-semibold">
            {t('Admin.Dashboard.buttons.createDepartment', 'Create Department')}
          </p>
        </button>
      </div>

      {dashboardData && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardData.overviewStats?.map((stat: any, index: number) => {
              const uiConfig = overviewUiConfig[index % overviewUiConfig.length];
              const Icon = uiConfig.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={stat.id}
                  className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-200/0 "
                >
                  <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${uiConfig.color} rounded-full opacity-10 blur-2xl`}></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">{t(stat.titleKey, stat.defaultTitle)}</p>
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${uiConfig.color} text-white shadow-lg`}>
                      <Icon size={20} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Patient Visits Area Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-200/0 "
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('Admin.Dashboard.charts.visitsOverview', 'Patient Visits Overview')}</h3>

              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData.patientVisitsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Top Rated Doctors */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-200/0  flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('Admin.Dashboard.sections.topRatedDoctors', 'Top Rated Doctors')}</h3>
              </div>
              <div className="space-y-5 flex-1 overflow-y-auto max-h-72 pr-2">
                {dashboardData.topDoctors?.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transitilg border border-transparent hover dark:border-gray-200/0:border-gray-100 dark:">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shrink-0">
                      {doc.avatar}
                    </div>
                    <div className="flex-1 truncate">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white truncate">{doc.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{doc.specialty}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="flex items-center text-sm font-bold text-amber-500">
                        {doc.rating} <FaStar className="ml-1 mb-0.5" size={12} />
                      </span>
                      <span className="text-xs text-gray-400">({doc.reviews})</span>
                    </div>
                  </div>
                ))}
                {(!dashboardData.topDoctors || dashboardData.topDoctors.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">{t('Admin.Dashboard.sections.noDoctors', 'No top doctors found')}</p>
                )}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Active Secretaries */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-200/0 "
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('Admin.Dashboard.sections.secretariesList', 'Secretaries List')}</h3>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-72 pr-2">
                {dashboardData.activeSecretaries?.map((sec: any) => (
                  <div key={sec.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold mr-3 shrink-0">
                      <FaUserTie size={16} />
                    </div>
                    <div className="truncate flex-1">
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white truncate">{sec.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{sec.email}</p>
                    </div>
                  </div>
                ))}
                {(!dashboardData.activeSecretaries || dashboardData.activeSecretaries.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">{t('Admin.Dashboard.sections.noSecretaries', 'No active secretaries found')}</p>
                )}
              </div>
            </motion.div>

            {/* Appointments Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-200/0 "
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('Admin.Dashboard.charts.appointmentsThisWeek', 'Appointments This Week')}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t('Admin.Dashboard.charts.appointmentsSubtitle', 'Status breakdown of all booked sessions')}</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData.appointmentData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="completed" name={t('Admin.Dashboard.charts.completed', 'Completed')} stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="pending" name={t('Admin.Dashboard.charts.pending', 'Pending')} stackId="a" fill="#f59e0b" />
                    <Bar dataKey="canceled" name={t('Admin.Dashboard.charts.canceled', 'Canceled')} stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </>
      )}

      <CreateDoctorModal isOpen={isDoctorModalOpen} onClose={() => setIsDoctorModalOpen(false)} onSuccess={() => { }} />
      <CreateSecretaryModal isOpen={isSecretaryModalOpen} onClose={() => setIsSecretaryModalOpen(false)} onSuccess={() => { }} />
      <CreateDepartmentModal isOpen={isDepartmentModalOpen} onClose={() => setIsDepartmentModalOpen(false)} onSuccess={() => { }} />
    </DashboardLayout>
  );
}

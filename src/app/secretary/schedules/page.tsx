"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import DashboardLayout from "../secretaryComponents/DashboardLayout";
import axiosInstance from "../../AuthAxios";
import { useAlert } from "../../../Components/Alert";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  FiCalendar, FiClock, FiUser, FiActivity,
  FiCheckCircle, FiXCircle, FiLogIn, FiChevronDown,
  FiLoader, FiAlertCircle, FiLayers,
} from "react-icons/fi";
import dayjs from "dayjs";

/* ─────────────────────── helpers ─────────────────────── */

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    accepted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    waiting: "bg-amber-100  text-amber-700  dark:bg-amber-900/40  dark:text-amber-400",
    rejected: "bg-rose-100   text-rose-700   dark:bg-rose-900/40   dark:text-rose-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

/* ───────────────────────── Page ──────────────────────── */

function Page() {
  const [scheduleList, setScheduleList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState<Record<string, boolean>>({});
  const [selectedSection, setSelectedSection] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const [openTables, setOpenTables] = useState({ accepted: true, waiting: true });
  const { showAlert } = useAlert();

  const formateDate = (date: string) => {
    return dayjs(date).format("MMM DD, YYYY");
  };
  /* ── API actions ── */
  const enterPatient = async (id: number) => {
    try {
      await axiosInstance.get(`api/secretary/patient/${id}`);
      setScheduleList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, enter: 1 } : p))
      );
      showAlert("success", "Patient entered successfully");
    } catch {
      showAlert("error", "Failed to enter patient");
    }
  };

  const transformApiData = (apiData: any[]) =>
    apiData.map((item) => ({
      id: item.id,
      enter: item.enter,
      doctor: {
        name: `Dr. ${item.doctor.user.first_name} ${item.doctor.user.last_name}`,
        section: item.department.name.en,
        rating: 4.5,
        image: item.doctor.user.img_url || "/images/default-doctor.jpg",
      },
      patient: {
        name: `${item.patient.first_name} ${item.patient.last_name}`,
        age: item.patient.age,
        gender: item.patient.gender.trim(),
        medicalStatus:
          item.patient.chronic_diseases !== "non"
            ? item.patient.chronic_diseases
            : "Stable",
      },
      appiontmant_date: item.apointment_date.split(" ")[0],
      time: new Date(item.apointment_date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      status: item.status,
      originalData: item,
    }));

  const sections = ["All", ...new Set(scheduleList.map((i) => i.doctor.section))];

  const sortAppointmentsByDateTime = (appointments: any[]) => {
    const now = new Date();
    return [...appointments].sort((a, b) => {
      const dtA = new Date(a.originalData.apointment_date);
      const dtB = new Date(b.originalData.apointment_date);
      const aFuture = dtA >= now;
      const bFuture = dtB >= now;
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;
      return aFuture
        ? dtA.getTime() - dtB.getTime()
        : dtB.getTime() - dtA.getTime();
    });
  };

  const filteredSchedules = sortAppointmentsByDateTime(
    scheduleList.filter((item) => {
      const sectionMatch = selectedSection === "All" || item.doctor.section === selectedSection;
      const searchMatch =
        item.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
      return sectionMatch && searchMatch;
    })
  );

  const acceptedSchedules = filteredSchedules.filter((i) => i.status === "accepted");
  const waitingSchedules = filteredSchedules.filter((i) => i.status === "waiting");

  const toggleDetails = (key: string) =>
    setOpenDetails((prev) => ({ [key]: !prev[key] }));

  const toggleTable = (key: "accepted" | "waiting") =>
    setOpenTables((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleStatusChange = async (itemIndex: number, newStatus: string) => {
    const item = waitingSchedules[itemIndex];
    const id = item.id;
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axiosInstance.post(`api/secretary/appointment/${id}`);
      setScheduleList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    } catch {
      showAlert("error", "Failed to update appointment status");
    } finally {
      setActionLoading((prev) => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("api/secretary/appointments");
        setScheduleList(res.data?.data ? transformApiData(res.data.data) : []);
      } catch (err: any) {
        showAlert("error", err?.message);
        setScheduleList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ──────────────── Table renderer ──────────────── */
  const renderTable = (
    title: string,
    data: any[],
    type: "accepted" | "waiting",
    accentColor: string,
    Icon: React.ElementType
  ) => (
    <div className="mb-8">
      {/* Section header */}
      <button
        onClick={() => toggleTable(type)}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${accentColor}`}>
            <Icon size={16} />
          </div>
          <div className="text-left">
            <p className="text-base font-bold text-gray-800 dark:text-white">{title}</p>
            <p className="text-xs text-gray-400">{data.length} appointment{data.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${accentColor}`}>
            {data.length}
          </span>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
            {openTables[type]
              ? <FaChevronDown className="text-gray-500" size={12} />
              : <FaChevronRight className="text-gray-500" size={12} />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {openTables[type] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {/* ── Table wrapper ── */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/60 shadow-xl shadow-gray-100/60 dark:shadow-none bg-white dark:bg-gray-900">

              {/* Thead */}
              <div className="grid grid-cols-[1fr_1fr_1.6fr_1.2fr_1.2fr_1.4fr] text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700/50">
                <div className="flex items-center gap-2 px-2">
                  <FiCalendar size={13} className="text-blue-400" /> Date
                </div>
                <div className="flex items-center gap-2 px-2">
                  <FiClock size={13} className="text-emerald-400" /> Time
                </div>
                <div className="flex items-center gap-2 px-2">
                  <FiUser size={13} className="text-Primary" /> Doctor
                </div>
                <div className="flex items-center gap-2 px-2">
                  <FiLayers size={13} className="text-purple-400" /> Section
                </div>
                <div className="flex items-center gap-2 px-2">
                  <FiUser size={13} className="text-pink-400" /> Patient
                </div>
                <div className="flex items-center gap-2 px-2 justify-end">
                  <FiActivity size={13} className="text-rose-400" /> Actions
                </div>
              </div>

              {/* Tbody */}
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {data.map((item, idx) => {
                  const uniqueKey = `${type}-${item.appiontmant_date}-${item.time}-${item.id}`;
                  const isOpen = openDetails[uniqueKey];

                  return (
                    <React.Fragment key={uniqueKey}>
                      {/* Main row */}
                      <motion.div
                        initial={false}
                        className={`grid grid-cols-[1fr_1fr_1.6fr_1.2fr_1.2fr_1.4fr] px-4 py-4 items-center cursor-pointer transition-all duration-150 group
                          ${isOpen
                            ? "bg-Primary/5 dark:bg-Primary/10"
                            : idx % 2 === 0
                              ? "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                              : "bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                          }`}
                        onClick={() => toggleDetails(uniqueKey)}
                      >
                        {/* Date */}
                        <div className="px-2">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{formateDate(item.appiontmant_date)}</p>
                        </div>

                        {/* Time */}
                        <div className="px-2">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            <FiClock size={12} />
                            {item.time}
                          </span>
                        </div>

                        {/* Doctor */}
                        <div className="px-2 flex items-center gap-2.5">
                          <img
                            src={item.doctor.image}
                            alt={item.doctor.name}
                            className="w-8 h-8 rounded-full object-cover border-2 border-Primary/20 flex-shrink-0"
                            onError={(e: any) => { e.target.src = "/images/default-doctor.jpg"; }}
                          />
                          <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{item.doctor.name}</p>
                        </div>

                        {/* Section */}
                        <div className="px-2">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {item.doctor.section}
                          </span>
                        </div>

                        {/* Patient */}
                        <div className="px-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.patient.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.patient.gender}, {item.patient.age} yrs</p>
                        </div>

                        {/* Actions */}
                        <div className="px-2 flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {type === "waiting" ? (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusChange(idx, "accepted")}
                                disabled={actionLoading[item.id]}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              >
                                {actionLoading[item.id]
                                  ? <FiLoader size={13} className="animate-spin" />
                                  : <FiCheckCircle size={13} />}
                                Accept
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => handleStatusChange(idx, "rejected")}
                                disabled={actionLoading[item.id]}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              >
                                {actionLoading[item.id]
                                  ? <FiLoader size={13} className="animate-spin" />
                                  : <FiXCircle size={13} />}
                                Reject
                              </motion.button>
                            </>
                          ) : (
                            item.enter === 0 ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => enterPatient(item.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-Primary hover:bg-Primary/90 text-white text-xs font-bold shadow-sm transition-all"
                              >
                                <FiLogIn size={13} />
                                Enter Patient
                              </motion.button>
                            ) : (
                              <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                                <FiCheckCircle size={13} />
                                Entered
                              </span>
                            )
                          )}
                          {/* Expand toggle */}
                          <div className={`ml-1 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-Primary text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"}`}>
                            <FiChevronDown
                              size={14}
                              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Expandable details row */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50/30 dark:from-gray-800/40 dark:to-gray-700/20 border-t border-gray-100 dark:border-gray-700/50">
                              <div className="flex flex-wrap gap-5">

                                {/* Doctor card */}
                                <motion.div
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.05 }}
                                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 flex items-center gap-4 min-w-[260px]"
                                >
                                  <div className="relative">
                                    <img
                                      src={item.doctor.image}
                                      alt={item.doctor.name}
                                      className="w-16 h-16 rounded-2xl object-cover border-2 border-Primary/20 shadow-sm"
                                      onError={(e: any) => { e.target.src = "/images/default-doctor.jpg"; }}
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-Primary rounded-full border-2 border-white dark:border-gray-900" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-800 dark:text-white text-sm">{item.doctor.name}</p>
                                    <p className="text-xs text-Primary font-semibold mt-0.5">{item.doctor.section}</p>
                                    <div className="flex items-center gap-1 mt-1.5">
                                      {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className={`text-xs ${s <= Math.round(item.doctor.rating) ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}`}>★</span>
                                      ))}
                                      <span className="text-xs text-gray-400 ml-1">{item.doctor.rating}</span>
                                    </div>
                                  </div>
                                </motion.div>

                                {/* Patient card */}
                                <motion.div
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 min-w-[220px]"
                                >
                                  <p className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-3">Patient Info</p>
                                  <div className="space-y-2">
                                    {[
                                      { label: "Name", value: item.patient.name },
                                      { label: "Age", value: `${item.patient.age} yrs` },
                                      { label: "Gender", value: item.patient.gender },
                                      { label: "Status", value: item.patient.medicalStatus },
                                    ].map(({ label, value }) => (
                                      <div key={label} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400 text-xs font-medium">{label}</span>
                                        <span className="font-semibold text-gray-800 dark:text-white">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>

                                {/* Appointment card */}
                                <motion.div
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.15 }}
                                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-5 min-w-[200px]"
                                >
                                  <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">Appointment</p>
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-400 text-xs">Date</span>
                                      <span className="font-semibold text-gray-800 dark:text-white">{formateDate(item.appiontmant_date)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-400 text-xs">Time</span>
                                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{item.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-400 text-xs">Status</span>
                                      <StatusPill status={item.status} />
                                    </div>
                                  </div>
                                </motion.div>

                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ─────────────────── Layout ─────────────────── */
  return (
    <DashboardLayout
      actions={
        <Link
          href="new-appiontment"
          className="bg-Primary flex items-center gap-1.5 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:bg-Primary/90 shadow-md shadow-Primary/20"
        >
          <Plus className="w-4" />
          New Appointment
        </Link>
      }
      title="Doctor Appointments"
      loading={false}
    >
      {/* ── Sticky toolbar ── */}
      <div className="sticky -top-6 bg-white dark:bg-black py-4 z-10 mb-6">
        <div className="flex items-center flex-wrap gap-3">
          {/* Search */}
          <div className="relative w-full max-w-sm">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient or doctor…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white placeholder-gray-400 border border-transparent focus:border-Primary/40 focus:outline-none focus:ring-2 focus:ring-Primary/20 transition-all"
            />
          </div>

          {/* Section pills */}
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <motion.button
                key={section}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedSection(section)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedSection === section
                  ? "bg-Primary text-white shadow-md shadow-Primary/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                {section}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tables ── */}
      {acceptedSchedules.length > 0 &&
        renderTable("Accepted Appointments", acceptedSchedules, "accepted", "bg-emerald-500", FiCheckCircle)}
      {waitingSchedules.length > 0 &&
        renderTable("Pending Approval", waitingSchedules, "waiting", "bg-amber-500", FiAlertCircle)}

      {/* ── Empty state ── */}
      {scheduleList.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FiCalendar size={28} className="text-gray-400" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-700 dark:text-gray-300">No appointments found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Page;

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FiStar, FiPhone, FiChevronDown } from "react-icons/fi";
import { MdOutlineLocalHospital } from "react-icons/md";
import DoctorModal from "../../../Components/DoctorModal";
import DashboardLayout from "../secretaryComponents/DashboardLayout";
import axiosInstance from "../../AuthAxios";

// Section → color palette map
const sectionColors: Record<string, { gradient: string; ring: string; badge: string }> = {
  Cardiology: { gradient: "from-rose-500 to-pink-600", ring: "ring-rose-400", badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
  Neurology: { gradient: "from-violet-500 to-purple-600", ring: "ring-violet-400", badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  Pediatrics: { gradient: "from-sky-500 to-blue-600", ring: "ring-sky-400", badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  Orthopedics: { gradient: "from-amber-500 to-orange-600", ring: "ring-amber-400", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  Dermatology: { gradient: "from-fuchsia-500 to-pink-600", ring: "ring-fuchsia-400", badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300" },
  Oncology: { gradient: "from-emerald-500 to-teal-600", ring: "ring-emerald-400", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  Urology: { gradient: "from-cyan-500 to-teal-600", ring: "ring-cyan-400", badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300" },
  Gynecology: { gradient: "from-indigo-500 to-blue-700", ring: "ring-indigo-400", badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
};

const fallbackColor = { gradient: "from-gray-500 to-gray-600", ring: "ring-gray-400", badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" };

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          size={12}
          className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}
        />
      ))}
      <span className="ml-1.5 text-xs font-bold text-amber-500">{rating.toFixed(1)}</span>
    </div>
  );
}

interface Schedule {
  id: number;
  time: string;
  patientId: number | string;
  patientName: string;
  description: string;
}

interface Doctor {
  id: number;
  name: string;
  phone: string;
  section: string;
  description: string;
  if_work_today: boolean;
  image: string;
  rating: number;
  schedules: Schedule[];
}

function Page() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get("api/secretary/doctors");
      setDoctors(response?.data?.data?.doctors || []);
    } catch (err: any) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors
    .filter((doc) => {
      const docName = doc.name || "";
      const docSection = doc.section || "";
      return (
        docName.toLowerCase().includes(search.toLowerCase()) ||
        docSection.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      if (sortOrder === "high") return ratingB - ratingA;
      if (sortOrder === "low") return ratingA - ratingB;
      return 0;
    });

  return (
    <DashboardLayout loading={loading} title="Doctors">
      {/* ── Search + Sort ── */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-8 gap-3">
        <div className="relative w-full max-w-md">
          <IoSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctor or specialty…"
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-10 py-2.5 text-sm text-gray-800 dark:text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e: any) => setSortOrder(e.target.value)}
            className="appearance-none pl-4 pr-9 h-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          >
            <option value="default">Sort by Rating</option>
            <option value="high">Highest Rated</option>
            <option value="low">Lowest Rated</option>
          </select>
          <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        </div>
      </div>

      {/* ── Doctors Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDoctors.map((doctor, idx) => {
          const docName = doctor.name || "Unknown";
          const docSection = doctor.section || "Unknown";
          const docRating = doctor.rating || 0;
          const docPhone = doctor.phone || "N/A";
          const docImage = doctor.image;
          const docSchedules = doctor.schedules || [];
          const colors = sectionColors[docSection] ?? fallbackColor;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedDoctor(doctor)}
              className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 cursor-pointer overflow-hidden group transition-shadow duration-300"
            >
              {/* Gradient header band */}
              <div className={`h-24 w-full bg-gradient-to-br ${colors.gradient} relative`}>
                {/* Dot pattern overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />
                {/* Schedules count pill */}
                <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {docSchedules.length} appt{docSchedules.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Avatar – overlapping the band */}
              <div className="flex justify-center -mt-12 relative z-10">
                <div className={`ring-4 ${colors.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900 rounded-full shadow-lg`}>
                  {docImage ? (
                    <img
                      src={docImage}
                      alt={docName}
                      className="w-20 h-20 rounded-full object-cover bg-white"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/images/Logo.png"; }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-bold text-2xl">
                      {docName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 pb-5 pt-3 flex flex-col items-center text-center">
                <h3 className="font-bold text-gray-800 dark:text-white text-base leading-tight mt-1">
                  {docName}
                </h3>

                {/* Section badge */}
                <span className={`mt-2 text-[11px] font-semibold px-3 py-0.5 rounded-full ${colors.badge}`}>
                  {docSection}
                </span>

                {/* Stars */}
                <div className="mt-2">
                  <StarRow rating={docRating} />
                </div>

                {/* Phone */}
                <div className="flex items-center gap-1.5 mt-2 text-gray-400 dark:text-gray-500">
                  <FiPhone size={11} />
                  <span className="text-[11px]">{docPhone}</span>
                </div>

                {/* View profile CTA */}
                <div
                  className={`mt-4 w-full py-2 rounded-xl text-xs font-semibold bg-gradient-to-r ${colors.gradient} text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300`}
                >
                  View Profile
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedDoctor && (
          <DoctorModal
            doctor={selectedDoctor as any}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default Page;

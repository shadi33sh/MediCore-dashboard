"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FiStar, FiPhone, FiChevronDown } from "react-icons/fi";
import { MdOutlineLocalHospital } from "react-icons/md";
import DoctorModal from "../../../Components/DoctorModal";
import DashboardLayout from "../secretaryComponents/DashboardLayout";

// Section → color palette map
const sectionColors: Record<string, { gradient: string; ring: string; badge: string }> = {
  Cardiology:   { gradient: "from-rose-500 to-pink-600",     ring: "ring-rose-400",    badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
  Neurology:    { gradient: "from-violet-500 to-purple-600", ring: "ring-violet-400",  badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" },
  Pediatrics:   { gradient: "from-sky-500 to-blue-600",      ring: "ring-sky-400",     badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300" },
  Orthopedics:  { gradient: "from-amber-500 to-orange-600",  ring: "ring-amber-400",   badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
  Dermatology:  { gradient: "from-fuchsia-500 to-pink-600",  ring: "ring-fuchsia-400", badge: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300" },
  Oncology:     { gradient: "from-emerald-500 to-teal-600",  ring: "ring-emerald-400", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  Urology:      { gradient: "from-cyan-500 to-teal-600",     ring: "ring-cyan-400",    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300" },
  Gynecology:   { gradient: "from-indigo-500 to-blue-700",   ring: "ring-indigo-400",  badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" },
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

function Page() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  const doctors = [
    {
      id: 1,
      name: "Dr. Leen Hatem",
      phone: "09808222800",
      section: "Cardiology",
      rating: 4.8,
      image: "/images/Doc 1.jpg",
      description: "Specialized in cardiovascular diseases with over 10 years of experience.",
      schedules: [
        { id: 1, time: "May 20 - 10:00 AM", patientId: "P001", patientName: "Nour Khalil",  description: "Routine heart checkup" },
        { id: 2, time: "May 23 - 12:00 PM", patientId: "P002", patientName: "Hassan Ali",   description: "Follow-up on blood pressure medication" },
        { id: 3, time: "May 20 - 01:30 PM", patientId: "P001", patientName: "Mazin Khalil", description: "Routine heart checkup" },
      ],
    },
    {
      name: "Dr. Ahmad Jaber",
      phone: "09808222800",
      section: "Neurology",
      rating: 4.5,
      image: "/images/Doc 2.jpg",
      description: "Expert in neurological diagnostics and treatments.",
      schedules: [
        { time: "May 21 - 02:00 PM", patientId: "P003", patientName: "Omar Tarek", description: "Migraine management consultation" },
      ],
    },
    {
      name: "Dr. Rana Naser",
      phone: "09808222800",
      section: "Pediatrics",
      rating: 4.9,
      image: "/images/Doc 1.jpg",
      description: "Loves working with children and ensuring their health.",
      schedules: [
        { time: "May 22 - 09:00 AM", patientId: "P004", patientName: "Yasmin Ayman", description: "Routine child wellness check" },
      ],
    },
    {
      name: "Dr. Omar Khaled",
      phone: "09808222800",
      section: "Orthopedics",
      rating: 4.6,
      image: "/images/Doc 2.jpg",
      description: "Focused on orthopedic surgery and joint rehabilitation.",
      schedules: [
        { time: "May 23 - 01:00 PM", patientId: "P005", patientName: "Maher Issa", description: "Rehabilitation after knee surgery" },
      ],
    },
    {
      name: "Dr. Hiba Samer",
      phone: "09808222800",
      section: "Dermatology",
      rating: 4.7,
      image: "/images/Doc 3.jpg",
      description: "Passionate about skincare and dermatological health.",
      schedules: [
        { time: "May 24 - 03:00 PM", patientId: "P006", patientName: "Sara Kamel", description: "Acne treatment session" },
      ],
    },
    {
      name: "Dr. Nour Taha",
      phone: "09808222800",
      section: "Oncology",
      rating: 4.4,
      image: "/images/Doc 1.jpg",
      description: "Experienced in cancer treatment and patient care.",
      schedules: [
        { time: "May 25 - 10:00 AM", patientId: "P007", patientName: "Layal Fathi", description: "Chemotherapy cycle 2" },
      ],
    },
    {
      name: "Dr. Zaid Mounir",
      phone: "09808222800",
      section: "Urology",
      rating: 4.3,
      image: "/images/Doc 3.jpg",
      description: "Deals with urinary tract conditions and male reproductive health.",
      schedules: [
        { time: "May 26 - 11:00 AM", patientId: "P008", patientName: "Khaled Noor", description: "Kidney stone follow-up" },
      ],
    },
    {
      name: "Dr. Sara Fadi",
      phone: "09808222800",
      section: "Gynecology",
      rating: 4.9,
      image: "/images/Doc 4.jpg",
      description: "Trusted for prenatal care and women's health advice.",
      schedules: [
        { time: "May 24 - 11:00 AM", patientId: "P009", patientName: "Lina Kassem", description: "Pregnancy follow-up" },
        { time: "May 28 - 01:00 PM", patientId: "P010", patientName: "Dana Saeed",  description: "Postpartum consultation" },
      ],
    },
  ];

  const filteredDoctors = doctors
    .filter(
      (doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.section.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOrder === "high") return b.rating - a.rating;
      if (sortOrder === "low") return a.rating - b.rating;
      return 0;
    });

  return (
    <DashboardLayout loading={false} title="Doctors">
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
          const colors = sectionColors[doctor.section] ?? fallbackColor;

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
                  {doctor.schedules.length} appt{doctor.schedules.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Avatar – overlapping the band */}
              <div className="flex justify-center -mt-12 relative z-10">
                <div className={`ring-4 ${colors.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900 rounded-full shadow-lg`}>
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/Logo.png"; }}
                  />
                </div>
              </div>

              {/* Card body */}
              <div className="px-5 pb-5 pt-3 flex flex-col items-center text-center">
                <h3 className="font-bold text-gray-800 dark:text-white text-base leading-tight mt-1">
                  {doctor.name}
                </h3>

                {/* Section badge */}
                <span className={`mt-2 text-[11px] font-semibold px-3 py-0.5 rounded-full ${colors.badge}`}>
                  {doctor.section}
                </span>

                {/* Stars */}
                <div className="mt-2">
                  <StarRow rating={doctor.rating} />
                </div>

                {/* Phone */}
                <div className="flex items-center gap-1.5 mt-2 text-gray-400 dark:text-gray-500">
                  <FiPhone size={11} />
                  <span className="text-[11px]">{doctor.phone}</span>
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
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default Page;

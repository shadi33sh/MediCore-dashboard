"use client";
import React, { useState } from "react";
import SideBar from "../../admin/managerComponents/adminSideBar";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import DoctorModal from "../../../Components/DoctorModal";
import DashboardLayout from "../secretaryComponents/DashboardLayout";

// Mock schedules

function Page() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  const doctors = [
    {
      name: "Dr. Leen Hatem",
      phone: "09808222800",
      section: "Cardiology",
      rating: 4.8,
      image: "/images/Doc 1.jpg",
      description:
        "Specialized in cardiovascular diseases with over 10 years of experience.",
      schedules: [
        {
          time: "May 20 - 10:00 AM",
          patientId: "P001",
          patientName: "Nour Khalil",
          description: "Routine heart checkup",
        },
        {
          time: "May 23 - 12:00 PM",
          patientId: "P002",
          patientName: "Hassan Ali",
          description: "Follow-up on blood pressure medication",
        },

        {
          time: "May 20 - 01:30 PM",
          patientId: "P001",
          patientName: "Mazin Khalil",
          description: "Routine heart checkup",
        },
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
        {
          time: "May 21 - 02:00 PM",
          patientId: "P003",
          patientName: "Omar Tarek",
          description: "Migraine management consultation",
        },
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
        {
          time: "May 22 - 09:00 AM",
          patientId: "P004",
          patientName: "Yasmin Ayman",
          description: "Routine child wellness check",
        },
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
        {
          time: "May 23 - 01:00 PM",
          patientId: "P005",
          patientName: "Maher Issa",
          description: "Rehabilitation after knee surgery",
        },
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
        {
          time: "May 24 - 03:00 PM",
          patientId: "P006",
          patientName: "Sara Kamel",
          description: "Acne treatment session",
        },
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
        {
          time: "May 25 - 10:00 AM",
          patientId: "P007",
          patientName: "Layal Fathi",
          description: "Chemotherapy cycle 2",
        },
      ],
    },
    {
      name: "Dr. Zaid Mounir",
      phone: "09808222800",
      section: "Urology",
      rating: 4.3,
      image: "/images/Doc 3.jpg",
      description:
        "Deals with urinary tract conditions and male reproductive health.",
      schedules: [
        {
          time: "May 26 - 11:00 AM",
          patientId: "P008",
          patientName: "Khaled Noor",
          description: "Kidney stone follow-up",
        },
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
        {
          time: "May 24 - 11:00 AM",
          patientId: "P009",
          patientName: "Lina Kassem",
          description: "Pregnancy follow-up",
        },
        {
          time: "May 28 - 01:00 PM",
          patientId: "P010",
          patientName: "Dana Saeed",
          description: "Postpartum consultation",
        },
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
      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4 py-4">
        <div className="relative w-full max-w-md">
          <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            className="rounded-xl border px-10 py-2 bg-gray-200 dark:bg-gray-900 border-Cyan/40 dark:text-white w-full"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={sortOrder}
          onChange={(e: any) => setSortOrder(e.target.value)}
          className="px-4 h-10 border bg- bg-gray-200 dark:bg-gray-900 border-Cyan/40 rounded-xl text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="default">Sort by Rating</option>
          <option value="high">Highest Rated</option>
          <option value="low">Lowest Rated</option>
        </select>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDoctors.map((doctor, idx) => (
          <div
            key={idx}
            className="bg-gray-200 dark:bg-gray-900 p-5 h-[250px] justify-center rounded-xl shadow-md hover:shadow-teal-500/10 transition-transform hover:scale-105 duration-300 flex flex-col items-center cursor-pointer"
            onClick={() => setSelectedDoctor(doctor)}
          >
            <div className="relative w-24 h-24 mb-4">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover rounded-full border-2 border-teal-500"
              />
              <div className="absolute bottom-0 right-0 bg-yellow-400  text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                <span className="absolute translate-x-7">⭐</span>{" "}
                {doctor.rating}
              </div>
            </div>

            <h3 className="font-bold text-center ">{doctor.name}</h3>

            <p className="text-[11px] text-teal-400 py-1 rounded-full">
              {doctor.phone}
            </p>
            <p className="text-sm text-teal-400 mt-1 bg-gray-700 px-3 py-1 rounded-full">
              {doctor.section}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}

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

'use client'
import React from "react";
import SideBar from "./secretaryComponents/SideBar";
import { motion } from "framer-motion";
import { FaUsers, FaUserMd, FaCalendarAlt, FaStethoscope, FaTimesCircle, FaMoneyBill, FaCalendarCheck, FaUserClock } from "react-icons/fa";
import DashboardLayout from "./secretaryComponents/DashboardLayout";

const statistics = [
  {
    title: "Total Patients",
    value: "824",
    icon: <FaUsers size={30} />,
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "Total Doctors",
    value: "26",
    icon: <FaUserMd size={30} />,
    color: "from-green-500 to-emerald-800"
  },
  {
    title: "Appointments Today",
    value: "41",
    icon: <FaCalendarAlt size={30} />,
    color: "from-blue-500 to-cyan-800"
  },
  {
    title: "Medical Sections",
    value: "11",
    icon: <FaStethoscope size={30} />,
    color: "from-pink-500 to-rose-800"
  },
  {
    title: "Canceled Appointments",
    value: "3",
    icon: <FaTimesCircle size={30} />,
    color: "from-red-500 to-red-700"
  },
  {
    title: "Monthly Income",
    value: "$4,200",
    icon: <FaMoneyBill size={30} />,
    color: "from-yellow-500 to-yellow-400"
  },
  {
    title: "Upcoming Appointments",
    value: "18",
    icon: <FaCalendarCheck size={30} />,
    color: "from-teal-500 to-teal-700"
  },
  {
    title: "Visits This Week",
    value: "113",
    icon: <FaUserClock size={30} />,
    color: "from-fuchsia-500 to-violet-700"
  },
];



export default function Page() {
  return (
    <DashboardLayout title="Clinic Statistics Overview">
       
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className={`p-5 rounded-2xl shadow-xl bg-gradient-to-br ${stat.color} text-white flex flex-col justify-between space-y-3`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    {stat.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{stat.title}</h3>
                </div>
                <p className="text-4xl font-bold text-right">{stat.value}</p>
              </motion.div>
            ))}
          </div>
    </DashboardLayout>
  );
}

'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import SideBar from '../../../admin/managerComponents/adminSideBar';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSearch } from 'react-icons/io5';
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import DashboardLayout from '../../../admin/managerComponents/adminDashboardLayout';

const doctors = [
  {
   id : 1 ,
    name: "Dr. Leen Hatem",
    phone : '09808222800' ,
    section: "Cardiology",
    rating: 4.8,
    image: "/images/Doc 1.jpg",
    description: "Specialized in cardiovascular diseases with over 10 years of experience.",
    schedules: [
      {
        time: "May 20 - 10:00 AM",
        patientId: "P001",
        patientName: "Nour Khalil",
        description: "Routine heart checkup"
      },
      {
        time: "May 23 - 12:00 PM",
        patientId: "P002",
        patientName: "Hassan Ali",
        description: "Follow-up on blood pressure medication"
      }
    ]
  },
  {
   id : 2 ,
    name: "Dr. Ahmad Jaber",
    phone : '09808222800' ,
    section: "Neurology",
    rating: 4.5,
    image: "/images/Doc 2.jpg",
    description: "Expert in neurological diagnostics and treatments.",
    schedules: [
      {
        time: "May 21 - 02:00 PM",
        patientId: "P003",
        patientName: "Omar Tarek",
        description: "Migraine management consultation"
      }
    ]
  },
  {
   id : 3 ,
    name: "Dr. Rana Naser",
    phone : '09808222800' ,
    section: "Pediatrics",
    rating: 4.9,
    image: "/images/Doc 1.jpg",
    description: "Loves working with children and ensuring their health.",
    schedules: [
      {
        time: "May 22 - 09:00 AM",
        patientId: "P004",
        patientName: "Yasmin Ayman",
        description: "Routine child wellness check"
      }
    ]
  },
  {
   id : 4 ,
    name: "Dr. Omar Khaled",
    phone : '09808222800' ,
    section: "Orthopedics",
    rating: 4.6,
    image: "/images/Doc 2.jpg",
    description: "Focused on orthopedic surgery and joint rehabilitation.",
    schedules: [
      {
        time: "May 23 - 01:00 PM",
        patientId: "P005",
        patientName: "Maher Issa",
        description: "Rehabilitation after knee surgery"
      }
    ]
  },
  {
   id : 5 ,
    name: "Dr. Hiba Samer",
    phone : '09808222800' ,
    section: "Dermatology",
    rating: 4.7,
    image: "/images/Doc 3.jpg",
    description: "Passionate about skincare and dermatological health.",
    schedules: [
      {
        time: "May 24 - 03:00 PM",
        patientId: "P006",
        patientName: "Sara Kamel",
        description: "Acne treatment session"
      }
    ]
  },
  {
   id : 6 ,
    name: "Dr. Nour Taha",
    phone : '09808222800' ,
    section: "Oncology",
    rating: 4.4,
    image: "/images/Doc 1.jpg",
    description: "Experienced in cancer treatment and patient care.",
    schedules: [
      {
        time: "May 25 - 10:00 AM",
        patientId: "P007",
        patientName: "Layal Fathi",
        description: "Chemotherapy cycle 2"
      }
    ]
  },
  {
   id : 7 ,
    name: "Dr. Zaid Mounir",
    phone : '09808222800' ,
    section: "Urology",
    rating: 4.3,
    image: "/images/Doc 3.jpg",
    description: "Deals with urinary tract conditions and male reproductive health.",
    schedules: [
      {
        time: "May 26 - 11:00 AM",
        patientId: "P008",
        patientName: "Khaled Noor",
        description: "Kidney stone follow-up"
      }
    ]
  },
  {
   id : 8 ,
    name: "Dr. Sara Fadi",
    phone : '09808222800' ,
    section: "Gynecology",
    rating: 4.9,
    image: "/images/Doc 4.jpg",
    description: "Trusted for prenatal care and women's health advice.",
    schedules: [
      {
        time: "May 24 - 11:00 AM",
        patientId: "P009",
        patientName: "Lina Kassem",
        description: "Pregnancy follow-up"
      },
      {
        time: "May 28 - 01:00 PM",
        patientId: "P010",
        patientName: "Dana Saeed",
        description: "Postpartum consultation"
      }
    ]
  }
]
const schedules = [
  {
    doctor: { name: "Dr. Leen Hatem", section: "Cardiology", rating: 4.8, image: "/images/Doc 3.jpg" },
    patient: { name: "Nour Khalil", age: 29, gender: "Female", medicalStatus: "Stable" },
    date: "2025-05-20",
    time: "10:00 AM - 12:00 PM",
    status: "accepted",
  },
  {
    doctor: { name: "Dr. Ahmad Jaber", section: "Neurology", rating: 4.5, image: "/images/Doc 4.jpg" },
    patient: { name: "Omar Tarek", age: 35, gender: "Male", medicalStatus: "Recovering" },
    date: "2025-05-21",
    time: "02:00 PM - 04:00 PM",
    status: "waiting",
  },
  {
    doctor: { name: "Dr. Rana Naser", section: "Pediatrics", rating: 4.9, image: "/images/Doc 1.jpg" },
    patient: { name: "Yasmin Ayman", age: 6, gender: "Female", medicalStatus: "Routine Checkup" },
    date: "2025-05-22",
    time: "09:00 AM - 11:00 AM",
    status: "accepted",
  },
  {
    doctor: { name: "Dr. Omar Khaled", section: "Orthopedics", rating: 4.6, image: "/images/Doc 3.jpg" },
    patient: { name: "Maher Issa", age: 40, gender: "Male", medicalStatus: "Under Treatment" },
    date: "2025-05-23",
    time: "01:00 PM - 03:00 PM",
    status: "waiting",
  },
  {
    doctor: { name: "Dr. Sara Fadi", section: "Gynecology", rating: 4.9, image: "/images/Doc 4.jpg" },
    patient: { name: "Lina Kassem", age: 32, gender: "Female", medicalStatus: "Pregnancy Checkup" },
    date: "2025-05-24",
    time: "11:00 AM - 01:00 PM",
    status: "accepted",
  },
]
  const renderTable = (title: string, data: typeof schedules, type: 'accepted' | 'waiting') => {
    return (
      <div className="mb-3">
        <button
          className="text-left w-full text-md font-bold flex items-center gap-3 px-4 py-2 mb-2 rounded-md dark:hover:bg-gray-700 hover:bg-gray-100"
          onClick={() => toggleTable(type)}
        >
          {openTables[type] ? <> <FaChevronDown /> {title} </> : <> <FaChevronRight /> {title} </>}
        </button>
  
        <AnimatePresence>
          {openTables[type] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                    <tr>
                      <th className="p-3 ">Date</th>
                      <th className="p-3 ">Time</th>
                      <th className="p-3 ">Doctor</th>
                      <th className="p-3 ">Section</th>
                      <th className="p-3 ">Patient</th>
                      <th className="p-3 ">Details</th>
                      {type === 'waiting' && (
                        <th className="p-3  border-gray-300 dark:border-gray-700">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => {
                      const uniqueKey = `${type}-${item.date}-${item.time}`;
                      return (
                        <React.Fragment key={uniqueKey}>
                          <tr
                            className="transition duration-300 ease-in-out dark:hover:bg-gray-700 hover:bg-gray-100 even:bg-gray-50 dark:even:bg-gray-800 border-b border-gray-300 dark:border-gray-700 cursor-pointer"
                            onClick={() => toggleDetails(uniqueKey)}
                          >
                            <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.date}</td>
                            <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.time}</td>
                            <td className="p-4 text-sm font-semibold text-teal-600 dark:text-teal-300">{item.doctor.name}</td>
                            <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.doctor.section}</td>
                            <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.patient.name}</td>
                            <td className="p-4 text-sm font-bold text-teal-500 dark:text-teal-300">
                              {openDetails[uniqueKey] ? '▲ Hide' : '▼ Show'}
                            </td>
                            {type === 'waiting' && (
                              <td className="p-4 space-x-2">
                                <button
                                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded-lg text-sm shadow"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(idx, 'accepted');
                                  }}
                                >
                                  Accept
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-sm shadow"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(idx, 'rejected');
                                  }}
                                >
                                  Reject
                                </button>
                              </td>
                            )}
                          </tr>
  
                          <AnimatePresence>
                            {openDetails[uniqueKey] && (
                              <tr>
                                <td colSpan={type === 'waiting' ? 7 : 6} className="p-0">
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-6 flex flex-wrap gap-8 bg-gray-100 dark:bg-gray-800/30 rounded-b-xl border-t border-gray-300 dark:border-gray-700">
                                      <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.4 }}
                                        className="dark:bg-gray-900 bg-white rounded-xl shadow-lg p-5 w-64 flex flex-col items-center"
                                      >
                                        <img
                                          src={item.doctor.image}
                                          alt={item.doctor.name}
                                          className="w-28 h-28 rounded-full object-cover border-4 border-teal-500 mb-4 shadow-md"
                                        />
                                        <h3 className="text-xl font-bold">{item.doctor.name}</h3>
                                        <p className="text-teal-400 mb-1">{item.doctor.section}</p>
                                        <p className="text-yellow-400 font-semibold">⭐ {item.doctor.rating}</p>
                                      </motion.div>
  
                                      <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.4 }}
                                        className="dark:bg-gray-900 bg-white rounded-xl shadow-lg p-5 w-64 flex flex-col"
                                      >
                                        <h3 className="text-xl font-bold mb-3">Patient Info</h3>
                                        <p>
                                          <span className="font-semibold text-teal-400">Name: </span>
                                          {item.patient.name}
                                        </p>
                                        <p>
                                          <span className="font-semibold text-teal-400">Age: </span>
                                          {item.patient.age}
                                        </p>
                                        <p>
                                          <span className="font-semibold text-teal-400">Gender: </span>
                                          {item.patient.gender}
                                        </p>
                                        <p>
                                          <span className="font-semibold text-teal-400">Medical Status: </span>
                                          {item.patient.medicalStatus}
                                        </p>
                                      </motion.div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  
export default function Page() {
  const params = useParams<{ section: string }>();
  const sectionName = decodeURIComponent(params.section);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  const filteredDoctors = doctors
    .filter(doc =>
      doc.section.toLowerCase() === sectionName.toLowerCase() &&
      (doc.name.toLowerCase().includes(search.toLowerCase()) ||
       doc.section.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'high') return b.rating - a.rating;
      if (sortOrder === 'low') return a.rating - b.rating;
      return 0;
    });


    const [openTables, setOpenTables] = useState<{ accepted: boolean; waiting: boolean }>({
  accepted: true,
  waiting: false,
});

const [openDetails, setOpenDetails] = useState<{ [key: string]: boolean }>({});

const toggleTable = (type: 'accepted' | 'waiting') => {
  setOpenTables(prev => ({ ...prev, [type]: !prev[type] }));
};

const toggleDetails = (key: string) => {
  setOpenDetails(prev => ({ ...prev, [key]: !prev[key] }));
};
const handleStatusChange = (index: number, newStatus: 'accepted' | 'rejected') => {
  // Example: update your backend or state
  console.log(`Changing status of item ${index} to ${newStatus}`);
};

const acceptedSchedules = schedules.filter(s => s.status === "accepted").filter(s=> s.doctor.section === sectionName)
const waitingSchedules = schedules.filter(s => s.status === "waiting").filter(s=> s.doctor.section === sectionName);

const renderTable = (title: string, data: typeof schedules, type: 'accepted' | 'waiting') => {
  return (
    <div className="mb-3">
      <button
        className="text-left w-full text-md font-bold flex items-center gap-3 px-4 py-2 mb-2 rounded-md dark:hover:bg-gray-700 hover:bg-gray-100"
        onClick={() => toggleTable(type)}
      >
        {openTables[type] ? <> <FaChevronDown /> {title} </> : <> <FaChevronRight /> {title} </>}
      </button>

      <AnimatePresence>
        {openTables[type] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
              <table className="min-w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  <tr>
                    <th className="p-3 ">Date</th>
                    <th className="p-3 ">Time</th>
                    <th className="p-3 ">Doctor</th>
                    <th className="p-3 ">Section</th>
                    <th className="p-3 ">Patient</th>
                    <th className="p-3 ">Details</th>
                    {type === 'waiting' && (
                      <th className="p-3  border-gray-300 dark:border-gray-700">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => {
                    const uniqueKey = `${type}-${item.date}-${item.time}`;
                    return (
                      <React.Fragment key={uniqueKey}>
                        <tr
                          className="transition duration-300 ease-in-out dark:hover:bg-gray-700 hover:bg-gray-100 even:bg-gray-50 dark:even:bg-gray-800 border-b border-gray-300 dark:border-gray-700 cursor-pointer"
                          onClick={() => toggleDetails(uniqueKey)}
                        >
                          <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.date}</td>
                          <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.time}</td>
                          <td className="p-4 text-sm font-semibold text-teal-600 dark:text-teal-300">{item.doctor.name}</td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.doctor.section}</td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.patient.name}</td>
                          <td className="p-4 text-sm font-bold text-teal-500 dark:text-teal-300">
                            {openDetails[uniqueKey] ? '▲ Hide' : '▼ Show'}
                          </td>
                          {type === 'waiting' && (
                            <td className="p-4 space-x-2">
                              <button
                                className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1 rounded-lg text-sm shadow"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(idx, 'accepted');
                                }}
                              >
                                Accept
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg text-sm shadow"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(idx, 'rejected');
                                }}
                              >
                                Reject
                              </button>
                            </td>
                          )}
                        </tr>

                        <AnimatePresence>
                          {openDetails[uniqueKey] && (
                            <tr>
                              <td colSpan={type === 'waiting' ? 7 : 6} className="p-0">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 flex flex-wrap gap-8 bg-gray-100 dark:bg-gray-800/30 rounded-b-xl border-t border-gray-300 dark:border-gray-700">
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 20 }}
                                      transition={{ duration: 0.4 }}
                                      className="dark:bg-gray-900 bg-white rounded-xl shadow-lg p-5 w-64 flex flex-col items-center"
                                    >
                                      <img
                                        src={item.doctor.image}
                                        alt={item.doctor.name}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-teal-500 mb-4 shadow-md"
                                      />
                                      <h3 className="text-xl font-bold">{item.doctor.name}</h3>
                                      <p className="text-teal-400 mb-1">{item.doctor.section}</p>
                                      <p className="text-yellow-400 font-semibold">⭐ {item.doctor.rating}</p>
                                    </motion.div>

                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 20 }}
                                      transition={{ duration: 0.4 }}
                                      className="dark:bg-gray-900 bg-white rounded-xl shadow-lg p-5 w-64 flex flex-col"
                                    >
                                      <h3 className="text-xl font-bold mb-3">Patient Info</h3>
                                      <p>
                                        <span className="font-semibold text-teal-400">Name: </span>
                                        {item.patient.name}
                                      </p>
                                      <p>
                                        <span className="font-semibold text-teal-400">Age: </span>
                                        {item.patient.age}
                                      </p>
                                      <p>
                                        <span className="font-semibold text-teal-400">Gender: </span>
                                        {item.patient.gender}
                                      </p>
                                      <p>
                                        <span className="font-semibold text-teal-400">Medical Status: </span>
                                        {item.patient.medicalStatus}
                                      </p>
                                    </motion.div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

  return (
     <DashboardLayout title={`${sectionName} Doctors`}>      
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4 py-4">
            <div className="relative w-full max-w-md">
                <IoSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" 
                />
                <input
                  type="text"
                  placeholder="Search by patient or doctor name..."
                  className="rounded-xl border px-10 py-2 bg-gray-200 dark:bg-gray-900 border-Cyan/40 dark:text-white w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
            </div>
          <select
          
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 h-10 border bg- bg-gray-200 dark:bg-gray-900 border-Cyan/40 rounded-xl text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="default">Sort by Rating</option>
            <option value="high">Highest Rated</option>
            <option value="low">Lowest Rated</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-gray-200 dark:bg-gray-900 p-5 h-[250px] justify-center rounded-xl shadow-md hover:shadow-teal-500/10 transition-transform hover:scale-105 duration-300 flex flex-col items-center cursor-pointer"
              onClick={() => setSelectedDoctor(doctor)}
            >
              <div className="relative w-24 h-24 mb-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover rounded-full border-2 border-teal-500"
                />
                <div className="absolute bottom-0 right-0 bg-yellow-400 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  <span className="absolute translate-x-7">⭐</span> {doctor.rating}
                </div>
              </div>
              <h3 className="font-bold text-center">{doctor.name}</h3>
              <p className="text-[11px] text-teal-400 py-1 rounded-full">{doctor.phone}</p>
              <p className="text-sm text-teal-400 mt-1 bg-gray-700 px-3 py-1 rounded-full">
                {doctor.section}
              </p>
            </div>
          ))}
        </div>

        {acceptedSchedules.length!=0&&renderTable("Accepted Appointments", acceptedSchedules, 'accepted')}
        {waitingSchedules.length!=0&&renderTable("Waiting for Approval", waitingSchedules, 'waiting')}

        <AnimatePresence>
          {selectedDoctor && (
            <>
              <motion.div
                className="absolute -top-6 left-0 w-screen h-screen bg-black/70 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDoctor(null)}
              />
              <motion.div
                className="fixed top-1/4 left-[25%] z-50 w-[50%] dark:text-white bg-gray-200 dark:bg-gray-900 rounded-xl shadow-lg p-8"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.4 }}
              >
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
                >
                  &times;
                </button>
                <div className="flex flex-col items-center text-center">
                  <img
                    src={selectedDoctor.image}
                    className="w-28 h-28 rounded-full border-4 border-teal-500 mb-4 object-cover"
                    alt={selectedDoctor.name}
                  />
                  <h3 className="text-2xl font-bold">{selectedDoctor.name}</h3>
                  <p className="text-teal-400">{selectedDoctor.section}</p>
                  <p className="text-yellow-400 font-semibold mt-1">⭐ {selectedDoctor.rating}</p>
                  <p>{selectedDoctor.phone}</p>
                  <p className="text-sm dark:text-gray-300 mt-4">
                    {selectedDoctor.description}
                  </p>
                  <div className="mt-6 w-full">
                    <h4 className="dark:text-white font-semibold mb-4">Upcoming Schedules:</h4>
                    <div className="overflow-x-auto rounded-lg border-2 border-gray-700">
                      <table className="min-w-full text-sm text-left text-gray-300">
                        <thead className="dark:bg-gray-800 bg-gray-300 text-gray-800 dark:text-teal-300">
                          <tr>
                            <th className="px-4 py-2 border-b">Time</th>
                            <th className="px-4 py-2 border-b">Patient</th>
                            <th className="px-4 py-2 border-b">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedDoctor.schedules.map((schedule: any, i: number) => (
                            <tr
                              key={i}
                              className="dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-100 hover:bg-gray-300"
                            >
                              <td className="px-4 py-2 border-b border-gray-700">{schedule.time}</td>
                              <td className="px-4 py-2 border-b border-gray-700">{schedule.patientName}</td>
                              <td className="px-4 py-2 border-b border-gray-700">{schedule.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      
     </DashboardLayout>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import SideBar from "../../admin/managerComponents/adminSideBar";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaAlignLeft,
  FaArrowLeft,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { IoAddCircle, IoArrowUp, IoSearch } from "react-icons/io5";
import DashboardLayout from "../secretaryComponents/DashboardLayout";
import axiosInstance from "../../AuthAxios";
import { useAlert } from "../../../Components/Alert";
import { Plus } from "lucide-react";
import Link from "next/link";

function Page() {
  const [scheduleList, setScheduleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState({});
  const [selectedSection, setSelectedSection] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  // Add this state at the top with your other states
  const [actionLoading, setActionLoading] = useState({});
  const [openTables, setOpenTables] = useState({
    accepted: true,
    waiting: true,
  });

  const enterPatient = async (id: number) => {
    try {
      await axiosInstance.get(`api/secretary/patient/${id}`);

      setScheduleList((prev) =>
        prev.map((patient) =>
          patient.id === id ? { ...patient, enter: 1 } : patient,
        ),
      );

      showAlert("success", "Entered");
    } catch (error: any) {
      showAlert("error", "Not entered");
    }
  };

  // Transform API data to match your component's expected structure
  const transformApiData = (apiData) => {
    return apiData.map((item) => ({
      id: item.id,
      enter: item.enter,
      doctor: {
        name: `Dr. ${item.doctor.user.first_name} ${item.doctor.user.last_name}`,
        section: item.department.name.en,
        rating: 4.5, // You might want to add this to your API or calculate it
        image: item.doctor.user.img_url || "/images/default-doctor.jpg", // Fallback image
      },
      patient: {
        name: `${item.patient.first_name} ${item.patient.last_name}`,
        age: item.patient.age,
        gender: item.patient.gender.trim(), // Remove any whitespace
        medicalStatus:
          item.patient.chronic_diseases !== "non"
            ? item.patient.chronic_diseases
            : "Stable",
      },
      appiontmant_date: item.apointment_date.split(" ")[0], // Extract date part
      time: new Date(item.apointment_date).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }), // Create time range (assuming 2-hour appointments)
      status: item.status,
      originalData: item, // Keep original data in case you need it
    }));
  };

  const sections = [
    "All",
    ...new Set(scheduleList.map((item) => item.doctor.section)),
  ];
  const sortAppointmentsByDateTime = (appointments) => {
    const now = new Date();

    return appointments.sort((a, b) => {
      const dateTimeA = new Date(a.originalData.apointment_date);
      const dateTimeB = new Date(b.originalData.apointment_date);

      // Separate future and past appointments
      const aIsFuture = dateTimeA >= now;
      const bIsFuture = dateTimeB >= now;

      // Future appointments come first
      if (aIsFuture && !bIsFuture) return -1;
      if (!aIsFuture && bIsFuture) return 1;

      // Within the same category (future or past), sort by time
      // Future: closest first, Past: most recent first
      if (aIsFuture) {
        return dateTimeA.getTime() - dateTimeB.getTime(); // Ascending for future
      } else {
        return dateTimeB.getTime() - dateTimeA.getTime(); // Descending for past
      }
    });
  };
  const filteredSchedules = sortAppointmentsByDateTime(
    scheduleList.filter((item) => {
      const sectionMatch =
        selectedSection === "All" || item.doctor.section === selectedSection;
      const searchMatch =
        item.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
      return sectionMatch && searchMatch;
    }),
  );

  const { showAlert } = useAlert();

  const acceptedSchedules = filteredSchedules.filter(
    (item) => item.status === "accepted",
  );
  const waitingSchedules = filteredSchedules.filter(
    (item) => item.status === "waiting",
  );

  const toggleDetails = (key) => {
    setOpenDetails((prev) => ({
      [key]: !prev[key],
    }));
  };

  const toggleTable = (key) => {
    setOpenTables((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStatusChange = async (itemIndex, newStatus) => {
    const item = waitingSchedules[itemIndex];
    const appointmentId = item.id;

    // Set loading for this specific appointment
    setActionLoading((prev) => ({ ...prev, [appointmentId]: true }));

    try {
      await axiosInstance.post(`api/secretary/appointment/${appointmentId}`);
      // Update local state
      const indexInList = scheduleList.findIndex(
        (schedule) => schedule.id === appointmentId,
      );
      if (indexInList !== -1) {
        const updatedList = [...scheduleList];
        updatedList[indexInList].status = newStatus;
        setScheduleList(updatedList);
      }
    } catch (err: any) {
      showAlert("error", "Failed to update appointment status");
    } finally {
      // Remove loading for this appointment
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[appointmentId];
        return newState;
      });
    }
  };

  useEffect(() => {
    const getAppointments = async () => {
      try {
        setLoading(true);

        const response = await axiosInstance.get("api/secretary/appointments");

        if (response.data && response.data.data) {
          const transformedData = transformApiData(response.data.data);
          setScheduleList(transformedData);
        } else {
          setScheduleList([]);
        }
      } catch (err: any) {
        showAlert("error", err?.message);
        setScheduleList([]);
      } finally {
        setLoading(false);
      }
    };

    getAppointments();
  }, []);

  const renderTable = (title: string, data, type: "accepted" | "waiting") => {
    return (
      <div className="mb-6">
        <button
          className="text-left w-full text-lg font-bold flex items-center gap-3 px-6 py-3 mb-4 rounded-xl dark:hover:from-gray-700 dark:hover:to-gray-600 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md border-gray-200 dark:border-gray-600"
          onClick={() => toggleTable(type)}
        >
          <div className="flex items-center space-x-3">
            {openTables[type] ? (
              <FaChevronDown className="text-Primary" />
            ) : (
              <FaChevronRight className="text-Primary" />
            )}
            <span className="text-gray-800 dark:text-gray-200">{title}</span>
          </div>
        </button>

        <AnimatePresence>
          {openTables[type] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-900">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-700/50 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="py-4 px-4  text-left font-bold tracking-wide">
                        <div className=" gap-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500"></div>
                          <span>Date</span>
                        </div>
                      </th>
                      <th className="py-4 px-4  text-left font-bold tracking-wide">
                        <div className=" gap-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-400 dark:bg-green-500"></div>
                          <span>Time</span>
                        </div>
                      </th>
                      <th className="py-4 px-4  text-left font-bold tracking-wide">
                        <div className="flex  gap-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-Primary dark:bg-Primary "></div>
                          <span>Doctor</span>
                        </div>
                      </th>
                      <th className="py-4 px-4  text-left font-bold tracking-wide">
                        <div className="flex  gap-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-500"></div>
                          <span>Section</span>
                        </div>
                      </th>
                      <th className="py-4 px-4  text-left font-bold tracking-wide">
                        <div className="flex  gap-2 items-center">
                          <div className="w-2 h-2 rounded-full bg-pink-400 dark:bg-pink-500"></div>
                          <span>Patient</span>
                        </div>
                      </th>

                      <th className="py-4 px-4  text-left font-bold tracking-wide">
                        <div className="flex flex-row-reverse  center gap-2">
                          <span>Actions</span>
                          <div className="w-2 h-2 rounded-full bg-red-400 dark:bg-red-500"></div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => {
                      const uniqueKey = `${type}-${item.appiontmant_date}-${item.time}-${item.id}`;
                      return (
                        <React.Fragment key={uniqueKey}>
                          <tr
                            className={`
                              transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer
                              ${idx % 2 === 0 ? "bg-white dark:bg-gray-700/10" : "bg-gray-50 dark:bg-gray-900"}
                              
                            `}
                          >
                            <td
                              onClick={() => toggleDetails(uniqueKey)}
                              className="px-4 py-6 text-sm font-medium text-gray-800 dark:text-gray-200"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <span>{item?.appiontmant_date}</span>
                              </div>
                            </td>
                            <td
                              onClick={() => toggleDetails(uniqueKey)}
                              className="px-4 py-6 text-sm font-medium text-gray-800 dark:text-gray-200"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <span>{item.time}</span>
                              </div>
                            </td>
                            <td
                              onClick={() => toggleDetails(uniqueKey)}
                              className="px-4 py-6 text-sm font-bold  "
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-Primary "></div>
                                <span>{item.doctor.name}</span>
                              </div>
                            </td>
                            <td
                              onClick={() => toggleDetails(uniqueKey)}
                              className="px-4 py-6 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                <span>{item.doctor.section}</span>
                              </div>
                            </td>
                            <td
                              onClick={() => toggleDetails(uniqueKey)}
                              className="px-4 py-6 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                                <span>{item.patient.name}</span>
                              </div>
                            </td>

                            {type === "waiting" ? (
                              <td className="px-4 py-6 space-x-3 center">
                                <button
                                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-4 w-32 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                  onClick={(e: any) => {
                                    e.stopPropagation();
                                    handleStatusChange(idx, "accepted");
                                  }}
                                  disabled={actionLoading[item.id]}
                                >
                                  {actionLoading[item.id]
                                    ? "Processing..."
                                    : "Accept"}
                                </button>
                                <button
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-4 w-32 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                  onClick={(e: any) => {
                                    e.stopPropagation();
                                    handleStatusChange(idx, "rejected");
                                  }}
                                  disabled={actionLoading[item.id]}
                                >
                                  {actionLoading[item.id]
                                    ? "Processing..."
                                    : "Reject"}
                                </button>
                              </td>
                            ) : (
                              <>
                                <td className="px-4 py-6 space-x-3 center">
                                  {item.enter == 0 ? (
                                    <button
                                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-4 w-32 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                      onClick={() => enterPatient(item.id)}
                                    >
                                      enter patient
                                    </button>
                                  ) : (
                                    <>
                                      <p className="text-sm text-gray-500">
                                        no actions
                                      </p>
                                    </>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>

                          <AnimatePresence>
                            {openDetails[uniqueKey] && (
                              <tr>
                                <td
                                  colSpan={type === "waiting" ? 7 : 6}
                                  className="p-0"
                                >
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                      duration: 0.4,
                                      ease: "easeInOut",
                                    }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-8 flex flex-wrap gap-8 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800/30 dark:to-gray-700/30 border-t border-gray-200 dark:border-gray-700/5">
                                      <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.4 }}
                                        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl p-6 w-64 flex flex-col items-center transition-all duration-200"
                                      >
                                        <div className="relative">
                                          <img
                                            src={item.doctor.image}
                                            alt={item.doctor.name}
                                            className="w-28 h-28 rounded-full object-cover border-4 border-gradient-to-r from-Primary to-blue-500 mb-4 shadow-lg"
                                            onError={(e: any) => {
                                              e.target.src =
                                                "/images/default-doctor.jpg"; // Replace with your default image path
                                            }}
                                          />
                                          <div className="absolute bottom-3 right-3 w-5 h-5 bg-gradient-to-r from-Primary to-blue-500 rounded-full flex items-center justify-center"></div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                                          {item.doctor.name}
                                        </h3>
                                        <p className="text-Primary dark:text-Primary mb-2 font-medium">
                                          {item.doctor.section}
                                        </p>
                                        <div className="flex items-center space-x-1">
                                          <span className="text-yellow-400 text-lg">
                                            ⭐
                                          </span>
                                          <span className="text-yellow-600 dark:text-yellow-400 font-bold">
                                            {item.doctor.rating}
                                          </span>
                                        </div>
                                      </motion.div>

                                      <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.4 }}
                                        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl p-6 w-64 flex flex-col transition-all duration-200 "
                                      >
                                        <div className="flex items-center space-x-2 mb-4">
                                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-500"></div>
                                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                            Patient Info
                                          </h3>
                                        </div>
                                        <div className="space-y-3">
                                          <p className="flex items-center space-x-2">
                                            <span className="font-bold text-Primary dark:text-Primary ">
                                              Name:
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                              {item.patient.name}
                                            </span>
                                          </p>
                                          <p className="flex items-center space-x-2">
                                            <span className="font-bold text-Primary dark:text-Primary ">
                                              Age:
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                              {item.patient.age}
                                            </span>
                                          </p>
                                          <p className="flex items-center space-x-2">
                                            <span className="font-bold text-Primary dark:text-Primary ">
                                              Gender:
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                              {item.patient.gender}
                                            </span>
                                          </p>
                                          <p className="flex items-center space-x-2">
                                            <span className="font-bold text-Primary dark:text-Primary ">
                                              Medical Status:
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                              {item.patient.medicalStatus}
                                            </span>
                                          </p>
                                          <p className="flex items-center space-x-2">
                                            <span className="font-bold text-Primary dark:text-Primary ">
                                              Medical Status:
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">
                                              {item.patient.medicalStatus}
                                            </span>
                                          </p>
                                        </div>
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
    <DashboardLayout
      actions={
        <>
          <Link href="new-appiontment" className=" bg-Primary flex items-center gap-1 text-white px-4 py-2 rounded-xl font-medium transition-all">
            <Plus className="w-5" />
            <p >New Appointment</p>
          </Link>
        </>
      }
      title="Doctor Appointments" loading={false}>
      <div className="sticky -top-6 bg-white dark:bg-black py-4 z-10">
        <div className="flex items-center flex-wrap gap-3">
          <div className="relative w-full max-w-md">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              className="rounded-xl px-10 py-2 bg-gray-200 dark:bg-gray-900 dark:text-white w-full"
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </div>
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedSection !== section
                ? "dark:bg-gray-700/50 bg-gray-700/10"
                : "bg-Primary text-white"
                }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {acceptedSchedules.length !== 0 &&
        renderTable("Accepted Appointments", acceptedSchedules, "accepted")}
      {waitingSchedules.length !== 0 &&
        renderTable("Waiting for Approval", waitingSchedules, "waiting")}

      {scheduleList.length === 0 && !loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">No appointments found</div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Page;

"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaPlus, FaStar, FaInfoCircle, FaMoneyBillWave, FaFileSignature } from "react-icons/fa";
import axiosInstance from "../../AuthAxios";
import DashboardLayout from "../managerComponents/adminDashboardLayout";
import { IoSearch } from "react-icons/io5";
import CreateDoctorModal from "../manage/CreateDoctorModal";

function Page() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [openTable, toggleTable] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get("api/doctor");
      setDoctors(response?.data?.data?.doctors || []);
    } catch (err: any) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const getDeptName = (dept: any) => {
    if (!dept) return "Unknown";
    return typeof dept.name === 'string' ? dept.name : (dept.name?.en || "Unknown");
  };

  const filteredDoctors = doctors.filter(({ department, user }: any) => {
    const deptName = getDeptName(department);
    const departmentMatch =
      selectedDepartment === "All" || deptName === selectedDepartment;
    const searchLower = searchTerm.toLowerCase();
    const searchMatch =
      user?.first_name?.toLowerCase().includes(searchLower) ||
      user?.last_name?.toLowerCase().includes(searchLower);

    return departmentMatch && searchMatch;
  });

  const departments = [...new Set(doctors.map((doc: any) => getDeptName(doc.department)))];

  const handleSort = (column: string) => {
    setSortOrder((prevOrder) =>
      sortColumn === column && prevOrder === "asc" ? "desc" : "asc",
    );
    setSortColumn(column);
  };

  const sortedData = [...filteredDoctors].sort((a: any, b: any) => {
    if (!sortColumn) return 0;

    const valueA =
      sortColumn === "name"
        ? `${a.user.first_name} ${a.user.last_name}`
        : getDeptName(a.department);
    const valueB =
      sortColumn === "name"
        ? `${b.user.first_name} ${b.user.last_name}`
        : getDeptName(b.department);

    return sortOrder === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const toggleRow = (id: number) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const renderTable = (title: string, data: any) => {
    return (
      <div className="mb-3">
        <div
          className="text-left w-full text-lg font-bold flex items-center justify-between px-4 py-3 mb-2 text-gray-800 dark:text-gray-200 "
        >
          <div className="flex items-center gap-3">

            <span>{title} <span className="text-sm font-normal text-gray-500">({data.length})</span></span>
          </div>
        </div>

        <AnimatePresence>
          {openTable && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm mt-2">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800 text-sm">
                    <tr>
                      <th
                        className="p-4 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-2">
                          Doctor Name
                          {sortColumn === "name" && (
                            <span className="text-Primary">{sortOrder === "asc" ? "▲" : "▼"}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="p-4 font-semibold cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleSort("department")}
                      >
                        <div className="flex items-center gap-2">
                          Department
                          {sortColumn === "department" && (
                            <span className="text-Primary">{sortOrder === "asc" ? "▲" : "▼"}</span>
                          )}
                        </div>
                      </th>
                      <th className="p-4 font-semibold">Phone</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold text-center">Rating</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {data.map((item: any, idx: any) => (
                      <React.Fragment key={`${item.id} ${idx}`}>
                        <tr
                          className={`transition duration-200 ease-in-out cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 ${expandedRowId === item.id ? 'bg-Primary/5 dark:bg-Primary/10' : ''}`}
                          onClick={() => toggleRow(item.id)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {item.user.img_path ? (
                                <img src={item.user.img_path} alt={`${item.user.first_name} ${item.user.last_name}`} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-700" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-Primary to-Primary/80 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                  {item.user.first_name?.[0]}{item.user.last_name?.[0]}
                                </div>
                              )}
                              <span className="font-semibold text-gray-800 dark:text-gray-200">
                                {`${item.user.first_name} ${item.user.last_name}`}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full font-medium shadow-sm border border-gray-200 dark:border-gray-700">
                              {getDeptName(item.department)}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                            {item.user.phone}
                          </td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                            {item.user.email}
                          </td>
                          <td className="p-4 text-sm text-center">
                            <div className="flex items-center justify-center gap-1.5 text-amber-500 font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full w-fit mx-auto">
                              <FaStar />
                              <span>{item.average_rating || 0}</span>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Details Row */}
                        <AnimatePresence>
                          {expandedRowId === item.id && (
                            <tr className="bg-gray-50/50 dark:bg-gray-900/30">
                              <td colSpan={5} className="p-0 border-b border-gray-200 dark:border-gray-800 ">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 dark:border-gray-800 shadow-inner">

                                    <div className="space-y-4">
                                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <FaInfoCircle className="text-Primary" /> Professional Summary
                                      </h4>
                                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[100px]">
                                        {item.bio || "No professional summary provided."}
                                      </p>
                                    </div>

                                    <div className="space-y-4">
                                      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <FaMoneyBillWave className="text-emerald-500" /> Financial Details
                                      </h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                                          <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Examination</p>
                                          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                            {item.price_of_examination ? `$${Number(item.price_of_examination).toLocaleString()}` : "N/A"}
                                          </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                                          <p className="text-xs font-semibold uppercase text-gray-400 mb-2">Subscription</p>
                                          <p className="text-2xl font-bold text-Primary dark:text-violet-400">
                                            {item.subscription ? `$${Number(item.subscription).toLocaleString()}` : "N/A"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
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
    <DashboardLayout title="Doctors Management" loading={!doctors}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-row gap-4 w-full md:w-auto flex-1">
          {/* Search Input */}
          <div className="relative w-full max-w-md shadow-sm">
            <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor name..."
              className="rounded-2xl border-2 px-12 py-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 dark:text-white w-full focus:outline-none focus:border-Primary transition-colors"
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department Filter Buttons */}
          <div className="flex overflow-x-auto scroll-hidden gap-2 items-center">
            {departments.map((dept, idx) => (
              <button
                key={idx}
                onClick={() =>
                  setSelectedDepartment((prev) => (prev === dept ? "All" : dept))
                }
                className={`px-5 py-2 rounded-xl font-semibold transition-all shadow-sm border whitespace-nowrap ${selectedDepartment !== dept
                  ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-Primary/50"
                  : "border-transparent bg-gradient-to-r from-Primary/90 to-Primary text-white shadow-Primary/30 shadow-md"
                  }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Create Doctor Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all font-bold whitespace-nowrap"
        >
          <FaPlus size={14} /> Add New Doctor
        </button>
      </div>

      {sortedData.length > 0 ? (
        renderTable("Registered Doctors", sortedData)
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <FaFileSignature size={48} className="text-gray-400" />
          </div>
          <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No doctors found</p>
          <p className="text-gray-500">Try adjusting your filters or search term.</p>
        </div>
      )}

      <CreateDoctorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchDoctors();
        }}
      />
    </DashboardLayout>
  );
}

export default Page;

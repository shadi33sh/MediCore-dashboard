'use client'
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import axiosInstance from '../../AuthAxios';
import DashboardLayout from '../managerComponents/adminDashboardLayout';
import { IoSearch } from 'react-icons/io5';

function Page() {
  const [doctors, setDoctors] = useState([]);
  const [openTable, toggleTable] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    async function getDoctors() {
      try {
        const response = await axiosInstance.get('api/doctor');
        setDoctors(response.data.data.doctors);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    }

    getDoctors();
  }, []);

  const filteredDoctors = doctors.filter(({ department, user }) => {
    const departmentMatch = selectedDepartment === 'All' || department.name === selectedDepartment;
    const searchLower = searchTerm.toLowerCase();
    const searchMatch = user.first_name.toLowerCase().includes(searchLower) || user.last_name.toLowerCase().includes(searchLower);
    
    return departmentMatch && searchMatch;
  });

  const departments = ['All', ...new Set(doctors.map(doc => doc.department.name))];

  const handleSort = (column: string) => {
    setSortOrder((prevOrder) => (sortColumn === column && prevOrder === 'asc' ? 'desc' : 'asc'));
    setSortColumn(column);
  };
  
  const sortedData = [...filteredDoctors].sort((a, b) => {

    if (!sortColumn) return 0;
  
    const valueA = sortColumn === 'name' ? `${a.user.first_name} ${a.user.last_name}` : a.department.name;
    const valueB = sortColumn === 'name' ? `${b.user.first_name} ${b.user.last_name}` : b.department.name;
  
    return sortOrder === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });
  const renderTable = (title: string, data: any) => {
    return (
      <div className="mb-3">
        <button
          className="text-left w-full text-md font-bold flex items-center gap-3 px-4 py-2 mb-2 rounded-md dark:hover:bg-gray-700 hover:bg-gray-100"
          onClick={() => toggleTable(!openTable)}
        >
          {openTable ? <> <FaChevronDown /> {title} </> : <> <FaChevronRight /> {title} </>}
        </button>

        <AnimatePresence>
          {openTable && (
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
                     <th className="p-3 cursor-pointer" onClick={() => handleSort('name')}>
                       Doctor Name {sortColumn === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                     </th>
                     <th className="p-3 cursor-pointer" onClick={() => handleSort('department')}>
                       Department {sortColumn === 'department' && (sortOrder === 'asc' ? '▲' : '▼')}
                     </th>
                     <th className="p-3">Phone</th>
                     <th className="p-3">Email</th>
                   </tr>
                 </thead>

                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={idx} className="transition duration-300 ease-in-out dark:hover:bg-gray-700 hover:bg-gray-100 even:bg-gray-50 dark:even:bg-gray-800 border-b border-gray-300 dark:border-gray-700 cursor-pointer" onClick={async()=>await axiosInstance.get(`api/getDoctorById/${item.id}`)}>
                        <td className="p-4 text-sm font-semibold text-teal-600 dark:text-teal-300">{`${item.user.first_name} ${item.user.last_name}`}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.department.name}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.user.phone}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.user.email}</td>
                      </tr>
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
    <DashboardLayout title="Doctors" loading={!doctors}>
      <div className="mb-4 flex gap-3">
        
      <div className="flex flex-row gap-4 w-full">
          {/* Search Input */}
          <div className="relative w-full max-w-md">
            <IoSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search by doctor name..."
              className="rounded-xl border px-10 py-2 bg-gray-200 dark:bg-gray-900 border-Cyan/40 dark:text-white w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Department Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedDepartment !== dept 
                    ? 'dark:bg-gray-700/50 bg-gray-700/10' 
                    : 'dark:bg-Primary bg-Cyan/70'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sortedData.length > 0 ? renderTable('Doctors', sortedData) : <p>No doctors found.</p>}

    </DashboardLayout>
  );
}

export default Page;

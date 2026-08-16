'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../AuthAxios';
import { useAlert } from '../../../Components/Alert';
import Loading from '../../../Components/loading';

import { FiCheck, FiSave } from 'react-icons/fi';

const weekDays = [
  { id: 1, name: 'Sunday' },
  { id: 2, name: 'Monday' },
  { id: 3, name: 'Tuesday' },
  { id: 4, name: 'Wednesday' },
  { id: 5, name: 'Thursday' },
  { id: 6, name: 'Saturday' },
];

export default function AddMonthlyWorkDays() {
  const [departments, setDepartments] = useState([]);
  const [assignments, setAssignments] = useState({}); // key: `${deptId}-${dayId}` => doctorId
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  const getDepartments = async () => {
    try {
      const response = await axiosInstance.get('/api/department');
      setDepartments(response.data.data.departments);
    } catch (error: any) {
      showAlert('error', 'Failed to fetch departments')
    }
  };

  const getCurrentAssignments = async () => {
    try {
      const response = await axiosInstance.get('/api/secretary/leave');
      const current = response.data.data;
      const map = {};

      current.forEach(item => {
        const { doctor_id, day_id } = item;

        const dept = departments.find(dept =>
          (dept.doctors || []).some(doc => doc.doctor.id === doctor_id)
        );

        if (dept) {
          const key = `${dept.id}-${day_id}`;
          map[key] = doctor_id;
        }
      });

      setAssignments(map);
    } catch (error: any) {
      showAlert('error', 'Failed to fetch current assignments')

    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      getCurrentAssignments();
    }
  }, [departments]);

  const handleSelectChange = (deptId, dayId, doctorId) => {
    const key = `${deptId}-${dayId}`;
    setAssignments(prev => ({
      ...prev,
      [key]: parseInt(doctorId),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const mapped = Object.entries(assignments)
      .filter(([, doctor_id]) => doctor_id)
      .map(([key, doctor_id]) => {
        const [department_id, day_id] = key.split('-').map(Number);
        return { department_id, day_id, doctor_id };
      });

    try {
      await axiosInstance.post('/api/secretary/leave', mapped);
      showAlert('success', 'Schedule submitted successfully');
    } catch (error: any) {
      console.error(error);
      showAlert('error', 'Error while adding the work days');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {departments.length === 0 ? (
        <div className="flex items-center justify-center h-[80vh]">
          <Loading />
        </div>
      ) : (
        <div className="w- relative  flex flex-col ">
          <div className="flex-1 pt-4 overflow-y-auto custom-scrollbar">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Monthly Work Days</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Assign doctors to their active working days for each department.</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-Primary to-teal-500 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl py-2.5 px-8 text-sm font-bold shadow-lg shadow-Primary/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loading size={16} color="#fff" />
                ) : (
                  <>
                    <FiSave size={16} />
                    <span>Save Schedule</span>
                  </>
                )}
              </button>

            </div>

            <div className="">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 text-sm border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-4 px-5 text-left text-sm font-bold uppercase tracking-wider sticky left-0 bg-gray-50/90 dark:bg-gray-800/90 backdrop-blur z-10">
                      Department
                    </th>
                    {weekDays.map(day => (
                      <th
                        key={day.id}
                        className="py-4 px-3 text-left text-sm font-bold uppercase tracking-wider min-w-[160px]"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-Primary"></div>
                          <span>{day.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                  {departments.map((dept, index) => (
                    <tr
                      key={dept.id}
                      className="group transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >
                      <td className="px-5 py-4 font-semibold text-gray-800 dark:text-gray-200 sticky left-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/40 z-10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-Primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-Primary font-bold text-xs">{dept.name.charAt(0)}</span>
                          </div>
                          <span className="text-sm whitespace-nowrap">{dept.name}</span>
                        </div>
                      </td>
                      {weekDays.map(day => {
                        const key = `${dept.id}-${day.id}`;
                        const isSelected = !!assignments[key];
                        return (
                          <td key={key} className="px-3 py-4">
                            <select
                              value={assignments[key] || ''}
                              onChange={e => handleSelectChange(dept.id, day.id, e.target.value)}
                              className={`
                                w-full px-3 py-2 rounded-xl text-sm font-medium
                                transition-all duration-200 outline-none
                                focus:ring-2 focus:ring-Primary/40 focus:border-Primary
                                ${isSelected
                                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/50 shadow-sm'
                                  : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 border-dashed'}
                              `}
                            >
                              <option value="" className="text-gray-400 italic">
                                — Unassigned —
                              </option>
                              {dept.doctors.map(doc => (
                                <option
                                  key={doc.doctor.id}
                                  value={doc.doctor.id}
                                  className="text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 not-italic font-semibold"
                                >
                                  Dr. {doc?.doctor.user?.first_name} {doc?.doctor.user?.last_name}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sticky Bottom Bar */}

        </div>
      )}
    </>
  );
}

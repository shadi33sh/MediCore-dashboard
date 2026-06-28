'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../AuthAxios';
import { useAlert } from '../../../Components/Alert';
import Loading from '../../../Components/loading';
import { PusherPrivateListener } from '../../pusher';

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
  const { showAlert } = useAlert();

  const getDepartments = async () => {
    try {
      const response = await axiosInstance.get('/api/department');
      setDepartments(response.data.data.departments);
    } catch (error : any) {
      showAlert( 'error' , 'Failed to fetch departments')
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
          (dept.doctors || []).some(doc => doc.id === doctor_id)
        );

        if (dept) {
          const key = `${dept.id}-${day_id}`;
          map[key] = doctor_id;
        }
      });

      setAssignments(map);
    } catch (error : any) {
      showAlert( 'error' , 'Failed to fetch current assignments')

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
    const mapped = Object.entries(assignments)
      .filter(([, doctor_id]) => doctor_id)
      .map(([key, doctor_id]) => {
        const [department_id, day_id] = key.split('-').map(Number);
        return { department_id, day_id, doctor_id };
      });

    try {
      await axiosInstance.post('/api/secretary/leave', mapped);
      showAlert('success', 'Schedule submitted successfully');
    } catch (error : any) {
      console.error(error);
      showAlert('error', 'Error while adding the work days');
    }
  };


  return (
    <>
      {departments.length === 0 ? (
        <div className="center h-[80vh]">
          <Loading />
        </div>
      ) : (
        <div className="w-full p-6  h-[80vh] overflow-scroll scroll-hidden pb-20">
          <div className="overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-600 -md">
          <table className="w-full text-left rounded-xl overflow-hidden shadow-lg   bg-white dark:bg-gray-800">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-collapse text-gray-700 dark:text-gray-200 text-sm">
                <tr>
                  <th className="py-4 px-4 border-b-2 border-gray-200 dark:border-gray-600 text-left text-lg font-semibold tracking-wide">
                    Department
                  </th>
                  {weekDays.map(day => (
                    <th
                      key={day.id}
                      className="py-4 px-4 border-b-2 border-gray-200 dark:border-gray-600 text-left text-lg font-semibold tracking-wide min-w-[180px]"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{day.name}</span>
                        <div className="w-2 h-2 rounded-full bg-Primary"></div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr 
                    key={dept.id} 
                    className={`
                      transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50
                      ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-25 dark:bg-gray-800/50'}
                    `}
                  >
                    <td className=" px-4 py-4 font-semibold text-gray-800 dark:text-white ">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-Primary"></div>
                        <span className="text-base">{dept.name}</span>
                      </div>
                    </td>
                    {weekDays.map(day => {
                      const key = `${dept.id}-${day.id}`;
                      return (
                        <td key={key} className=" px-4 py-4">
                          <select
                            value={assignments[key] || ''}
                            onChange={e => handleSelectChange(dept.id, day.id, e.target.value)}
                            className="
                              w-full px-3 py-2 rounded-xl 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              transition-all duration-200 
                              hover:border-Primary
                              focus:border-Primary focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30
                              focus:outline-none
                              text-sm font-medium
                              shadow-sm hover:shadow-md
                            "
                          >
                            <option value="" className="text-gray-500 dark:text-gray-400">

                            </option>
                            {dept.doctors.map(doc => (
                              <option 
                                key={doc.doctor.id} 
                                value={doc.doctor.id}
                                className="text-gray-900 dark:text-white bg-white dark:bg-gray-700"
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

          <div className=" w-full absolute bottom-0 bg-gray-800 h-20">
            <button
              onClick={handleSubmit}
             className='bg-Primary rounded-xl p-2 px-20 text-lg font-semibold translate-y-3'
            >
              Submit Schedule
            </button>
          </div>
        </div>
      )}
    </>
  );
}

'use client'
import React, { useState } from 'react'
import DashboardLayout from './doctorComponents/DocDashboardLayout'
import {motion, AnimatePresence } from 'framer-motion';
import BMICalculator from './doctorComponents/BMIcalculator';
import MedicalChatbot from './doctorComponents/MedicalChatbot';
import { PusherPrivateListener } from '../pusher';

export default function page() {
    const [openDetails, setOpenDetails] = useState<{ [key: string]: boolean }>({});

    const toggleDetails = (key: string) => {
        setOpenDetails(prev => ({
          [key]: !prev[key],
        }));
      };

    const doctor =  {
      name: 'Sara Khoury',
      section: 'Cardiology',
      rating: 4.8,
      image: '/images/doctors/sara.png',
    }
    const schedules = [
        {
          date: '2025-05-27',
          time: '10:00 AM',
          patient: {
            name: 'Ali Mahmoud',
            age: 45,
            gender: 'Male',
            medicalStatus: 'Hypertension',
          },
        },
        {
          date: '2025-05-28',
          time: '12:30 PM',
          patient: {
            name: 'Rana Al-Khatib',
            age: 32,
            gender: 'Female',
            medicalStatus: 'Follow-up after surgery',
          },
        },
        {
          date: '2025-05-28',
          time: '02:30 PM',
          patient: {
            name: 'Rana Al-Khatib',
            age: 32,
            gender: 'Female',
            medicalStatus: 'Follow-up after surgery',
          },
        },
    ];
      
    const renderTable = (title: string, data: typeof schedules) => {
        return (
          <div className="mb-3">
            <h2 className="text-lg font-bold px-4 py-2 mb-2">{title}</h2>
            <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
              <table className="min-w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => {
                    const uniqueKey = `accepted-${item.date}-${item.time}`;
                    return (
                      <React.Fragment key={uniqueKey}>
                        <tr
                          className="transition duration-300 ease-in-out dark:hover:bg-gray-700 hover:bg-gray-100 even:bg-gray-50 dark:even:bg-gray-800 border-b border-gray-300 dark:border-gray-700 cursor-pointer"
                          onClick={() => toggleDetails(uniqueKey)}
                        >
                          <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.date}</td>
                          <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-200">{item.time}</td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{item.patient.name}</td>
                          <td className="p-4 text-sm font-bold text-teal-500 dark:text-teal-300">
                            {openDetails[uniqueKey] ? '▲ Hide' : '▼ Show'}
                          </td>
                        </tr>
      
                        <AnimatePresence>
                          {openDetails[uniqueKey] && (
                            <tr>
                              <td colSpan={4} className="p-0">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-6 bg-gray-100 dark:bg-gray-800/30 rounded-b-xl border-t border-gray-300 dark:border-gray-700">
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 20 }}
                                      transition={{ duration: 0.4 }}
                                      className="dark:bg-gray-900 bg-white rounded-xl shadow-lg p-5 w-full sm:w-96"
                                    >
                                      <h3 className="text-xl font-bold mb-3">Patient Info</h3>
                                      <p><span className="font-semibold text-teal-400">Name: </span>{item.patient.name}</p>
                                      <p><span className="font-semibold text-teal-400">Age: </span>{item.patient.age}</p>
                                      <p><span className="font-semibold text-teal-400">Gender: </span>{item.patient.gender}</p>
                                      <p><span className="font-semibold text-teal-400">Medical Status: </span>{item.patient.medicalStatus}</p>
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
          </div>
        );
      };

    PusherPrivateListener(19)

  return (
    <DashboardLayout title={`Dr.${doctor.name} Dashboard`}>
        {renderTable("Incoming Appointments", schedules)}
    </DashboardLayout>
  )
}

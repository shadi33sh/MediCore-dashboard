'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface Schedule {
  time: string
  patientId: string
  patientName: string
  description: string
}

interface Doctor {
  name: string
  phone: string
  section: string
  rating: number
  image: string
  description: string
  schedules: Schedule[]
}

interface DoctorModalProps {
  doctor: Doctor
  onClose: () => void
}

const DoctorModal: React.FC<DoctorModalProps> = ({ doctor, onClose }) => {
  const generateTimeSlots = () => {
    const slots = []
    const start = new Date()
    start.setHours(9, 0, 0, 0)
    const end = new Date()
    end.setHours(17, 0, 0, 0)

    while (start < end) {
      const timeStr = start.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      slots.push(timeStr)
      start.setMinutes(start.getMinutes() + 30)
    }

    return slots
  }

  const allSlots = generateTimeSlots()
  const scheduleMap = new Map()

  doctor.schedules.forEach((schedule) => {
    const match = schedule.time.match(/(\d{1,2}:\d{2}\s[AP]M)/)
    const time = match?.[1]
    if (time) {
      scheduleMap.set(time, schedule)
    }
  })

  return (
    <>
      <motion.div
        className="absolute -top-6 left-0 center w-screen h-screen bg-black/70 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="fixed scroll-hidden top-10 h-[90vh] overflow-scroll left-[25%] z-50 w-[50%] dark:text-white bg-gray-200 dark:bg-gray-900 rounded-xl shadow-lg p-8"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
        >
          &times;
        </button>

        <div className="flex flex-col items-center text-center">
          <img
            src={doctor.image}
            className="w-28 h-28 rounded-full border-4 border-teal-500 mb-4 object-cover"
            alt={doctor.name}
          />
          <h3 className="text-2xl font-bold">{doctor.name}</h3>
          <p className="text-teal-400">{doctor.section}</p>
          <p className="text-yellow-400 font-semibold mt-1">⭐ {doctor.rating}</p>
          <p>{doctor.phone}</p>
          <p className="text-sm dark:text-gray-300 mt-4">{doctor.description}</p>

          <div className="mt-6 w-full">
            <h4 className="dark:text-white font-semibold mb-4">Daily Schedule (9 AM – 5 PM):</h4>
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
                         {allSlots.map((slot, i) => {
                           const data = scheduleMap.get(slot)
                           const isEmpty = !data
                        
                           return (
                             <tr
                               key={i}
                               className={`relative group ${
                                 data ? 'dark:hover:bg-gray-700/50 hover:bg-gray-300' : 'opacity-60'
                               } text-gray-600 dark:text-gray-100`}
                             >
                               {isEmpty && (
                                 <td colSpan={3} className="relative p-0 border-b border-gray-700">
                                   <div className="absolute inset-0 z-10 flex items-center justify-center bg-teal-600 bg-opacity-90 text-white text-sm sm:text-base md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded">
                                     Add appointment in this time
                                   </div>
                                   <div className="flex">
                                     <div className="px-4 py-5 w-1/3 ">{slot}</div>
                                     <div className="px-4 py-5 w-1/3 "></div>
                                     <div className="px-4 py-5 w-1/3 "></div>
                                   </div>
                                 </td>
                               )}

                               {!isEmpty && (
                                 <>
                                   <td className="px-4 py-5 border-b border-gray-700 relative z-0">{slot}</td>
                                   <td className="px-4 py-5 border border-gray-700 relative z-0">{data.patientName}</td>
                                   <td className="px-4 py-5 border-b border-gray-700 relative z-0">{data.description}</td>
                                 </>
                               )}
                             </tr>
                           )
                         })}
                        </tbody>

              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default DoctorModal

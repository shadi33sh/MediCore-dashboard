'use client'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../secretaryComponents/DashboardLayout'
import { useSearchParams } from 'next/navigation'
import { useAlert } from '../../../Components/Alert'
import axiosInstance from '../../AuthAxios'
import dayjs from 'dayjs'
import Loading from '../../../Components/loading'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCalendar, FiCheck, FiClock, FiUser, FiX } from 'react-icons/fi'
import { MdOutlineLocalHospital } from 'react-icons/md'

export default function ScheduleAppointmentPage() {
  const searchParams = useSearchParams()
  const patientID = searchParams.get('patient')
  const doctorID = searchParams.get('doctor')
  const appointmentDate = searchParams.get('date')
  const department = searchParams.get('department')

  const [selectedDoctorName, setSelectedDoctorName] = useState()
  const [isModal, setModal] = useState(false)
  const [loadingAppointments, setAppointmentsLoading] = useState(false)

  const [submitLoading, setLoading] = useState(false)

  const [selectedDoctorID, setDoctorID] = useState(doctorID || null)
  const [selectedPatientID, setPatientID] = useState(patientID || '')
  const [selectedAppointmentDate, setAppointmentDate] = useState(appointmentDate || null)
  const [selectedDepartmentID, setDepartmentID] = useState(department || null)
  const [filteredTable, setFilteredTable] = useState([])

  const [availableDoctors, setAvailableDoctors] = useState([])

  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [scheduleTable, setScheduleTable] = useState([])
  const [doctorAppiontments, setDoctorAppiontments] = useState([])
  const [selectedAppointmentFinelTime, setAppointmentFinalTime] = useState(appointmentDate || null)
  const [isPatientInSystem, setIsPatientInSystem] = useState(true)

  const [newPatientData, setNewPatientData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    age: '',
    blood_type: '',
    chronic_diseases: '',
    medication_allergies: '',
    permanent_medications: '',
    previous_surgeries: '',
    previous_illnesses: '',
    medical_analysis: '',
  })

  const bookedSlots = React.useMemo(() => {
    if (!doctorAppiontments) return []
    return doctorAppiontments.map((app: any) => {
      const time = app.apointment_date.split(' ')[1]
      const patientName = `${app.patient?.first_name || ''} ${app.patient?.last_name || ''}`
      return { time, patientName }
    })
  }, [doctorAppiontments])

  const appointmentTimes = [
    '09:00:00', '09:30:00', '10:00:00', '10:30:00',
    '11:00:00', '11:30:00', '12:00:00', '12:30:00',
    '13:00:00', '13:30:00', '14:00:00', '14:30:00',
    '15:00:00', '15:30:00', '16:00:00', '16:30:00',
    '23:30:00'
  ]

  const freeSlots = React.useMemo(() => {
    return appointmentTimes.filter(t => !bookedSlots.includes(t as any))
  }, [appointmentTimes, bookedSlots])

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const { showAlert } = useAlert()

  const getMonthlyTable = async () => {
    try {
      const response = await axiosInstance.get('api/secretary/leave')
      setScheduleTable(response.data.data || [])
    } catch {
      showAlert('error', 'Error while fetching doctor schedule')
    }
  }

  const getDoctors = async () => {
    try {
      const response = await axiosInstance.get('api/doctor')
      setDoctors(response.data.data.doctors || [])
    } catch {
      showAlert('error', 'Error while fetching doctors')
    }
  }

  const getDepartments = async () => {
    try {
      const response = await axiosInstance.get('api/department')
      setDepartments(response.data.data.departments || [])
    } catch {
      showAlert('error', 'Error while fetching departments')
    }
  }

  const getDayId = (jsDay: number) => {
    switch (jsDay) {
      case 0: return 1
      case 1: return 2
      case 2: return 3
      case 3: return 4
      case 4: return 5
      case 6: return 6
      default: return null
    }
  }

  const generateMonthDays = () => {
    const today = dayjs()
    const year = today.year()
    const month = today.month()
    const daysInMonth = dayjs().daysInMonth()
    const days = []

    for (let i = 1; i <= daysInMonth; i++) {
      const date = dayjs(new Date(year, month, i))
      const jsDay = date.day()
      const day_id = getDayId(jsDay)
      const doctorsForThatDay = filteredTable.filter((entry: any) => entry.day_id === day_id)

      days.push({
        date: date.format('YYYY-MM-DD'),
        doctors: doctorsForThatDay,
        doctorNames: doctorsForThatDay.map((d: any) => d.doctor_name),
        doctorIds: doctorsForThatDay.map((d: any) => d.doctor_id),
        clickable: doctorsForThatDay.length > 0,
      })
    }

    return days
  }

  const today = dayjs()
  const currentMonthLabel = today.format('MMMM YYYY')

  useEffect(() => {
    getMonthlyTable()
    getDoctors()
    getDepartments()
  }, [])

  useEffect(() => {
    if (!selectedDepartmentID || !doctors.length || !scheduleTable.length) {
      setFilteredTable([])
      setAvailableDoctors([])
      return
    }

    const departmentDoctorIds = doctors
      .filter((doc: any) => doc.department_id === parseInt(selectedDepartmentID))
      .map((doc: any) => doc.id)

    const filtered = scheduleTable
      .filter((entry: any) => departmentDoctorIds.includes(entry.doctor_id))
      .map((entry: any) => {
        const matchingDoctor = doctors.find((doc: any) => doc.id === entry.doctor_id)
        return {
          ...entry,
          doctor_name: matchingDoctor
            ? `${matchingDoctor.user.first_name} ${matchingDoctor.user.last_name}`
            : 'Unknown Doctor',
        }
      })
    setFilteredTable(filtered)
    setFilteredTable(filtered)
    const uniqueDoctorIds = Array.from(new Set(filtered.map((entry: any) => entry.doctor_id)))
    const matchedDoctors = doctors.filter((doc: any) => uniqueDoctorIds.includes(doc.id))
    setAvailableDoctors(matchedDoctors)
  }, [selectedDepartmentID, doctors, scheduleTable])

  useEffect(() => {
    const getAppointmentsOfDoctor = async () => {
      setDoctorAppiontments(null)
      setSelectedTimeSlot(null)

      if (selectedDoctorID && selectedAppointmentDate) {
        setAppointmentsLoading(true)
        const response = await axiosInstance.get(`api/secretary/appointment/${selectedDoctorID}/${selectedAppointmentDate}`)
        setDoctorAppiontments(response.data.data.appointments)
        setAppointmentsLoading(false)
      }
    }
    getAppointmentsOfDoctor()
  }, [selectedDoctorID, selectedAppointmentDate])

  useEffect(() => {
    setAppointmentDate(null)
    setDoctorID(null)
    setAppointmentFinalTime(null)
    setDoctorAppiontments(null)
    setSelectedTimeSlot(null)
  }, [selectedDepartmentID])

  const handleSchedule = async () => {
    setLoading(true)
    try {
      isPatientInSystem
        ? await axiosInstance.post('api/secretary/appointment', { patient_id: selectedPatientID, doctor_id: selectedDoctorID, apointment_date: selectedAppointmentFinelTime })
        : await axiosInstance.post('api/secretary/unapp/appointment', { patient_id: selectedPatientID, doctor_id: selectedDoctorID, appointment_date: selectedAppointmentFinelTime, ...newPatientData })

      showAlert('success', 'Appointment scheduled successfully.')
      setModal(false)
      setDoctorID(null)
      setAppointmentDate(null)
    } catch (err: any) {
      showAlert('error', err.response.data.data ? err.response.data.data : err.response.data?.msg)
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  // Whether the confirm button should be visible
  const showConfirm = isPatientInSystem
    ? !!(selectedPatientID && selectedAppointmentFinelTime && !loadingAppointments && selectedTimeSlot)
    : !!(newPatientData.first_name && newPatientData.last_name && selectedAppointmentFinelTime && !loadingAppointments && selectedTimeSlot)

  return (
    <DashboardLayout title={`Schedule New Appointment · ${currentMonthLabel}`} loading={departments.length === 0}>

      <form className="space-y-6">

        {/* ── Patient Section ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          {/* Toggle row */}
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPatientInSystem}
                  onChange={() => setIsPatientInSystem(!isPatientInSystem)}
                  className="sr-only peer"
                  id="patient-exists-toggle"
                />
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-Primary rounded-full peer-checked:bg-Primary/70 transition-colors" />
                <div className="absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow transform transition-transform peer-checked:translate-x-6" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Patient exists in system
              </span>
            </label>
          </div>

          {/* Existing patient ID input */}
          {!patientID && isPatientInSystem && (
            <div className="relative max-w-xs">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Enter Patient ID"
                value={selectedPatientID}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary transition"
                onChange={(e: any) => setPatientID(e.target.value)}
              />
            </div>
          )}

          {/* New patient form */}
          {!isPatientInSystem && (
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(newPatientData).map(([field, value]) => (
                <div key={field}>
                  <input
                    type={field === 'birth_date' ? 'date' : 'text'}
                    placeholder={field.replace(/_/g, ' ')}
                    name={field}
                    value={value}
                    onChange={(e: any) =>
                      setNewPatientData((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 capitalize focus:outline-none focus:ring-2 focus:ring-Primary transition"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Department Pills ── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <MdOutlineLocalHospital className="text-Primary" size={18} />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Department</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {departments.map((dep: any) => (
              <button
                type="button"
                key={dep.id}
                onClick={() => setDepartmentID(dep.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border
                  ${selectedDepartmentID != dep.id
                    ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-Primary hover:text-Primary'
                    : 'bg-Primary border-Primary text-white shadow-md shadow-Primary/20'}`}
              >
                {dep.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Calendar ── */}
        {selectedDepartmentID && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar className="text-Primary" size={16} />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{currentMonthLabel}</p>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 gap-2 text-xs text-center text-gray-400 font-semibold mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-2">
              {generateMonthDays().map((day) => {
                const isToday = dayjs(day.date).isSame(today, 'day')
                const isPast = dayjs(day.date).isBefore(today, 'day')
                const isSelected = dayjs(selectedAppointmentDate).isSame(day.date, 'day')

                const baseStyle = day.clickable && !isPast
                  ? 'cursor-pointer border-2 hover:border-Primary'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed opacity-50'

                const todayHighlight = isToday ? 'border-Primary' : 'border-transparent'
                const selectedBorder = isSelected
                  ? 'shadow-md bg-Primary text-white border-Primary'
                  : 'text-Primary bg-gray-100 dark:bg-gray-800'

                return (
                  <div
                    key={day.date}
                    onClick={() => {
                      if (day.clickable && !isPast && day.doctors.length) {
                        setAppointmentDate(day.date)
                        setDoctorID(day.doctors[0].doctor_id)
                        setSelectedDoctorName(day.doctors[0].doctor_name)
                      }
                    }}
                    className={`p-2 rounded-xl text-sm shadow-sm transition-all text-center ${baseStyle} ${todayHighlight} ${selectedBorder}`}
                  >
                    <div className="font-bold mb-1 dark:text-white text-xs">{dayjs(day.date).format('D')}</div>
                    {day.doctors.map((doc: any) => (
                      <div key={doc.doctor_id} className="text-[9px] font-bold truncate">
                        {doc.doctor_name}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Loading spinner ── */}
        {loadingAppointments && (
          <div className="w-full flex items-center justify-center h-44">
            <Loading size={43} />
          </div>
        )}

        {/* ── Time Slots ── */}
        {doctorAppiontments && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="text-Primary" size={16} />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Choose a Time Slot</p>
              {selectedDoctorName && (
                <span className="ml-auto text-xs bg-Primary/10 text-Primary px-3 py-1 rounded-full font-medium">
                  Dr. {selectedDoctorName}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {appointmentTimes.map(time => {
                const slot = bookedSlots.find((s: any) => s.time === time)
                const isBooked = !!slot

                let isPastTime = false
                if (selectedAppointmentDate) {
                  const todayStr = dayjs().format('YYYY-MM-DD')
                  if (selectedAppointmentDate === todayStr) {
                    const slotDateTime = dayjs(`${selectedAppointmentDate} ${time}`, 'YYYY-MM-DD HH:mm:ss')
                    if (slotDateTime.isBefore(dayjs())) isPastTime = true
                  }
                }

                const disabled = isBooked || isPastTime
                const displayLabel = dayjs(`${selectedAppointmentDate} ${time}`).format('HH:mm')
                const isSelected = selectedTimeSlot === time

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      if (!disabled) {
                        setSelectedTimeSlot(time)
                        setAppointmentFinalTime(dayjs(`${selectedAppointmentDate} ${time}`).format('YYYY-MM-DD HH:mm'))
                        setTimeout(() => {
                          if (selectedPatientID && selectedAppointmentFinelTime && !loadingAppointments && selectedTimeSlot)
                            setModal(true)
                        }, 300)
                      }
                    }}
                    className={`relative flex flex-col items-center justify-center h-14 rounded-xl text-sm font-bold shadow-sm transition-all
                      ${disabled
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                        : isSelected
                          ? 'bg-Primary text-white shadow-md shadow-Primary/30 scale-105'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-white hover:bg-Primary/10 hover:text-Primary border border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    <span>{displayLabel}</span>
                    {isBooked && slot?.patientName && (
                      <span className="text-[9px] font-semibold text-rose-400 truncate max-w-full px-1">
                        {slot.patientName}
                      </span>
                    )}
                    {isBooked && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-400" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" /> Booked
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-Primary inline-block" /> Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 inline-block" /> Available
              </span>
            </div>
          </div>
        )}

        {/* ── Confirm button ── */}
        {isPatientInSystem
          ? selectedPatientID && selectedAppointmentFinelTime && !loadingAppointments && selectedTimeSlot && (
            <div className="flex justify-end">
              <motion.button
                type="button"
                onClick={() => setModal(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-gradient-to-r from-Primary to-teal-500 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-Primary/30 hover:shadow-xl transition-shadow"
              >
                <FiCheck size={16} />
                Confirm Appointment
              </motion.button>
            </div>
          )
          : newPatientData.first_name && newPatientData.last_name && selectedAppointmentFinelTime && !loadingAppointments && selectedTimeSlot && (
            <div className="flex justify-end">
              <motion.button
                type="button"
                onClick={() => setModal(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-gradient-to-r from-Primary to-teal-500 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-Primary/30 hover:shadow-xl transition-shadow"
              >
                <FiCheck size={16} />
                Confirm Appointment
              </motion.button>
            </div>
          )
        }

      </form>

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {isModal && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed flex items-center justify-center -top-6 inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >

              <motion.div
                className=" z-50
                         w-[92vw] max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
                initial={{ scale: 0.88, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              >
                {/* Gradient header strip */}
                <div className="h-2 w-full bg-gradient-to-r from-Primary to-teal-400" />

                <div className="p-7">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-Primary/10 flex items-center justify-center">
                        <FiCalendar className="text-Primary" size={18} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
                          Confirm Appointment
                        </h2>
                        <p className="text-xs text-gray-400">Please review the details below</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setModal(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors flex items-center justify-center text-gray-500"
                    >
                      <FiX size={15} />
                    </button>
                  </div>

                  {/* Detail cards */}
                  <div className="space-y-3 mb-7">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <FiClock size={14} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Date & Time</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          {new Date(selectedAppointmentFinelTime).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: 'numeric', minute: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                        <FiUser size={14} className="text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Patient</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          {isPatientInSystem
                            ? `ID: ${selectedPatientID}`
                            : `${newPatientData.first_name} ${newPatientData.last_name}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                        <MdOutlineLocalHospital size={15} className="text-violet-500" />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">Doctor</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                          Dr. {selectedDoctorName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {!submitLoading ? (
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setModal(false)}
                        className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <motion.button
                        type="button"
                        onClick={handleSchedule}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-Primary to-teal-500 text-white text-sm font-bold shadow-lg shadow-Primary/30 flex items-center justify-center gap-2"
                      >
                        <FiCheck size={15} />
                        Schedule
                      </motion.button>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center py-6">
                      <Loading size={30} />
                    </div>
                  )}
                </div>
              </motion.div>

            </motion.div>

            {/* Panel */}

          </>
        )}
      </AnimatePresence>

    </DashboardLayout>
  )
}

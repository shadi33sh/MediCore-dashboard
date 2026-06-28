'use client'
import React, { useEffect, useState } from 'react'
import DashboardLayout from '../secretaryComponents/DashboardLayout'
import { useSearchParams } from 'next/navigation'
import { useAlert } from '../../../Components/Alert'
import axiosInstance from '../../AuthAxios'
import dayjs from 'dayjs'
import Loading from '../../../Components/loading'
import {AnimatePresence, motion} from 'framer-motion'

export default function ScheduleAppointmentPage() {
  const searchParams = useSearchParams()
  const patientID = searchParams.get('patient')
  const doctorID = searchParams.get('doctor')
  const appointmentDate = searchParams.get('date')
  const department = searchParams.get('department')

  const [selectedDoctorName, setSelectedDoctorName] = useState();
  const [isModal , setModal] = useState(false)
  const [loadingAppointments , setAppointmentsLoading] = useState(false)

  const [submitLoading , setLoading] = useState(false)

  const [selectedDoctorID, setDoctorID] = useState(doctorID || null)
  const [selectedPatientID, setPatientID] = useState(patientID || '')
  const [selectedAppointmentDate, setAppointmentDate] = useState(appointmentDate || null)
  const [selectedDepartmentID, setDepartmentID] = useState(department || null)
  const [filteredTable, setFilteredTable] = useState([])

  const [availableDoctors, setAvailableDoctors] = useState([])

  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [scheduleTable, setScheduleTable] = useState([])
  const [doctorAppiontments,setDoctorAppiontments ] = useState([])
  const [selectedAppointmentFinelTime, setAppointmentFinalTime] = useState(appointmentDate || null)
  const [isPatientInSystem, setIsPatientInSystem] = useState(true);

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
  });

  const bookedSlots = React.useMemo(() => {
    if (!doctorAppiontments) return []
    return doctorAppiontments.map(app => {
      const time = app.apointment_date.split(' ')[1]; 
      const patientName = `${app.patient?.first_name || ''} ${app.patient?.last_name || ''}`;
      return { time, patientName };
    });
  }, [doctorAppiontments]);

  const appointmentTimes=[
    '09:00:00',
    '09:30:00',
    '10:00:00',
    '10:30:00',
    '11:00:00',
    '11:30:00',
    '12:00:00',
    '12:30:00',
    '13:00:00',
    '13:30:00',
    '14:00:00',
    '14:30:00',
    '15:00:00',
    '15:30:00',
    '16:00:00',
    '16:30:00',
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
        case 0: return 1; // Sunday → id 1
        case 1: return 2; // Monday → id 2
        case 2: return 3; // Tuesday → id 3
        case 3: return 4; // Wednesday → id 4
        case 4: return 5; // Thursday → id 5
        case 6: return 6; // Saturday → id 6
        default: return null; // Friday not scheduled
  };
   }
  
  const generateMonthDays = () => {
    const today = dayjs();
    const year = today.year();
    const month = today.month(); // 0-indexed
    const daysInMonth = dayjs().daysInMonth();
  
    const days = [];
  
    for (let i = 1; i <= daysInMonth; i++) {
      const date = dayjs(new Date(year, month, i));
      const jsDay = date.day(); // 0-6
      const day_id = getDayId(jsDay);
    
      const doctorsForThatDay = filteredTable.filter(entry => entry.day_id === day_id);
      
      days.push({
        date: date.format('YYYY-MM-DD'),
        doctors: doctorsForThatDay, // contains doctor_id and doctor_name
        doctorNames: doctorsForThatDay.map(d => d.doctor_name),
        doctorIds: doctorsForThatDay.map(d => d.doctor_id),
        clickable: doctorsForThatDay.length > 0
      });
      
      
    }
    
  
    return days;
  };

  const today = dayjs();
  const currentMonthLabel = today.format('MMMM YYYY');
//   const formData = new FormData()
//   formData.append('patient_id' , '2')
//   formData.append('appointment_date' , '22-2-2045')
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
      .filter(doc => doc.department_id === parseInt(selectedDepartmentID))
      .map(doc => doc.id)

      const filtered = scheduleTable
      .filter(entry => departmentDoctorIds.includes(entry.doctor_id))
      .map(entry => {
        const matchingDoctor = doctors.find(doc => doc.id === entry.doctor_id)
        return {
          ...entry,
          doctor_name: matchingDoctor
            ? `${matchingDoctor.user.first_name} ${matchingDoctor.user.last_name}`
            : 'Unknown Doctor'
        }
      })
    setFilteredTable(filtered)
    setFilteredTable(filtered)
    const uniqueDoctorIds = Array.from(new Set(filtered.map(entry => entry.doctor_id)))
    const matchedDoctors = doctors.filter(doc => uniqueDoctorIds.includes(doc.id))

    setAvailableDoctors(matchedDoctors)
  }, [selectedDepartmentID, doctors, scheduleTable])

  useEffect(()=>{
    const getAppointmentsOfDoctor = async()=>{
      setDoctorAppiontments(null)
      setSelectedTimeSlot(null)

      if(selectedDoctorID && selectedAppointmentDate){
        setAppointmentsLoading(true)
        // const res = await axiosInstance.post('api/secretary/apointment' , {doctor_id : '15' , apointment_date : '2025-06-16 02:30' , patient_id : '337117'})
        // console.log(res)
        const response = await axiosInstance.get(`api/secretary/appointment/${selectedDoctorID}/${selectedAppointmentDate}`)
        setDoctorAppiontments(response.data.data.appointments)
        setAppointmentsLoading(false) 
      }
    } 
    getAppointmentsOfDoctor()
  },[selectedDoctorID , selectedAppointmentDate]) 
  
  useEffect(()=>{
    setAppointmentDate(null)
    setDoctorID(null)
    setAppointmentFinalTime(null)
    setDoctorAppiontments(null)
    setSelectedTimeSlot(null)
  },[selectedDepartmentID])

  const handleSchedule = async () => {
    setLoading(true);
    // let patientIdToUse = selectedPatientID;
    // 1. Create patient if needed:
    // if (!isPatientInSystem) {
    //   try {
    //     const res = await axiosInstance.post('api/patient', newPatientData);
    //     patientIdToUse = res.data.data.id;
    //   } catch (err : any) {
    //     showAlert('error', 'Failed to create patient.');
    //     setLoading(false);
    //     return;
    //   }
    // }
    // 2. Schedule appointment:

    try {
      isPatientInSystem ?  await axiosInstance.post('api/secretary/appointment', { patient_id: selectedPatientID, doctor_id: selectedDoctorID, apointment_date: selectedAppointmentFinelTime})
       : await axiosInstance.post('api/secretary/unapp/appointment', { patient_id: selectedPatientID, doctor_id: selectedDoctorID, appointment_date: selectedAppointmentFinelTime , ...newPatientData});

      showAlert('success', 'Appointment scheduled successfully.');
      setModal(false);
      setDoctorID(null);
      setAppointmentDate(null);

    } catch (err : any) {
      showAlert('error', err.response.data.data?err.response.data.data : err.response.data?.msg );
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title={`Schedule New Appointment ${currentMonthLabel}`} loading={departments.length==0} >


       <form className="mt-6 space-y-4">
         <div style={{flexDirection  : !isPatientInSystem ? 'column'  : 'row' , alignItems  : isPatientInSystem ? 'center'  : 'start'}} className="gap-3 flex rounded-xl shadow-sm overflow-x-scroll scroll-hidden">

          <label style={{textWrap : 'nowrap'}} className="flex items-center cursor-pointer">
            {/* Hidden native checkbox */}
            <div className="relative">
              <input
                type="checkbox"
                checked={isPatientInSystem}
                onChange={() => setIsPatientInSystem(!isPatientInSystem)}
                className="sr-only peer"
                id="patient-exists-toggle"
              />
              {/* Background track */}
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-Primary rounded-full peer-checked:bg-Primary/70 transition-colors"></div>
              {/* Knob */}
              <div className="absolute left-1 top-1 bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow transform transition-transform peer-checked:translate-x-6"></div>
            </div>
            {/* Label text */}
            <span className="ml-3 text-gray-700 dark:text-gray-200 font-semibold">
              Patient exists
            </span>
          </label>

           <div style={{width  : !isPatientInSystem ? '100%'  : 'fit-content'}}>
               {!patientID && isPatientInSystem ? (
                 <div className='my-3'>
                   <input
                     type="text"
                     placeholder="Enter Patient ID"
                     value={selectedPatientID}
                     className="dark:bg-gray-900 bg-gray-100 p-2 rounded-xl pl-4"
                     onChange={(e : any) => setPatientID(e.target.value)}
                   />
                   
                 </div>
               ) : (
               <div>
                     <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                       {Object.entries(newPatientData).map(([field, value]) => (
                         <div key={field}>              
                           <input
                             type={field === 'birth_date' ? 'date' : 'text'}
                             placeholder={field}
                             name={field}
                             value={value}
                             onChange={(e : any) =>
                               setNewPatientData((prev) => ({
                                 ...prev,
                                 [field]: e.target.value,
                               }))
                             }
                             className="dark:bg-gray-900 bg-gray-100 p-3 w-full rounded-xl pl-4"
                           />
                         </div>
                       ))}
                       </div>
               </div>
            )}
          </div>

               
         <div className="flex items-center gap-3 flex-nowrap">
        {departments.map(dep => (
          <button 
             type='button'
             key={dep.id}
              onClick={() => setDepartmentID(dep.id)}
              style={{textWrap : 'nowrap'}}
              className={`px-4 py-2 rounded-xl font-medium transition-all  ${selectedDepartmentID != dep.id? 'dark:bg-gray-700/50 bg-gray-700/10' : 'bg-Primary text-white'}`}>
               {dep.name} 
            </button>
          ))}
      </div>
      
        </div>
        
        
        {selectedDepartmentID && (
          <div className="mt-8">
            {/* Month Title */}
            {/* <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white ">
              {currentMonthLabel}
            </h2> */}
                
                    {/* Weekday Labels */}
                    <div className="grid grid-cols-7 gap-2 text-sm text-center text-gray-500 dark:text-gray-400 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="font-semibold">{day}</div>
                      ))}
                    </div>
                    
                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {generateMonthDays().map((day) => {
                        const isToday = dayjs(day.date).isSame(today, 'day');
                        const isPast = dayjs(day.date).isBefore(today, 'day');
                        
                        const baseStyle = day.clickable && !isPast  
                           ? `cursor-pointer border-2  hover:border-Primary `
                           : 'bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed';
                        
                           const isSelected = dayjs(selectedAppointmentDate).isSame(day.date, 'day');
                           const todayHighlight = isToday ? 'border-Primary ' : 'border-white/0 ';
                           const selectedBorder = isSelected ? 'shadow-md bg-Primary text-white' : 'text-Primary bg-gray-100 dark:bg-gray-800';
                           
                         return (
                          <div
                          key={day.date}
                          onClick={() => {
                            if (day.clickable && !isPast && day.doctors.length) {
                              setAppointmentDate(day.date);
                              setDoctorID(day.doctors[0].doctor_id); // you can update to pick a specific doctor if needed
                              setSelectedDoctorName(day.doctors[0].doctor_name);
                            }
                          }}
                          className={`p-3 rounded-xl text-sm shadow-sm transition-all text-center ${baseStyle} ${todayHighlight} ${selectedBorder}`}
                        >
                        <div className="font-bold mb-1 dark:text-white">{dayjs(day.date).format('D')}</div>
                        {day.doctors.map((doc) => (
                          <div
                            key={doc.doctor_id} className={`text-xs  font-bold truncate`}>
                            {doc.doctor_name}
                          </div>
                        ))}
                      </div>
              );
            })}
          </div>
        </div>)}

        {loadingAppointments&& <div className='w-full center h-44'> <Loading size={43}/> </div>}

        {doctorAppiontments&&
          <div className="mt-4">
            <div className="text-md text-center text-gray-500 dark:text-gray-400 py-4">
                  <div className="font-semibold">choose a time</div>
             </div>
            <div className="grid grid-cols-4  gap-2">
             {appointmentTimes.map(time => {
                 const slot = bookedSlots.find(slot => slot.time === time);
                 const isBooked = !!slot;

                 // Check if it's today and past
                 let isPastTime = false;
                 if (selectedAppointmentDate) {
                   const todayStr = dayjs().format('YYYY-MM-DD');
                   if (selectedAppointmentDate === todayStr) {
                     const slotDateTime = dayjs(`${selectedAppointmentDate} ${time}`, 'YYYY-MM-DD HH:mm:ss');
                     if (slotDateTime.isBefore(dayjs())) {
                       isPastTime = true;
                     }
                   }
                 }
               
                 const disabled = isBooked || isPastTime;
                 const displayLabel = dayjs(`${selectedAppointmentDate} ${time}`).format('HH:mm');
               
                     return (
                       <button
                         key={time}
                         type="button"
                         disabled={disabled}
                         onClick={() => {
                           if (!disabled) {
                             setSelectedTimeSlot(time);
                             setAppointmentFinalTime(dayjs(`${selectedAppointmentDate} ${time}`).format('YYYY-MM-DD HH:mm'));
                             setTimeout(() => {
                               if (selectedPatientID && selectedAppointmentFinelTime && !loadingAppointments && selectedTimeSlot)
                                 setModal(true);
                             }, 300);
                           }
                         }}
                         className={
                           `p-2 h-14 rounded-xl text-sm font-bold shadow-sm transition-all ` +
                           (disabled
                             ? 'bg-gray-200 dark:bg-gray-900 text-gray-400 cursor-not-allowed'
                             : (selectedTimeSlot === time
                                 ? 'bg-Primary text-white'
                                 : 'dark:bg-gray-800 dark:text-white text-gray-600 bg-gray-100 hover:bg-Primary hover:text-white'))
                         }
                       >
                         <div>{displayLabel}</div>
                         {isBooked && slot.patientName && (
                           <div className="text-[10px] font-bold text-Primary ">
                             {slot.patientName}
                           </div>
                         )}
                       </button>
                     );
                   })}

               </div>
          </div>  
        }
      </form>

      {
      isPatientInSystem ?
      selectedPatientID&&selectedAppointmentFinelTime&&!loadingAppointments&&selectedTimeSlot&&
         <div className="center">
            <button type='button' onClick={()=>setModal(true)} className='bg-Primary rounded-xl p-2 px-20 text-lg font-semibold translate-y-3'>
              confirm
            </button>
         </div>
        : 
        newPatientData.first_name&&newPatientData.last_name&&selectedAppointmentFinelTime&&!loadingAppointments&&selectedTimeSlot&&
        <div className="center">
        <button type='button' onClick={()=>setModal(true)} className='bg-Primary rounded-xl p-2 px-20 text-lg font-semibold translate-y-3'>
          confirm
        </button>
     </div>
      }

      <AnimatePresence>
        {isModal && (
          <>
            <motion.div
              className="fixed  -top-6 inset-0 bg-black/60 z-40"
              onClick={() => setModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-1/3 md:left-[25%] w-[90%] md:w-[50%] bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg z-50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setModal(false)}
                className="absolute top-3 right-4 text-xl hover:text-red-400 transition"
              >
                &times;
              </button>

              <h1 style={{lineHeight : 3}} className='text-md font-bold '>Are you sure you are going to schadual appointment at 
              <span className=' text-Primary mx-1'>
              {new Date(selectedAppointmentFinelTime).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  }
                )}
                <br />
              </span>
              to the patient id <span className=' text-Primary mx-1'>{isPatientInSystem ? selectedPatientID :`${newPatientData.first_name} ${newPatientData.last_name}`}</span>
               with <span className=' text-Primary mx-1'>Dr.{selectedDoctorName}</span> 
              </h1>

          {!submitLoading ? <>
            <button type='button' onClick={handleSchedule} className='bg-Primary rounded-xl p-1 px-4 text-lg font-semibold translate-y-3 mt-5'>
               schadual
            </button>

            <button type='button' onClick={()=>setModal(false)} className='rounded-xl bg-gray-700 p-1 px-4 text-lg font-semibold translate-y-3 ml-4 mb-5' >
              cancel
            </button>
            </>  
          :
          <div className='w-full center py-10'>
            <Loading size={30}/>
          </div>
          }

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </DashboardLayout>
  )
}

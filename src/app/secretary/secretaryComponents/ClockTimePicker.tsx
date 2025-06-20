// components/ClockTimePicker.tsx
import React from "react";
import dayjs from "dayjs";

interface TimeSlot {
  time: string; // "HH:mm:ss"
  patientName?: string;
}

interface Props {
  selectedAppointmentDate: string; // "YYYY-MM-DD"
  appointmentTimes: string[]; // array of times
  bookedSlots: TimeSlot[]; // [{ time: '09:00:00', patientName: '...' }]
  selectedTimeSlot: string | null;
  setSelectedTimeSlot: (value: string) => void;
  setAppointmentFinalTime: (value: string) => void;
  openModalIfReady: () => void;
}

export default function ClockTimePicker({
  selectedAppointmentDate,
  appointmentTimes,
  bookedSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
  setAppointmentFinalTime,
  openModalIfReady,
}: Props) {
  const radius = 140;
  const center = radius + 20;

  return (
    <div className="relative w-[300px] h-[300px] mx-auto my-10">
      {appointmentTimes.map((time, index) => {
        const slot = bookedSlots.find(slot => slot.time === time);
        const isBooked = !!slot;

        const displayTime = dayjs(`${selectedAppointmentDate} ${time}`).format("HH:mm");

        const isPast = dayjs(`${selectedAppointmentDate} ${time}`).isBefore(dayjs());

        const angle = (index / appointmentTimes.length) * 360;
        const rad = (angle * Math.PI) / 180;

        const x = center + radius * Math.cos(rad) - 30;
        const y = center + radius * Math.sin(rad) - 20;

        const disabled = isBooked || isPast;

        return (
          <button
            key={time}
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setSelectedTimeSlot(time);
                setAppointmentFinalTime(dayjs(`${selectedAppointmentDate} ${time}`).format("YYYY-MM-DD HH:mm"));
                setTimeout(() => openModalIfReady(), 200);
              }
            }}
            className={`
              absolute
              w-[60px] h-[40px]
              rounded-full text-xs font-semibold text-center
              p-1 leading-tight shadow-md transition-all
              ${disabled
                ? 'bg-gray-300 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : selectedTimeSlot === time
                ? 'bg-Primary text-white'
                : 'bg-gray-700 text-white hover:bg-Primary'}
            `}
            style={{ top: y, left: x }}
          >
            <div>{displayTime}</div>
            {isBooked && slot?.patientName && (
              <div className="text-[10px] font-bold truncate">{slot.patientName}</div>
            )}
          </button>
        );
      })}
    </div>
  );
}

'use client'
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserMd, FaCalendarAlt, FaStethoscope, FaTimesCircle, FaMoneyBill, FaCalendarCheck, FaUserClock, FaPlus } from "react-icons/fa";
import DashboardLayout from "./managerComponents/adminDashboardLayout";
import CreateDoctorModal from "./manage/CreateDoctorModal";
import CreateSecretaryModal from "./manage/CreateSecretaryModal";
import CreateDepartmentModal from "./manage/CreateDepartmentModal";
import { useTranslation } from "react-i18next";

export default function Page() {
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isSecretaryModalOpen, setIsSecretaryModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const { t } = useTranslation();



  return (
    <DashboardLayout loading={false} title={t('Admin.Dashboard.title', "Clinic Statistics Overview")}>
      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={() => setIsDoctorModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl shadow-lg hover:opacity-90 transition">
          <FaPlus size={14} /> {t('Admin.Dashboard.buttons.createDoctor', 'Create Doctor')}
        </button>
        <button onClick={() => setIsSecretaryModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg hover:opacity-90 transition">
          <FaPlus size={14} /> {t('Admin.Dashboard.buttons.createSecretary', 'Create Secretary')}
        </button>
        <button onClick={() => setIsDepartmentModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl shadow-lg hover:opacity-90 transition">
          <FaPlus size={14} /> {t('Admin.Dashboard.buttons.createDepartment', 'Create Department')}
        </button>
      </div>



      <CreateDoctorModal isOpen={isDoctorModalOpen} onClose={() => setIsDoctorModalOpen(false)} onSuccess={() => { }} />
      <CreateSecretaryModal isOpen={isSecretaryModalOpen} onClose={() => setIsSecretaryModalOpen(false)} onSuccess={() => { }} />
      <CreateDepartmentModal isOpen={isDepartmentModalOpen} onClose={() => setIsDepartmentModalOpen(false)} onSuccess={() => { }} />
    </DashboardLayout>
  );
}

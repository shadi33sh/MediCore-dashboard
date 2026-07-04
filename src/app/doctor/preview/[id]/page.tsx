"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "../../doctorComponents/DocDashboardLayout";
import axiosInstance from "../../../AuthAxios";
import { useAlert } from "../../../../Components/Alert";
import Loading from "../../../../Components/loading";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiFileText,
  FiActivity,
  FiArrowLeft,
  FiCheck,
  FiInfo,
  FiHeart,
  FiDroplet,
  FiStar,
  FiLock,
  FiEdit2,
  FiAlertTriangle,
  FiCalendar,
  FiPhone,
  FiRefreshCw,
} from "react-icons/fi";
import { useActivePatient } from "../../doctorComponents/ActivePatientContext";
import PreviewDetailsModal from "../PreviewDetailsModal";

/* ─────────────────────────── Types ─────────────────────────── */

interface PatientDetails {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  age: number;
  gender: string;
  blood_type: string;
  honest_score: number;
  chronic_diseases: string | null;
  medication_allergies: string | null;
  permanent_medications: string | null;
  birth_date: string | null;
  discount_point: number;
}

interface Preview {
  id: number;
  patient_id: number;
  doctor_id: number;
  department_id: number;
  diagnoseis: string;
  diagnoseis_type: number; // 0 = Not Completed (editable), 1 = Completed (locked)
  medicine: string;
  notes: string;
  status: string;
  price_after_discount: number | null;
  date: string;
  created_at: string;
}

interface FormData {
  diagnoseis: string;
  diagnoseis_type: string;
  medicine: string;
  notes: string;
  status: string;
  appointment_id: string;
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function PatientPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { activeData, clearActiveData } = useActivePatient();
  const scheduleId = params.id as string; // [id] is the schedule/appointment ID

  const EMPTY_FORM: FormData = {
    diagnoseis: "",
    diagnoseis_type: "0",
    medicine: "",
    notes: "",
    status: "Stable",
    appointment_id: scheduleId,
  };

  /* ── Data state ─────────────────────── */
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [noActivePatient, setNoActivePatient] = useState(false);

  /* ── Mode state ─────────────────────── */
  const [selectedPreview, setSelectedPreview] = useState<Preview | null>(null); // null = create mode
  const [showForm, setShowForm] = useState(false);

  /* ── Form state ─────────────────────── */
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [previewModalId, setPreviewModalId] = useState<number | null>(null);
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const isUpdateMode = selectedPreview !== null;
  const displayedPreviews = previews.filter((prev) => prev.diagnoseis_type === 1);

  /* ──────────────── Fetch active patient on mount ──────────── */
  useEffect(() => {
    async function fetchPatientDetails() {
      try {
        const response = await axiosInstance.get("/api/getActivePatientInfo");
        if (response.data.status) {
          const { patient: p, previews: pv } = response.data.data;
          if (p) {
            setPatient({
              id: p.id,
              first_name: p.first_name,
              last_name: p.last_name,
              phone: p.phone,
              age: p.age,
              gender: p.gender,
              blood_type: p.blood_type,
              honest_score: p.honest_score,
              chronic_diseases: p.chronic_diseases,
              medication_allergies: p.medication_allergies,
              permanent_medications: p.permanent_medications,
              birth_date: p.birth_date,
              discount_point: p.discount_point,
            });

            const fetchedPreviews: Preview[] = pv || [];
            setPreviews(fetchedPreviews);

            const incompletePreview = fetchedPreviews.find(
              (pr) => pr.diagnoseis_type === 0,
            );

            const contextPreview = activeData?.preview
              ? fetchedPreviews.find((pr) => pr.id === activeData.preview.id)
              : null;

            const previewToUse = contextPreview ?? incompletePreview;

            if (previewToUse && previewToUse.diagnoseis_type === 0) {
              setSelectedPreview(previewToUse);
              setFormData({
                diagnoseis: previewToUse.diagnoseis,
                diagnoseis_type: String(previewToUse.diagnoseis_type),
                medicine: previewToUse.medicine,
                notes: previewToUse.notes,
                status: previewToUse.status,
                appointment_id: scheduleId,
              });
              setShowForm(true);
            }
          } else {
            setNoActivePatient(true);
          }
        } else {
          setNoActivePatient(true);
        }
      } catch (err) {
        console.error("Failed to fetch patient info:", err);
        setNoActivePatient(true);
      } finally {
        setLoadingPatient(false);
      }
    }

    fetchPatientDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ──────────────── Select existing preview ──────────────────── */
  const handleSelectPreview = async (preview: Preview) => {
    if (preview.diagnoseis_type === 1) return;
    setPreviewModalId(preview.id);
    setPreviewModalOpen(true);
  };

  /* ──────────────── Form field change ───────────────────────── */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ──────────────── Submit (create or update) ────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!isUpdateMode || !selectedPreview) {
        showAlert("error", "No preview selected to update.");
        return;
      }

      const response = await axiosInstance.put(
        `/api/updatePreview/${selectedPreview.id}`,
        formData,
      );

      if (response.data) {
        showAlert("success", "Preview updated successfully!");
        setPreviews((prev) =>
          prev.map((p) =>
            p.id === selectedPreview.id
              ? {
                  ...p,
                  ...formData,
                  diagnoseis_type: Number(formData.diagnoseis_type),
                }
              : p,
          ),
        );
        setShowForm(false);
        setSelectedPreview(null);
        clearActiveData();
      }
    } catch (err: any) {
      showAlert(
        "error",
        err?.response?.data?.message || "Something went wrong",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ─────────────────────────── Render ─────────────────────────── */
  return (
    <DashboardLayout title="Patient Checkup">
      <div className="space-y-6 pb-12">
        {/* ── Back button ── */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-Primary transition-colors"
        >
          <FiArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* ── Loading state ── */}
        {loadingPatient ? (
          <div className="flex justify-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Loading size={32} />
          </div>
        ) : noActivePatient ? (
          /* ── No active patient warning ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <FiAlertTriangle size={28} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-amber-800 dark:text-amber-300 mb-1">
                No Active Patient
              </h3>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                There is no patient currently checked in on this schedule.
                <br />
                You cannot create a preview without an active patient.
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="mt-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-colors"
            >
              Return to Dashboard
            </button>
          </motion.div>
        ) : (
          patient && (
            <>
              {/* ── Patient info card ── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-Primary/5 to-teal-500/5 dark:from-Primary/10 dark:to-teal-500/10 rounded-2xl p-6 border border-Primary/10 dark:border-Primary/20 relative overflow-hidden"
              >
                <div className="absolute right-6 top-6 opacity-10">
                  <FiHeart size={80} className="text-Primary" />
                </div>

                <h2 className="text-xs font-bold uppercase tracking-widest text-Primary mb-4">
                  Patient Information
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1.5">
                      <FiUser className="text-Primary" size={14} />
                      {patient.first_name} {patient.last_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Age & Gender</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize">
                      {patient.age} yrs • {patient.gender}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Blood Type</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
                      <FiDroplet className="text-rose-500" size={14} />
                      {patient.blood_type}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Trust Score</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
                      <FiStar className="text-amber-500" size={14} />
                      {patient.honest_score}%
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
                      <FiPhone size={13} className="text-gray-400" />
                      {patient.phone}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Birth Date</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-1.5">
                      <FiCalendar size={13} className="text-gray-400" />
                      {patient.birth_date ?? "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400">Discount Points</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {patient.discount_point} pts
                    </p>
                  </div>
                </div>

                {(patient.chronic_diseases ||
                  patient.medication_allergies ||
                  patient.permanent_medications) && (
                  <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {patient.chronic_diseases && (
                      <div>
                        <p className="text-xs text-rose-500 font-semibold mb-0.5">
                          Chronic Diseases
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {patient.chronic_diseases}
                        </p>
                      </div>
                    )}
                    {patient.medication_allergies && (
                      <div>
                        <p className="text-xs text-amber-500 font-semibold mb-0.5">
                          Medication Allergies
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {patient.medication_allergies}
                        </p>
                      </div>
                    )}
                    {patient.permanent_medications && (
                      <div>
                        <p className="text-xs text-blue-500 font-semibold mb-0.5">
                          Permanent Medications
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {patient.permanent_medications}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>


              {/* ── Form (shown after selection or "New Preview") ── */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    ref={formRef}
                    key="checkup-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                  >
                    {/* Form header */}
                    <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-amber-500">
                        <FiEdit2 size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-amber-700 dark:text-amber-400">
                          {selectedPreview ? `Editing Preview #${selectedPreview.id}` : "Editing Preview"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Update this preview record
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                      {/* Row 1: Type and Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            Diagnosis Type
                          </label>
                          <div className="relative">
                            <select
                              name="diagnoseis_type"
                              value={formData.diagnoseis_type}
                              onChange={handleChange}
                              className="w-full appearance-none px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all"
                            >
                              <option value="0">Not Completed</option>
                              <option value="1">Completed</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                            Patient Status
                          </label>
                          <div className="relative">
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              className="w-full appearance-none px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all"
                            >
                              <option value="Stable">Stable</option>
                              <option value="Unstable">Unstable</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Diagnosis details */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                          <FiInfo size={14} className="text-Primary" />
                          Diagnosis Details
                        </label>
                        <textarea
                          name="diagnoseis"
                          value={formData.diagnoseis}
                          onChange={handleChange}
                          required
                          rows={3}
                          placeholder="Describe your findings, primary complaints, and diagnosis..."
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all resize-none"
                        />
                      </div>

                      {/* Prescribed Medicine */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                          <FiActivity size={14} className="text-Primary" />
                          Prescribed Medicine
                        </label>
                        <textarea
                          name="medicine"
                          value={formData.medicine}
                          onChange={handleChange}
                          required
                          rows={3}
                          placeholder="List medications, dosage, and duration..."
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all resize-none"
                        />
                      </div>

                      {/* Notes */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                          <FiFileText size={14} className="text-Primary" />
                          Additional Notes
                        </label>
                        <textarea
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Any additional observations or recommendations..."
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary transition-all resize-none"
                        />
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex items-center gap-3">
                        {submitting ? (
                          <div className="flex justify-center py-2">
                            <Loading size={28} />
                          </div>
                        ) : (
                          <>
                            <motion.button
                              type="submit"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`px-10 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${
                                isUpdateMode
                                  ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20 hover:shadow-xl"
                                  : "bg-gradient-to-r from-Primary to-Primary/80 shadow-Primary/20 hover:shadow-xl"
                              }`}
                            >
                              <FiCheck size={16} />
                              {isUpdateMode ? "Update Report" : "Submit Report"}
                            </motion.button>

                            <button
                              type="button"
                              onClick={() => {
                                setShowForm(false);
                                setSelectedPreview(null);
                              }}
                              className="px-5 py-3.5 rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>


              
              {/* ── Previous Previews + New button ── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6"
              >
                <div className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-Primary flex items-center gap-2">
                    <FiFileText size={14} />
                    Previous Previews
                    {displayedPreviews.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-Primary/10 text-Primary text-xs font-bold">
                        {displayedPreviews.length}
                      </span>
                    )}
                  </h2>
                </div>

                {displayedPreviews.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No previous previews for this patient.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {displayedPreviews.map((prev) => {
                      const isLocked = prev.diagnoseis_type === 1;

                      return (
                        <motion.div
                          key={prev.id}
                          whileHover={isLocked ? {} : { scale: 1.005 }}
                          onClick={() => !isLocked && handleSelectPreview(prev)}
                          className={`p-4 rounded-xl border text-sm transition-all ${
                            isLocked
                              ? "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 opacity-60 cursor-not-allowed"
                              : "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-Primary/30 hover:bg-Primary/5 cursor-pointer"
                          }`}
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Date</p>
                              <p className="font-semibold text-gray-800 dark:text-white">
                                {prev.date}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Diagnosis</p>
                              <p className="font-semibold text-gray-800 dark:text-white truncate">
                                {prev.diagnoseis || "No diagnosis"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-0.5">Medicine</p>
                              <p className="font-semibold text-gray-800 dark:text-white truncate">
                                {prev.medicine || "No medicine"}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Status</p>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                                    prev.status === "Stable"
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
                                  }`}
                                >
                                  {prev.status}
                                </span>
                              </div>
                              {isLocked ? (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-semibold">
                                  <FiLock size={11} /> Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-Primary font-semibold">
                                  <FiEdit2 size={11} />
                                  View details
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
              <PreviewDetailsModal
                previewId={previewModalId}
                isOpen={isPreviewModalOpen}
                onClose={() => setPreviewModalOpen(false)}
              />

            </>
          )
        )}
      </div>
    </DashboardLayout>
  );
}

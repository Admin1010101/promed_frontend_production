import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt, FaUser, FaShoppingCart } from "react-icons/fa";
import {
  IoInformationCircleOutline,
  IoDocumentsOutline,
  IoCallOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircle,
  IoListOutline,
} from "react-icons/io5";
import { format } from "date-fns";
import { formatPhoneNumber } from "react-phone-number-input";

const IVRStatusBadge = ({ status }) => {
  const colors = {
    approved:
      "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    pending:
      "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    denied:
      "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    withdrawn:
      "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
    cancelled:
      "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  };

  const displayStatus = status || "No IVR Submitted";
  const statusKey = status?.toLowerCase();

  return (
    <span
      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
        colors[statusKey] || colors.pending
      }`}
    >
      {displayStatus}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium block">
        {label}
      </span>
      <span className="text-xs text-gray-900 dark:text-gray-100 font-medium break-words">
        {value || "—"}
      </span>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-200 dark:border-gray-700">
      {Icon && (
        <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
      )}
      <h4 className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
        {title}
      </h4>
    </div>
    {children}
  </div>
);

const PatientCard = ({
  patient,
  onViewPdf,
  onEdit,
  onDelete,
  onPatientUpdate,
}) => {
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [openIvrModal, setOpenIvrModal] = useState(false);
  const [openIvrHistoryModal, setOpenIvrHistoryModal] = useState(false);
  const [ivrCount, setIvrCount] = useState(patient.ivr_count || 0);
  const [ivrLoading, setIvrLoading] = useState(false);

  // ✅ Get latest IVR status from patient object
  const latestIvrStatus = patient.latest_ivr_status || null;
  const latestIvrStatusDisplay =
    patient.latest_ivr_status_display || "No IVR Submitted";
  const hasApprovedIvr = patient.has_approved_ivr || false;

  useEffect(() => {
    if (patient?.id) {
      fetchIvrCount();
    }
  }, [patient?.id]);

  const fetchIvrCount = async () => {
    if (!patient?.id) return;

    try {
      setIvrLoading(true);
      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        `/api/v1/patients/${patient.id}/ivr-forms/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIvrCount(data.length);
      }
    } catch (error) {
      console.error("Error fetching IVR count:", error);
    } finally {
      setIvrLoading(false);
    }
  };

  const formattedDate = patient.date_of_birth
    ? format(new Date(patient.date_of_birth), "M/d/yyyy")
    : "N/A";
  const formattedPhoneNumber = patient.phone_number
    ? formatPhoneNumber(patient.phone_number) || patient.phone_number
    : "N/A";

  const calculateAge = (dobString) => {
    if (!dobString || !/^\d{4}-\d{2}-\d{2}$/.test(dobString)) {
      return null;
    }
    const dob = new Date(dobString);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDifference = now.getMonth() - dob.getMonth();
    const dayDifference = now.getDate() - dob.getDate();
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }
    return age;
  };

  const getIvrInitialData = () => ({
    patientId: patient.id,
    physicianName: `${patient.first_name} ${patient.last_name}`,
    contactName: `${patient.first_name} ${patient.last_name}`,
    phone: patient.phone_number,
    facilityAddress: patient.address,
    facilityCityStateZip: `${patient.city || ""}, ${patient.state || ""} ${
      patient.zip_code || ""
    }`,
  });

  const handleIvrFormComplete = (result) => {
    setOpenIvrModal(false);
    fetchIvrCount();
    if (onPatientUpdate) {
      onPatientUpdate(patient.id);
    }
  };

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                <FaUser className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">
                  {patient.first_name} {patient.last_name}
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  MRN:{" "}
                  <span className="font-mono font-medium">
                    {patient.medical_record_number}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <motion.button
                onClick={() => onEdit(patient)}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                title="Edit Patient"
              >
                <FaEdit className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                onClick={() => onDelete(patient.id)}
                whileTap={{ scale: 0.95 }}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Delete Patient"
              >
                <FaTrashAlt className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          <div className="mt-2">
            <IVRStatusBadge status={latestIvrStatusDisplay} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Contact Information */}
          <Section title="Contact" icon={IoCallOutline}>
            <div className="space-y-3">
              <InfoRow
                icon={IoLocationOutline}
                label="Address"
                value={`${patient.address}, ${patient.city}, ${patient.state} ${patient.zip_code}`}
              />
              <InfoRow
                icon={IoCallOutline}
                label="Phone"
                value={formattedPhoneNumber}
              />
              <InfoRow
                icon={IoCalendarOutline}
                label="Date of Birth"
                value={`${formattedDate} (${calculateAge(
                  patient.date_of_birth
                )} yrs)`}
              />
            </div>
          </Section>

          {/* Insurance Information */}
          <Section title="Insurance" icon={IoShieldCheckmarkOutline}>
            <div className="space-y-2">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                    Primary
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-medium">
                    1st
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {patient.primary_insurance}
                </p>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-mono mt-0.5">
                  {patient.primary_insurance_number}
                </p>
              </div>

              {patient.secondary_insurance && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                      Secondary
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-medium">
                      2nd
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {patient.secondary_insurance}
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 font-mono mt-0.5">
                    {patient.secondary_insurance_number}
                  </p>
                </div>
              )}
            </div>
          </Section>

          {/* Patient Documents Section */}
          <Section title="Patient Documents" icon={IoDocumentsOutline}>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <IoDocumentsOutline className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                        IVR Forms
                      </p>
                      {!ivrLoading && ivrCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                          {ivrCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {ivrLoading
                        ? "Loading..."
                        : ivrCount === 0
                        ? "No forms submitted"
                        : ivrCount === 1
                        ? "1 form submitted"
                        : `${ivrCount} forms submitted`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!ivrLoading && ivrCount > 0 && (
                    <>
                      <IoCheckmarkCircle
                        className="w-4 h-4 text-green-500 dark:text-green-400"
                        title="Forms Submitted"
                      />
                      <motion.button
                        onClick={() => setOpenIvrHistoryModal(true)}
                        whileTap={{ scale: 0.95 }}
                        className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                        title="View All IVR Forms"
                      >
                        <IoListOutline className="w-4 h-4" />
                      </motion.button>
                    </>
                  )}

                  <motion.button
                    onClick={() => setOpenIvrModal(true)}
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 text-teal-600 dark:text-teal-400 transition-colors"
                    title={
                      ivrCount > 0 ? "Create New IVR Form" : "Create IVR Form"
                    }
                  >
                    <IoDocumentsOutline className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </Section>

          {/* Orders */}
          <Section title="Orders" icon={FaShoppingCart}>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              {hasApprovedIvr ? (
                <motion.button
                  onClick={() => setOpenOrderModal(true)}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingCart className="w-3.5 h-3.5" />
                  <span className="text-xs">Create New Order</span>
                </motion.button>
              ) : (
                <div className="flex items-start gap-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5">
                  <IoInformationCircleOutline className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold">
                      IVR Approval Required
                    </p>
                    <p className="text-[10px] mt-0.5">
                      Orders require an approved IVR. Current status:{" "}
                      {latestIvrStatusDisplay}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Section>
        </div>
      </motion.div>
      {/* Modals */}
      <NewOrderForm
        open={openOrderModal}
        onClose={() => setOpenOrderModal(false)}
        patient={patient}
      />

      <NotesModal
        open={openNotesModal}
        onClose={() => setOpenNotesModal(false)}
        patientId={patient.id}
        patientName={`${patient.first_name} ${patient.last_name}`}
        onNotesUpdate={handleNotesUpdate}
      />

      <IvrFormModal
        open={openIvrModal}
        onClose={() => setOpenIvrModal(false)}
        initialData={getIvrInitialData()}
        onFormComplete={handleIvrFormComplete}
      />

      <PatientIVRHistoryModal
        open={openIvrHistoryModal}
        onClose={() => setOpenIvrHistoryModal(false)}
        patientId={patient.id}
        patientName={`${patient.first_name} ${patient.last_name}`}
      />
    </>
  );
};

export default PatientCard;

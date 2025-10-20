import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  IoInformationCircleOutline,
  IoDocumentsOutline,
} from "react-icons/io5";
import { format } from "date-fns";
import { formatPhoneNumber } from "react-phone-number-input";
import NotesPreview from "../documemts/NotesPreview";
import NotesModal from "../documemts/NotesModal";
import NewOrderForm from "../../orders/NewOrderForm";
// 1. IMPORT THE IVR FORM MODAL (Adjust path as necessary)
import IvrFormModal from "./PatientIVR";

const IVRStatusBadge = ({ status }) => {
  const colors = {
    Approved:
      "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200",
    Pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200",
    Denied: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200",
  };
  return (
    <span
      className={`px-2 py-1 text-[10px] font-semibold rounded-full ml-1 ${colors[status]}`}
    >
      {status}
    </span>
  );
};

const listItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

const PatientCard = ({ patient, onViewPdf, onEdit, onDelete }) => {
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  // 2. STATE FOR THE IVR MODAL
  const [openIvrModal, setOpenIvrModal] = useState(false); 
  const [notesRefreshTrigger, setNotesRefreshTrigger] = useState(0);
  
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

  // This function will be called by NotesModal when notes are updated
  const handleNotesUpdate = () => {
    setNotesRefreshTrigger(prev => prev + 1);
  };

  // Function to map patient data to the IVR form's expected initialData structure
  const getIvrInitialData = () => ({
    // Use the patient's full name for physician/contact if that's the current behavior
    physicianName: `${patient.first_name} ${patient.last_name}`, 
    contactName: `${patient.first_name} ${patient.last_name}`,
    phone: patient.phone_number,
    facilityAddress: patient.address,
    facilityCityStateZip: `${patient.city || ''}, ${patient.state || ''}, ${patient.zip_code || ''}`,
    // Add more fields here if available on the patient object (e.g., npi, taxId)
  });


  return (
    <>
      <motion.div
        className="border p-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-md space-y-2 text-gray-900 dark:text-gray-200"
        variants={listItemVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={{
          scale: 1.005,
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {patient.first_name} {patient.last_name}
          </h3>
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => onEdit(patient)}
              className="text-gray-500 dark:text-gray-400 hover:text-teal-500 transition"
              title="Edit Patient"
              whileTap={{ scale: 0.85 }}
            >
              <FaEdit className="text-base" />
            </motion.button>
            <motion.button
              onClick={() => onDelete(patient.id)}
              className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition"
              title="Delete Patient"
              whileTap={{ scale: 0.85 }}
            >
              <FaTrashAlt className="text-base" />
            </motion.button>
          </div>
        </div>

        {/* Patient Identification & Contact */}
        <div className="flex items-center justify-between w-full">
          <p className="text-xs mr-2">
            <strong>Medical Record Num:</strong> {patient.medical_record_number}
          </p>
          <strong className="text-xs">
            IVR Status: <IVRStatusBadge status={patient.ivrStatus} />
          </strong>
        </div>
        
        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1 pt-1">
          <p className="flex">
            <strong className="mr-1">Address:</strong> {patient.address}{" "}
            {patient.city}, {patient.state} {patient.zip_code}
          </p>
          <p className="flex">
            <strong className="mr-1">Phone Number:</strong> {formattedPhoneNumber}
          </p>
          <p className="flex">
            <strong className="mr-1">Date of Birth:</strong> {formattedDate}
          </p>
          <p className="flex">
            <strong className="mr-1">Age:</strong>{" "}
            {calculateAge(patient.date_of_birth)}
          </p>
        </div>

        {/* Insurance Information */}
        <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 my-3"></div>
        
        <p className="text-sm font-semibold text-center mb-1">Insurance Information</p>
        
        <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <p className="flex">
            <strong className="mr-1">Primary Insurance Provider:</strong>{" "}
            {patient.primary_insurance}
          </p>
          <p className="flex">
            <strong className="mr-1">Primary Insurance Number:</strong>{" "}
            {patient.primary_insurance_number}
          </p>
          <p className="flex">
            <strong className="mr-1">Secondary Insurance Provider:</strong>{" "}
            {patient.secondary_insurance || "N/A"}
          </p>
          <p className="flex">
            <strong className="mr-1">Secondary Insurance Number:</strong>{" "}
            {patient.secondary_insurance_number || "N/A"}
          </p>
          <p className="flex">
            <strong className="mr-1">Tertiary Insurance Provider:</strong>{" "}
            {patient.tertiary_insurance || "N/A"}
          </p>
          <p className="flex">
            <strong className="mr-1">Tertiary Insurance Number:</strong>{" "}
            {patient.tertiary_insurance_number || "N/A"}
          </p>
        </div>

        {/* Patient Documentation */}
        <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 my-3"></div>
        
        <p className="text-sm font-semibold text-center mb-1">Patient Documentation</p>
        
        <div className="text-xs text-gray-700 dark:text-gray-300">
          <div className="flex items-center justify-between">
            <p className="flex">
              <strong>Promed Healthcare Plus IVR</strong>
            </p>
            <div className="flex space-x-2">
              {/* 3. THE BUTTON THAT SAYS PROMED IVR */}
              <motion.button
                onClick={() => setOpenIvrModal(true)}
                className="text-[10px] px-2 py-1 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
                whileTap={{ scale: 0.95 }}
                title="Open Promed IVR Form"
              >
                Promed IVR
              </motion.button>
              {/* Existing View PDF Button */}
              <motion.button
                onClick={() => onViewPdf(patient)}
                className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-teal-500 transition"
                whileTap={{ scale: 0.9 }}
                title="View IVR Form PDF"
              >
                <IoDocumentsOutline className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Patient Order */}
        <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 my-3"></div>
        
        <p className="text-sm font-semibold text-center mt-2 mb-2">Patient Order</p>

        <div className="flex justify-between items-center flex-wrap gap-2">
          <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">
            Place an order for this patient.
          </p>
          <div className="relative flex items-center gap-1">
            {patient.ivrStatus !== "Approved" && (
              <div className="relative group">
                <IoInformationCircleOutline className="text-xl text-red-400 font-semibold cursor-pointer dark:text-red-300" />
                <div
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                  bg-white border border-gray-200 shadow-lg px-3 py-1 text-xs text-gray-500
                  rounded-xl w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 font-semibold
                  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                >
                  Orders can only be placed for patients with an approved IVR.
                </div>
              </div>
            )}
            <motion.button
              className={`text-[10px] px-3 py-1 rounded-full flex items-center gap-1 transition-all
              ${
                patient.ivrStatus === "Approved"
                  ? "bg-teal-500 text-white hover:bg-teal-600"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
              }`}
              onClick={() => setOpenOrderModal(true)}
              disabled={patient.ivrStatus !== "Approved"}
              whileTap={patient.ivrStatus === "Approved" ? { scale: 0.95 } : {}}
            >
              + New Order
            </motion.button>
          </div>
        </div>
        
        {/* Notes Section */}
        <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 my-3"></div>
        
        <NotesPreview 
          patientId={patient.id} 
          onViewAll={() => setOpenNotesModal(true)}
          refreshTrigger={notesRefreshTrigger}
        />
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

      {/* 4. IVR FORM MODAL INTEGRATION */}
      <IvrFormModal
        open={openIvrModal}
        onClose={() => setOpenIvrModal(false)}
        initialData={getIvrInitialData()} // Use the mapping function
        onFormComplete={(result) => {
          console.log("IVR Form Submitted:", result);
          // You might want to update the patient data/status here
          setOpenIvrModal(false); 
        }}
      />
    </>
  );
};

export default PatientCard;
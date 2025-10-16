// src/components/dashboard/patients/Patients.js (Main Component)

import React, { useState, useContext, useEffect, useCallback } from "react"; 
import { AuthContext } from "../../../utils/auth";
import { Box, Modal } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { FaSearch, FaSlidersH, FaPlus } from "react-icons/fa";
import FillablePdf from "../documemts/FillablePdf";
import PatientCard from "./PatientCard";
import toast from "react-hot-toast";
import { states } from "../../../utils/data";
import NewPatientForm from "./NewPatientForm";

// ... (Modal Variants, List Variants, Button Tap, IVR Status Badge, Filter Command Center remain unchanged) ...

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.25 } },
};

const listContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const buttonTap = {
  scale: 0.95,
};

const IVRStatusBadge = ({ status }) => {
  const colors = {
    Approved:
      "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200",
    Pending:
      "bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200",
    Denied: "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded ${colors[status]}`}
    >
      {status}
    </span>
  );
};

const FilterCommandCenter = ({
  open,
  handleClose,
  ivrFilter,
  setIvrFilter,
  activationFilter,
  setActivationFilter,
  patientsPerPage,
  setPatientsPerPage,
}) => {
  const filterModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 400,
    maxHeight: "90vh",
    bgcolor: "transparent",
    boxShadow: "none",
    outline: "none",
  };

  const handlePatientsPerPageChange = (e) => {
    setPatientsPerPage(Number(e.target.value));
  };
 
  return (
    <Modal
      open={open}
      onClose={handleClose}
      disablePortal
      keepMounted
      hideBackdrop={false}
    >
      <Box sx={filterModalStyle}>
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mx-4 border border-gray-100 dark:border-gray-700 relative"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2 text-center">
            Patient Filters
          </h3>

          <div className="mb-6">
            <label
              htmlFor="ivr-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Filter by IVR Status:
            </label>
            <select
              id="ivr-filter"
              value={ivrFilter}
              onChange={(e) => setIvrFilter(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 transition"
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Denied">Denied</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Filter by Activation:
            </label>
            <div className="flex space-x-4 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
              <label
                htmlFor="active-all"
                className="flex items-center text-sm text-gray-700 dark:text-gray-200"
              >
                <input
                  type="radio"
                  id="active-all"
                  name="activation-filter"
                  value=""
                  checked={activationFilter === ""}
                  onChange={(e) => setActivationFilter(e.target.value)}
                  className="mr-2 text-teal-500 focus:ring-teal-500 dark:focus:ring-teal-400"
                />
                All
              </label>
              <label
                htmlFor="active-activated"
                className="flex items-center text-sm text-gray-700 dark:text-gray-200"
              >
                <input
                  type="radio"
                  id="active-activated"
                  name="activation-filter"
                  value="Activated"
                  checked={activationFilter === "Activated"}
                  onChange={(e) => setActivationFilter(e.target.value)}
                  className="mr-2 text-teal-500 focus:ring-teal-500 dark:focus:ring-teal-400 "
                />
                Activated
              </label>
              <label
                htmlFor="active-deactivated"
                className="flex items-center text-sm text-gray-700 dark:text-gray-200"
              >
                <input
                  type="radio"
                  id="active-deactivated"
                  name="activation-filter"
                  value="Deactivated"
                  checked={activationFilter === "Deactivated"}
                  onChange={(e) => setActivationFilter(e.target.value)}
                  className="mr-2 text-teal-500 focus:ring-teal-500 dark:focus:ring-teal-400"
                />
                Deactivated
              </label>
            </div>
          </div>

          <div>
            <label
              htmlFor="patients-per-page"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Patients per page:
            </label>
            <select
              id="patients-per-page"
              value={patientsPerPage}
              onChange={handlePatientsPerPageChange}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500 transition"
            >
              {[5, 10, 15, 25].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            onClick={handleClose}
            className="mt-6 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg shadow-md transition duration-300"
            whileTap={buttonTap}
          >
            Apply Filters
          </motion.button>
        </motion.div>
      </Box>
    </Modal>
  );
};
// ----------------------------------------------------------------------

const Patients = ({ activationFilter, setActivationFilter }) => {
  const { user, getPatients, postPatient, updatePatient, deletePatient } =
    useContext(AuthContext);
    
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewPdfModalOpen, setViewPdfModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [ivrFilter, setIvrFilter] = useState("");
  const [patientsPerPage, setPatientsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [savePage, setSavePage] = useState(1);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_initial: "",
    date_of_birth: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone_number: "",
    primary_insurance: "",
    primary_insurance_number: "",
    secondary_insurance: "",
    secondary_insurance_number: "",
    tertiary_insurance: "",
    tertiary_insurance_number: "",
    medical_record_number: "",
    ivrStatus: "Pending",
    date_created: "",
    date_updated: "",
    wound_size_length: "",
    wound_size_width: "",
  });

  const listContainerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const formatPhoneNumberToE164 = (phone) => {
    if (!phone) return "";
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length === 10) {
      return `+1${digitsOnly}`;
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
      return `+${digitsOnly}`;
    } else if (digitsOnly.length > 11 && digitsOnly.startsWith("1")) {
      return `+${digitsOnly.slice(0, 11)}`;
    }
    return `+${digitsOnly}`;
  };

  const ValidateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.date_of_birth)
      newErrors.date_of_birth = "Date of birth is required";
    if (formData.phone_number) {
      const digitsOnly = formData.phone_number.replace(/\D/g, "");
      if (digitsOnly.length !== 10) {
        newErrors.phone_number = "Phone number must be 10 digits (US format)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // ----------------------------------------------------------------------
  // 💥 CORRECTED: Conditional Patient Fetching Hook
  // ----------------------------------------------------------------------
  const fetchPatients = useCallback(async () => {
    if (!user || !getPatients) {
      setLoading(true);
      return;
    }
    
    setLoading(true);
    try {
      const result = await getPatients();
      
      if (result.success) {
        setPatients(result.data);
      } else {
        // 💥 FIX APPLIED: Only console.error for non-success that didn't throw.
        // We REMOVE the toast here because this is the code path your API 
        // seems to take when it finds no data (an unsuccessful request).
        console.error("Fetch returned a non-success status. Error:", result.error);
      }
      
    } catch (error) {
      // KEEP: This handles true errors (network, 401/500 status codes, etc.)
      console.error("Error during patient fetch:", error);
      toast.error("An error occurred while loading patients.");
      
    } finally {
      setLoading(false);
    }
  }, [user, getPatients]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);
  
  // ... (All other functions remain unchanged) ...

  useEffect(() => {
    if (searchTerm || ivrFilter || activationFilter) {
      setSavePage(currentPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(savePage);
    }
  }, [searchTerm, ivrFilter, activationFilter, patientsPerPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "middle_initial" ? value.trim().charAt(0) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      middle_initial: "",
      date_of_birth: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      phone_number: "",
      primary_insurance: "",
      primary_insurance_number: "",
      secondary_insurance: "",
      secondary_insurance_number: "",
      tertiary_insurance: "",
      tertiary_insurance_number: "",
      medical_record_number: "",
      ivrStatus: "Pending",
      wound_size_length: "",
      wound_size_width: "",
    });
    setErrors({});
    setEditingPatient(null);
    setOpen(false);
  };

  const handleSavePatient = async () => {
    setErrors({});
    if (!ValidateForm()) return;

    const newPatientData = {
      ...formData,
      phone_number: formatPhoneNumberToE164(formData.phone_number),
    };

    try {
      if (editingPatient) {
        const res = await updatePatient(editingPatient.id, newPatientData);
        if (res.success) {
          setPatients((prev) =>
            prev.map((p) => (p.id === editingPatient.id ? res.data : p))
          );
          toast.success("Patient profile updated successfully!");
        } else {
          console.error("Failed to update patient:", res.error);
          toast.error("Failed to update patient.");
        }
      } else {
        const res = await postPatient(newPatientData);
        if (res.success) {
          setPatients((prev) => [res.data, ...prev]);
          toast.success("New patient added successfully!");
        } else {
          console.error("Failed to add patient:", res.error);
          toast.error("Failed to add new patient.");
        }
      }
    } catch (error) {
      console.log("Error saving patient:", error);
      toast.error("Error saving patient data.");
    }
    resetForm();
  };

  const handleEditPatient = (patient) => {
    try {
      if (!patient || typeof patient !== "object") {
        console.error("Invalid patient data:", patient);
        return;
      }
      const sanitizedPatient = {};
      Object.entries(formData).forEach(([key, _]) => {
        let value = patient[key];
        if (key === "date_of_birth") {
          try {
            sanitizedPatient[key] = value
              ? format(new Date(value), "yyyy-MM-dd")
              : "";
          } catch (dateError) {
            console.error("Invalid date_of_birth format:", value);
            sanitizedPatient[key] = "";
          }
        } else {
          sanitizedPatient[key] = value ?? "";
        }
      });
      setFormData(sanitizedPatient);
      setEditingPatient(patient);
      setOpen(true);
    } catch (error) {
      console.error("Error in handleEditPatient:", error);
      toast.error("Could not load patient for editing.");
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this patient? This action cannot be undone."
      )
    ) {
      try {
        const res = await deletePatient(patientId);
        if (res.success) {
          setPatients((prev) => prev.filter((p) => p.id !== patientId));
          toast.success("Patient deleted successfully!");
        } else {
          console.error("Failed to delete patient:", res.error);
          toast.error("Failed to delete patient.");
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        toast.error("Error deleting patient.");
      }
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName =
      `${patient.first_name} ${patient.last_name} ${patient.middle_initial}`.toLowerCase();
    const medRecord = patient.medical_record_number?.toLowerCase() || "";
    const matchesIvrFilter = ivrFilter ? patient.ivrStatus === ivrFilter : true;
    const activationMatch =
      !activationFilter || patient.activate_Account === activationFilter;
    return (
      (fullName.includes(searchTerm.toLowerCase()) ||
        medRecord.includes(searchTerm.toLowerCase())) &&
      matchesIvrFilter &&
      activationMatch
    );
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const active = (status) => ["Approved", "Pending"].includes(status);
    return active(b.ivrStatus) - active(a.ivrStatus);
  });

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = sortedPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
  const totalPages = Math.ceil(sortedPatients.length / patientsPerPage);

  const handleViewPdf = (patient) => {
    setSelectedPatient(patient);
    setViewPdfModalOpen(true);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: 600,
    bgcolor: "transparent",
    boxShadow: "none",
    outline: "none",
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <CircularProgress color="success" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Patient Management
        </h2>

        <motion.button
          onClick={() => {
            setEditingPatient(null);
            setOpen(true);
          }}
          className="w-full sm:w-auto border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white dark:hover:text-white dark:text-teal-400 dark:border-teal-400 dark:hover:bg-teal-500 px-2 py-1 rounded-full transition-all text-xs flex items-center justify-center gap-1"
          whileTap={buttonTap}
        >
          <FaPlus className="w-3 h-3" /> New Patient
        </motion.button>
      </div>

      {/* Search and Filter Control Block */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-5 gap-3">
        {/* Search Input */}
        <div className="relative flex items-center w-full sm:max-w-xs md:max-w-md">
          <input
            type="text"
            placeholder="Search by Name or Med Record No."
            className="w-full px-2 py-1 pl-10 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center justify-center w-8 h-8 bg-teal-500 rounded-full">
            <FaSearch className="text-white text-sm" />
          </div>
        </div>

        {/* Filter/Command Center Button 💥 ADD MOTION */}
        <motion.button
          onClick={() => setFilterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 w-full sm:w-auto"
          whileTap={buttonTap}
        >
          <FaSlidersH className="w-4 h-4" />
          <span className="flex items-center space-x-1">
            <span>Filters</span>
            <span className="text-xs font-semibold text-teal-500 dark:text-teal-400">
              ({[ivrFilter, activationFilter].filter(Boolean).length})
            </span>
          </span>
        </motion.button>
      </div>

      {/* Patient Cards List 💥 ADD MOTION & ANIMATEPRESENCE */}
      <motion.div
        className="space-y-6"
        variants={listContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {currentPatients.length > 0 ? (
            currentPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onViewPdf={handleViewPdf}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
              />
            ))
          ) : (
            <motion.p
              className="text-center py-10 text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No patients match the current search or filter criteria.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="flex justify-center items-center mt-6 space-x-2 sm:space-x-4">
        <motion.button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 sm:px-3 sm:py-2 rounded-full border bg-gray-100 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
          whileTap={currentPage !== 1 ? buttonTap : {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </motion.button>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-gray-300 dark:border-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <motion.button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-2 py-1 sm:px-3 sm:py-2 rounded-full border bg-gray-100 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
          whileTap={currentPage !== totalPages ? buttonTap : {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 sm:w-5 sm:h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </motion.button>
      </div>

      {/* MODAL 2: Filter Command Center 💥 Wrap with AnimatePresence */}
      <AnimatePresence>
        {filterModalOpen && (
          <FilterCommandCenter
            open={filterModalOpen}
            handleClose={() => setFilterModalOpen(false)}
            ivrFilter={ivrFilter}
            setIvrFilter={setIvrFilter}
            activationFilter={activationFilter}
            setActivationFilter={setActivationFilter}
            patientsPerPage={patientsPerPage}
            setPatientsPerPage={setPatientsPerPage}
          />
        )}
      </AnimatePresence>

      {/* MODAL 3: PDF Viewer (Unchanged) */}
      <Modal open={viewPdfModalOpen} onClose={() => setViewPdfModalOpen(false)}>
        <Box sx={{ ...modalStyle, maxWidth: 900 }}>
          <FillablePdf
            patient={selectedPatient}
            onClose={() => setViewPdfModalOpen(false)}
          />
        </Box>
      </Modal>
      {/* MODAL 1: Patient Details (Unchanged) */}
      <Modal open={open} onClose={resetForm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: 600,
            maxHeight: "90vh",
            bgcolor: "transparent",
            boxShadow: "none",
            outline: "none",
            borderRadius: "16px",
            overflow: "hidden", 
          }}
        >
          <Box
            sx={{
              maxHeight: "90vh",
              overflowY: "auto",
              bgcolor: "white",
              borderRadius: "16px",
              msOverflowStyle: 'none',   
              scrollbarWidth: 'none',   
              "&::-webkit-scrollbar": {
                display: "none",         
              },
            }}
            className="dark:bg-gray-900"
          >
            <NewPatientForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSavePatient={handleSavePatient}
              resetForm={resetForm}
              errors={errors}
              editingPatient={editingPatient}
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Patients;
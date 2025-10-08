import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../utils/auth";
import { Box, Modal } from "@mui/material";
import { format } from "date-fns";
import { FaEye, FaSearch } from "react-icons/fa";
import FillablePdf from "../documemts/FillablePdf";
import PatientCard from "./PatientCard";
import toast from "react-hot-toast";
import { states } from "../../../utils/data";

const IvrStatusBadge = ({ status }) => {
  const colors = {
    Approved: "bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200",
    Pending: "bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-200",
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

const Patients = ({ activationFilter, setActivationFilter }) => {
  const { getPatients, postPatient, updatePatient, deletePatient } =
    useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    const fetchPatients = async () => {
      if (getPatients) {
        const result = await getPatients();
        if (result.success) {
          setPatients(result.data);
        } else {
          console.error("Failed to fetch patients:", result.error);
        }
      }
    };
    fetchPatients();
  }, [getPatients]);

  useEffect(() => {
    if (searchTerm || ivrFilter) {
      setSavePage(currentPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(savePage);
    }
  }, [searchTerm, ivrFilter]);

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
        }
      } else {
        const res = await postPatient(newPatientData);
        if (res.success) {
          setPatients((prev) => [res.data, ...prev]);
        } else {
          console.error("Failed to add patient:", res.error);
        }
      }
    } catch (error) {
      console.error("Error saving patient:", error);
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
        } else {
          console.error("Failed to delete patient:", res.error);
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const fullName =
      `${patient.first_name} ${patient.last_name} ${patient.middle_initial}`.toLowerCase();
    const medRecord = patient.medical_record_number?.toLowerCase() || "";
    const matchesFilter = ivrFilter ? patient.ivrStatus === ivrFilter : true;
    const activationMatch = !activationFilter || patient.activate_Account === activationFilter;
    return (
      (fullName.includes(searchTerm.toLowerCase()) ||
        medRecord.includes(searchTerm.toLowerCase())) &&
      matchesFilter && activationMatch
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
    console.log("Opening PDF modal for:", patient);
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

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Patient Applications</h2>
        <button
          className="border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white dark:hover:text-white dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-500 px-4 py-2 rounded-md transition-all text-xs"
          onClick={() => {
            setEditingPatient(null);
            setOpen(true);
          }}
        >
          + New Patient
        </button>
      </div>
      <div className="relative flex items-center w-full max-w-md mb-5">
        <input
          type="text"
          placeholder="Search Patients by Name or Med Record No."
          className="w-full px-2 py-1 pl-10 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full">
          <FaSearch className="text-white text-sm" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-2 sm:gap-4 pl-1">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label
            htmlFor="ivr-filter"
            className="text-xs font-medium text-gray-700 dark:text-gray-200"
          >
            Filter by IVR Status:
          </label>
          <select
            id="ivr-filter"
            value={ivrFilter}
            onChange={(e) => setIvrFilter(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs
            focus:bg-gray-200 dark:focus:bg-gray-600 focus:outline-none focus:ring-2
            focus:ring-indigo-500 focus:border-indigo-300 transition"
          >
            <option value="">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Denied">Denied</option>
          </select>
          <select value={activationFilter} onChange={e => setActivationFilter(e.target.value)} className="border rounded px-2 py-1">
            <option value={"Activated"}>Activated</option>
            <option value={"Deactivated"}>Deactivated</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <label
            htmlFor="patients-per-page"
            className="text-xs font-medium text-gray-700 dark:text-gray-200"
          >
            Patient per page:
          </label>
          <select
            id="patients-per-page"
            value={patientsPerPage}
            onChange={(e) => {
              setPatientsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs
            focus:bg-gray-200 dark:focus:bg-gray-600 focus:outline-none focus:ring-2
            focus:ring-indigo-500 focus:border-indigo-300 transition"
          >
            {[5, 10, 15, 25].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-6">
        {currentPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onViewPdf={handleViewPdf}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
          />
        ))}
      </div>
      <div className="flex justify-center items-center mt-6 space-x-2 sm:space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 sm:px-3 sm:py-2 rounded-full border bg-gray-100 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
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
        </button>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-gray-300 dark:border-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-2 py-1 sm:px-3 sm:py-2 rounded-full border bg-gray-100 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
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
        </button>
      </div>

      {/* MODAL 1: For Editing/Adding Patients */}
      <Modal open={open} onClose={resetForm}>
        <Box sx={{ ...modalStyle, maxHeight: "90vh", overflowY: "auto" }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 mx-4 border border-gray-100 dark:border-gray-800 relative transition-colors duration-300">
            <button
              onClick={resetForm}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition"
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
            <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 mb-2">
              {editingPatient ? "Edit Patient" : "Add New Patient"}
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
              Fill out the form to
              {editingPatient
                ? "update patient details"
                : "register a new patient"}
              .
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSavePatient();
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm">{errors.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm">{errors.last_name}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Middle Initial
                  </label>
                  <input
                    type="text"
                    name="middle_initial"
                    value={formData.middle_initial}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-sm">
                      {errors.date_of_birth}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-2/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    <option value="" disabled>
                      Select a state
                    </option>
                    {states.map((stateAbbr) => (
                      <option key={stateAbbr} value={stateAbbr}>
                        {stateAbbr}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="e.g. (212) 555-1212 or 212-555-1212"
                  value={formData.phone_number}
                  onChange={(e) => {
                    const input = e.target.value;
                    const cleaned = input.replace(/[^\d()-\s]/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      phone_number: cleaned,
                    }));
                  }}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Format: (212) 555-1212 or 212-555-1212 — US numbers only
                </p>
                {errors.phone_number && (
                  <p className="text-red-500 text-sm">{errors.phone_number}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Medical Record Number
                </label>
                <input
                  type="text"
                  name="medical_record_number"
                  value={formData.medical_record_number}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
                Insurance Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Primary Insurance
                  </label>
                  <input
                    type="text"
                    name="primary_insurance"
                    value={formData.primary_insurance}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Primary Insurance Number
                  </label>
                  <input
                    type="text"
                    name="primary_insurance_number"
                    value={formData.primary_insurance_number}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Secondary Insurance
                  </label>
                  <input
                    type="text"
                    name="secondary_insurance"
                    value={formData.secondary_insurance}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Secondary Insurance Number
                  </label>
                  <input
                    type="text"
                    name="secondary_insurance_number"
                    value={formData.secondary_insurance_number}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Tertiary Insurance
                  </label>
                  <input
                    type="text"
                    name="tertiary_insurance"
                    value={formData.tertiary_insurance}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Tertiary Insurance Number
                  </label>
                  <input
                    type="text"
                    name="tertiary_insurance_number"
                    value={formData.tertiary_insurance_number}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">
                Wound Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Wound Size (Length) in cm
                  </label>
                  <input
                    type="text"
                    name="wound_size_length"
                    value={formData.wound_size_length}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Wound Size (Width) in cm
                  </label>
                  <input
                    type="text"
                    name="wound_size_width"
                    value={formData.wound_size_width}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded-md font-semibold text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>

      {/* MODAL 2: For Viewing PDF */}
      <Modal open={viewPdfModalOpen} onClose={() => setViewPdfModalOpen(false)}>
        <Box sx={modalStyle}>
          <div className="relative p-4">
            <button
              onClick={() => setViewPdfModalOpen(false)}
              className="absolute top-0 right-0 m-4 p-2 text-white bg-gray-800 rounded-full"
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
            {selectedPatient && <FillablePdf patient={selectedPatient} />}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Patients;

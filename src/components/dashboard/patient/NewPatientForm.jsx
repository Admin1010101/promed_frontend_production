// src/components/dashboard/patients/NewPatientForm.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { states } from "../../../utils/data"; // Assuming this utility file exists
import { IoCloseOutline } from "react-icons/io5";

// Framer Motion Variants
const formItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const formContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const NewPatientForm = ({
  formData,
  handleInputChange,
  handleSavePatient,
  resetForm, // Used for closing/resetting the modal
  errors,
  editingPatient,
}) => {
  const isEditing = !!editingPatient;
  const title = isEditing ? "Edit Patient Profile" : "Add New Patient Application";
  const submitText = isEditing ? "Update Patient" : "Add Patient";

  const renderError = (field) => {
    return errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null;
  };

  const handleWrapperClose = (e) => {
    // Only close if click is outside the form content or on the dedicated close button
    if (e.target.id === "patient-form-wrapper" || e.target.closest("#close-btn")) {
      resetForm();
    }
  };

  return (
    // 💥 FIX 1 & 2: Changed h-full to max-h-[90vh] and added overflow-hidden for border-radius consistency
    <motion.div
      id="patient-form-wrapper"
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 mx-4 border border-gray-100 dark:border-gray-700 relative w-full max-w-lg md:max-w-4xl max-h-[90vh] overflow-hidden" // max-h-[90vh] ensures it fits, overflow-hidden ensures rounded corners work.
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <button
          id="close-btn"
          onClick={resetForm}
          className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Close"
        >
          <IoCloseOutline className="h-7 w-7" />
        </button>
      </div>

      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          handleSavePatient();
        }}
        // The inner form content is now scrollable up to the max height of the container minus header/footer space.
        className="space-y-6 overflow-y-auto pr-2" 
        initial="hidden"
        animate="visible"
        variants={formContainerVariants}
        // Simplified max height calculation since the parent now controls it with max-h-[90vh]
        style={{ maxHeight: "calc(90vh - 120px)" }} 
      >
        
        {/* === PATIENT IDENTIFICATION === */}
        <h4 className="text-lg font-semibold text-teal-600 dark:text-teal-400 border-b border-teal-600/50 pb-1">
          Patient Identification
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* First Name (Required) */}
          <motion.div variants={formItemVariants}>
            <label htmlFor="first_name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border ${errors.first_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition`}
              required
            />
            {renderError("first_name")}
          </motion.div>

          {/* Last Name (Required) */}
          <motion.div variants={formItemVariants}>
            <label htmlFor="last_name" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border ${errors.last_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition`}
              required
            />
            {renderError("last_name")}
          </motion.div>
          
          {/* Middle Initial */}
          <motion.div variants={formItemVariants}>
            <label htmlFor="middle_initial" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Middle Initial
            </label>
            <input
              type="text"
              id="middle_initial"
              name="middle_initial"
              placeholder="M"
              maxLength="1"
              value={formData.middle_initial}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date of Birth (Required) */}
          <motion.div variants={formItemVariants} className="md:col-span-1">
            <label htmlFor="date_of_birth" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition`}
              required
            />
            {renderError("date_of_birth")}
          </motion.div>

          {/* Phone Number */}
          <motion.div variants={formItemVariants} className="md:col-span-1">
            <label htmlFor="phone_number" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              placeholder="e.g., (555) 555-5555"
              value={formData.phone_number}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border ${errors.phone_number ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition`}
            />
            {renderError("phone_number")}
          </motion.div>

          {/* Email */}
          <motion.div variants={formItemVariants} className="md:col-span-1">
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="patient@example.com"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
        </div>
        
        {/* Medical Record Number */}
        <motion.div variants={formItemVariants}>
            <label htmlFor="medical_record_number" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Medical Record Number
            </label>
            <input
              type="text"
              id="medical_record_number"
              name="medical_record_number"
              placeholder="MRN-123456"
              value={formData.medical_record_number}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>

        {/* === ADDRESS DETAILS === */}
        <h4 className="text-lg font-semibold text-teal-600 dark:text-teal-400 border-b border-teal-600/50 pb-1 pt-4">
          Address Details
        </h4>

        {/* Address */}
        <motion.div variants={formItemVariants}>
          <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Street Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="123 Main St"
            value={formData.address}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* City */}
          <motion.div variants={formItemVariants}>
            <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="New York"
              value={formData.city}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>

          {/* State */}
          <motion.div variants={formItemVariants}>
            <label htmlFor="state" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </motion.div>
          
          {/* Zip Code */}
          <motion.div variants={formItemVariants}>
            <label htmlFor="zip_code" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Zip Code
            </label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              placeholder="10001"
              value={formData.zip_code}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
        </div>

        {/* === INSURANCE INFORMATION === */}
        <h4 className="text-lg font-semibold text-teal-600 dark:text-teal-400 border-b border-teal-600/50 pb-1 pt-4">
          Insurance Information
        </h4>

        {/* Primary Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={formItemVariants}>
            <label htmlFor="primary_insurance" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Primary Insurance Provider
            </label>
            <input
              type="text"
              id="primary_insurance"
              name="primary_insurance"
              placeholder="e.g., Medicare, Blue Cross"
              value={formData.primary_insurance}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
          <motion.div variants={formItemVariants}>
            <label htmlFor="primary_insurance_number" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Primary Insurance Number
            </label>
            <input
              type="text"
              id="primary_insurance_number"
              name="primary_insurance_number"
              placeholder="ID / Group No."
              value={formData.primary_insurance_number}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
        </div>

        {/* Secondary Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={formItemVariants}>
            <label htmlFor="secondary_insurance" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Secondary Insurance Provider
            </label>
            <input
              type="text"
              id="secondary_insurance"
              name="secondary_insurance"
              placeholder="Optional"
              value={formData.secondary_insurance}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
          <motion.div variants={formItemVariants}>
            <label htmlFor="secondary_insurance_number" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Secondary Insurance Number
            </label>
            <input
              type="text"
              id="secondary_insurance_number"
              name="secondary_insurance_number"
              placeholder="Optional"
              value={formData.secondary_insurance_number}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
        </div>

        {/* Tertiary Insurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={formItemVariants}>
            <label htmlFor="tertiary_insurance" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tertiary Insurance Provider
            </label>
            <input
              type="text"
              id="tertiary_insurance"
              name="tertiary_insurance"
              placeholder="Optional"
              value={formData.tertiary_insurance}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
          <motion.div variants={formItemVariants}>
            <label htmlFor="tertiary_insurance_number" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tertiary Insurance Number
            </label>
            <input
              type="text"
              id="tertiary_insurance_number"
              name="tertiary_insurance_number"
              placeholder="Optional"
              value={formData.tertiary_insurance_number}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
        </div>
        
        {/* === WOUND INFORMATION === */}
        <h4 className="text-lg font-semibold text-teal-600 dark:text-teal-400 border-b border-teal-600/50 pb-1 pt-4">
          Wound Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Wound Size Length */}
          <motion.div variants={formItemVariants}>
            <label htmlFor="wound_size_length" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Wound Size Length (mm)
            </label>
            <input
              type="number"
              id="wound_size_length"
              name="wound_size_length"
              placeholder="0"
              min="0"
              value={formData.wound_size_length || ""}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>

          {/* Wound Size Width */}
          <motion.div variants={formItemVariants}>
            <label htmlFor="wound_size_width" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Wound Size Width (mm)
            </label>
            <input
              type="number"
              id="wound_size_width"
              name="wound_size_width"
              placeholder="0"
              min="0"
              value={formData.wound_size_width || ""}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none transition"
            />
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div className="pt-6" variants={formItemVariants}>
          <motion.button
            type="submit"
            className="w-full px-4 py-3 tracking-wide text-white font-bold transition-colors duration-200 transform bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 uppercase shadow-lg"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitText}
          </motion.button>
        </motion.div>

      </motion.form>
    </motion.div>
  );
};

export default NewPatientForm;
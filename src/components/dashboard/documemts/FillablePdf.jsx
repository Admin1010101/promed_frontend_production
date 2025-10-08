import React, { useState, useEffect } from "react";
import { FaTimes, FaFilePdf } from "react-icons/fa";
import CircularProgress from '@mui/material/CircularProgress';
import authRequest from "../../../utils/axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../utils/constants"; 

// Use a placeholder URL or configure a constant
const PATIENT_JOTFORM_URL_BASE = "https://form.jotform.com/252594933893069"; 
const FORM_TYPE = "IVR_FORM"; // Must match the form_type expected by your backend

// ASSUMPTION: You can access the current User's email (provider email) here, 
// likely passed as a prop or fetched via context. For this example, we'll use a placeholder.
const PROVIDER_EMAIL = "provider@example.com"; 

const FillablePdf = ({ patient, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [jotformUrl, setJotformUrl] = useState(PATIENT_JOTFORM_URL_BASE);
  const [completedPdfUrl, setCompletedPdfUrl] = useState(null); 
  const [existingFormFound, setExistingFormFound] = useState(false);
  const constructJotFormUrl = () => {
      // 1. Define the data mapping JotForm field names to patient data.
      // NOTE: These keys (e.g., patientID, q1_name) MUST match the variable names 
      // used in your JotForm pre-fill settings and webhook payload.
      const prefillMap = {
          // CRITICAL FIELDS for the backend webhook (must be in your JotForm)
          providerEmail: PROVIDER_EMAIL, 
          patientID: patient.id, 
          
          // Patient/Form Pre-fill Fields
          q1_patientName: `${patient.first_name} ${patient.last_name}`, 
          q2_patientDOB: patient.date_of_birth, 
          // Add other fields: 'q3_address': patient.address, etc.
      };
      
      const queryParams = new URLSearchParams();

      // 2. Iterate over the map and append parameters using the robust method.
      Object.entries(prefillMap).forEach(([key, value]) => {
          if (value) { 
              queryParams.append(key, value);
          }
      });

      // 3. Construct the final URL.
      const finalUrl = `${PATIENT_JOTFORM_URL_BASE}?${queryParams.toString()}`;
      setJotformUrl(finalUrl);
  };
  const fetchCompletedPdfUrl = async () => {
    if (!patient || !patient.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setCompletedPdfUrl(null);

    try {
      const axiosInstance = authRequest();
      const response = await axiosInstance.get(
        `${API_BASE_URL}/onboarding/forms/sas-url/`,
        {
          params: {
            patient_id: patient.id,
            form_type: FORM_TYPE,
          },
        }
      );

      // Success: A completed form exists and we have the SAS URL
      setCompletedPdfUrl(response.data.sas_url);
      setExistingFormFound(true);
      toast.success("Existing IVR form found and ready to view.");

    } catch (error) {
      // 404/Error: No completed form exists, proceed to construct the JotForm URL
      setExistingFormFound(false);
      constructJotFormUrl(); 

      if (error.response?.status !== 404) {
        toast.error("Failed to check for existing form due to an error.");
        console.error("SAS URL fetch error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedPdfUrl();
  }, [patient]); 

  // --- Rendering Logic ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[600px] w-full">
            <CircularProgress />
            <p className="ml-3 text-gray-600 dark:text-gray-400">Checking for existing form...</p>
        </div>
      );
    }

    // MODE 1: Existing PDF Found
    if (existingFormFound && completedPdfUrl) {
      return (
        <div className="text-center min-h-[600px] flex flex-col items-center justify-center">
          <FaFilePdf className="w-16 h-16 text-red-600 mb-4" />
          <p className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
            A **completed IVR Form** already exists for this patient.
          </p>
          <a
            href={completedPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg shadow-md hover:bg-teal-700 transition flex items-center gap-2"
          >
            <FaFilePdf /> View Completed PDF
          </a>
        </div>
      );
    }

    // MODE 2: No Existing PDF, Show JotForm for new submission
    return (
      <>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Please complete the form below. Patient data has been pre-filled.
        </p>
        <iframe
          src={jotformUrl}
          width="100%"
          height="600px"
          title="Patient Onboarding Form"
          style={{ border: "1px solid #ccc", borderRadius: "8px" }}
          frameBorder="0"
          allowFullScreen
        ></iframe>
        
        <div className="mt-4 flex gap-4">
          <button
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-not-allowed"
              disabled
          >
              Submission Handled by JotForm
          </button>
        </div>
      </>
    );
  };
  
  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative"
      style={{ padding: "2rem" }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        aria-label="Close"
      >
        <FaTimes className="w-6 h-6" />
      </button>

      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Patient IVR Form
      </h3>

      {renderContent()}
    </div>
  );
};

export default FillablePdf;
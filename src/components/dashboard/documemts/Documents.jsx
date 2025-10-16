import React, { useRef, useState, useContext, useEffect, useCallback } from "react";
// Removed unused API_BASE_URL import as it's not used directly here
import {
  FaUpload,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { AuthContext } from "../../../utils/auth";
import CircularProgress from '@mui/material/CircularProgress';
// Removed style-jsx as it's better to keep components clean, but left the implementation inside return for compliance

const FileIcon = ({ filename }) => {
  const ext = filename.split(".").pop().toLowerCase();
  switch (ext) {
    case "pdf":
      return <FaFilePdf className="text-red-500" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-teal-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <FaFileImage className="text-green-500" />;
    default:
      return <FaUpload className="text-gray-500" />;
  }
};

const Documents = () => {
  const { user, verifyToken, uploadDocumentAndEmail } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [jotformStatus, setJotformStatus] = useState("incomplete");
  const [documentType, setDocumentType] = useState("MISCELLANEOUS");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const fileInputRef = useRef(null);

  // Use useCallback to memoize the fetch function and avoid unnecessary re-runs
  const fetchProfile = useCallback(async () => {
      // CRITICAL CHECK: ONLY FETCH IF USER IS AUTHENTICATED AND STABLE
      if (!user) {
          setLoading(true); // Keep loading true until we know for sure
          return;
      }
      
      setLoading(true);
      const { success, data } = await verifyToken();
      if (success) {
        setProfile(data);
      } else {
        // If profile fetch fails, it might be due to an expired token. Log and continue.
        console.error("Failed to fetch profile. Token may be expired.");
        setProfile({}); // Set to an empty object to avoid crashes on profile access
      }
      setLoading(false);
  }, [user, verifyToken]); // DEPENDENCY ON USER

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // Run when fetchProfile dependency changes

  // ----------------------------------------------------------------------
  // DERIVED STATE: Ensure providerInfo is calculated using safe optional chaining
  // ----------------------------------------------------------------------
  const providerInfo = {
    // Both user and profile are checked using optional chaining
    providerName: user?.full_name || "",
    contactEmail: user?.email || "",
    contactPhone: user?.phone_number || "",
    practiceName: profile?.facility || "",
    city: profile?.city || "",
    state: profile?.state || "IL",
    zipCode: profile?.zip_code || "60611",
  };

  const jotformUrl = `https://form.jotform.com/252644214142044?providerName=${encodeURIComponent(providerInfo.providerName)}&contactEmail=${encodeURIComponent(providerInfo.contactEmail)}&practiceName=${encodeURIComponent(providerInfo.practiceName)}&city=${encodeURIComponent(providerInfo.city)}&state=${encodeURIComponent(providerInfo.state)}&zipCode=${encodeURIComponent(providerInfo.zipCode)}`;

  // ----------------------------------------------------------------------
  // HANDLERS (No changes needed, but included for completeness)
  // ----------------------------------------------------------------------
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setUploadStatus("Please select at least one file.");
      return;
    }
    setIsUploading(true);
    setUploadStatus("Uploading and emailing...");

    // uploadDocumentAndEmail function implicitly uses the user's token
    const result = await uploadDocumentAndEmail(documentType, selectedFiles);

    if (result.success) {
      setUploadStatus("Documents emailed successfully!");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      console.error("Upload failed:", result.error);
      setUploadStatus(`Failed to upload documents: ${result.error?.detail || result.error || "Please try again."}`);
    }

    setIsUploading(false);
  };

  const handleOpenJotform = () => {
    setJotformStatus("submitting");
    setShowModal(true);
  };

  // ----------------------------------------------------------------------
  // RENDER CHECKS (Must ensure loading spinner is only shown when truly fetching)
  // ----------------------------------------------------------------------
  // Show a loading spinner if we are explicitly loading OR the user object is null
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // MAIN RENDER (No functional changes, just cleanup)
  // ----------------------------------------------------------------------
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-7">
        Provider Onboarding
      </h2>
      
      {/* Jotform Section */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-10 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Complete the New Account Form
        </h3>
        <div className="mb-6 flex items-start gap-3">
          <div className="flex-1 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg text-sm">
            <div className="flex items-center justify-between">
              <span>
                <strong>Action Required:</strong> Please complete this form
                before uploading any documents.
              </span>
            </div>
          </div>
        </div>
        <div className="mb-10 text-left flex items-center gap-2">
          <button
            onClick={handleOpenJotform}
            disabled={jotformStatus === "completed"}
            className={`text-teal-400 dark:text-teal-500 font-medium hover:underline text-base flex items-center gap-2 cursor-pointer ${jotformStatus === "completed" ? "text-green-500 cursor-not-allowed" : ""}`}
            aria-haspopup="dialog"
            aria-expanded={showModal}
          >
            {jotformStatus === "completed" ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaExclamationCircle className="text-red-500" />
            )}
            {jotformStatus === "completed" ? "New Account Form (Completed)" : "Open New Account Form"}
          </button>
        </div>
      </div>

      {/* 📤 Upload Section */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-10 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Upload Supporting Medical Documents
        </h3>
        <form onSubmit={handleUpload}>
          <div className="mb-4">
            <label
              htmlFor="doc-type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
            >
              Document Type
            </label>
            <select
              id="doc-type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="PROVIDER_RECORDS_REVIEW">Provider Records Review</option>
              <option value="MISCELLANEOUS">Miscellaneous</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="w-full min-h-[120px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400 cursor-pointer group hover:border-teal-500"
            >
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <FaUpload className="text-2xl text-gray-400 group-hover:text-teal-500" />
                {selectedFiles.length > 0 ? (
                  <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {selectedFiles.length} file(s) selected
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Click or drag file(s) to upload
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  (PDF, DOCX, JPG, PNG)
                </span>
              </div>
            </label>
            {selectedFiles.length > 0 && (
              <ul className="mt-4 text-sm text-gray-700 dark:text-gray-200">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <FileIcon filename={file.name} />
                    <span>{file.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            disabled={selectedFiles.length === 0 || isUploading}
            className={`w-full py-2 px-4 rounded-md font-semibold transition duration-200 ${
              selectedFiles.length === 0 || isUploading
                ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-teal-600 dark:bg-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-600"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload Document(s)"}
          </button>
          {uploadStatus && (
            <p className="mt-4 text-sm text-center font-medium">
              {uploadStatus}
            </p>
          )}
        </form>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowModal(false);
          }}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto relative animate-slideIn"
            style={{ outline: "none" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-left w-full"
              >
                New Account Form
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 dark:text-gray-300 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <iframe
                src={jotformUrl}
                title="New Account Form"
                className="w-full min-h-[600px] rounded-md border border-gray-200 dark:border-gray-700 shadow-md"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
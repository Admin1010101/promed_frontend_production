import React, { useRef, useState, useContext, useEffect } from "react";
import {
  FaUpload,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { AuthContext } from "../../../utils/context/auth";
import axiosAuth from "../../../utils/axios";
import CircularProgress from "@mui/material/CircularProgress";
import NewAccountFormModal from "./NewAccountFormModal";

const FileIcon = ({ filename }) => {
  const ext = filename.split(".").pop().toLowerCase();
  switch (ext) {
    case "pdf":
      return <FaFilePdf className="text-red-500" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-500" />;
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
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [jotformStatus, setJotformStatus] = useState("incomplete");
  const [formDetails, setFormDetails] = useState(null);
  const [checkingFormStatus, setCheckingFormStatus] = useState(false);
  const [documentType, setDocumentType] = useState("MISCELLANEOUS");
  const [showNewAccountFormModal, setShowNewAccountFormModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);

  const profile = user;

  // Provider info for the form
  const providerInfo = {
    providerName: user?.full_name || "",
    contactEmail: user?.email || "",
    contactPhone: user?.phone_number || "",
    practiceName: profile?.facility || "",
    city: profile?.city || "",
    state: profile?.state || "IL",
    zipCode: profile?.zip_code || "60611",
  };

  const checkFormStatus = async () => {
    if (!user) return;

    setCheckingFormStatus(true);
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.get(
        "/onboarding/forms/check-status/"
      );

      if (response.data.completed) {
        setJotformStatus("completed");
        setFormDetails({
          date_created: response.data.date_created,
          sas_url: response.data.sas_url,
          form_data: response.data.form_data,
        });
      } else {
        setJotformStatus("incomplete");
      }
    } catch (error) {
      console.error("Error checking form status:", error);
      setJotformStatus("incomplete");
    } finally {
      setCheckingFormStatus(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkFormStatus();
    }
  }, [user]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif'];
    const invalidFiles = files.filter(file => {
      const ext = file.name.split('.').pop().toLowerCase();
      return !allowedExtensions.includes(ext);
    });

    if (invalidFiles.length > 0) {
      setUploadStatus({
        type: "error",
        message: `Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`
      });
      return;
    }

    // Check file size (max 10MB per file)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setUploadStatus({
        type: "error",
        message: `File(s) too large (max 10MB): ${oversizedFiles.map(f => f.name).join(', ')}`
      });
      return;
    }

    // Limit to 10 files
    if (files.length > 10) {
      setUploadStatus({
        type: "error",
        message: "Maximum 10 files allowed per upload"
      });
      return;
    }

    setSelectedFiles(files);
    setUploadStatus({ type: "", message: "" });
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setUploadStatus({
        type: "error",
        message: "Please select at least one file."
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus({
      type: "info",
      message: "Uploading and emailing documents..."
    });

    try {
      const axiosInstance = axiosAuth();
      const formData = new FormData();
      
      // Append document type
      formData.append('document_type', documentType);
      
      // Append all files
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axiosInstance.post(
        '/onboarding/documents/upload/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setUploadStatus({
          type: "success",
          message: `✓ ${selectedFiles.length} document(s) emailed successfully to supervising physician!`
        });
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setUploadStatus({ type: "", message: "" });
        }, 5000);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          "Failed to upload documents. Please try again.";
      setUploadStatus({
        type: "error",
        message: `✗ ${errorMessage}`
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenJotform = () => {
    if (jotformStatus === "completed") {
      if (formDetails?.sas_url) {
        window.open(formDetails.sas_url, "_blank");
      }
    } else {
      setShowNewAccountFormModal(true);
    }
  };

  const handleFormComplete = (result) => {
    setJotformStatus("completed");
    setFormDetails({
      date_created: result.date_created,
      sas_url: result.sas_url,
      form_data: result.form_data,
    });
    setShowNewAccountFormModal(false);
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

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

        {checkingFormStatus ? (
          <div className="flex items-center justify-center py-4">
            <FaSpinner className="animate-spin text-teal-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Checking form status...
            </span>
          </div>
        ) : (
          <>
            {jotformStatus === "completed" ? (
              <div className="mb-6 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-400 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <div>
                      <p className="font-semibold">
                        Form Completed Successfully!
                      </p>
                      <p className="text-sm mt-1">
                        Your new account form was submitted on{" "}
                        {formDetails?.date_created
                          ? new Date(
                              formDetails.date_created
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "recently"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={checkFormStatus}
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                    title="Refresh status"
                  >
                    <FaSpinner className="text-lg" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-400 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span>
                    <strong>Action Required:</strong> Please complete this form
                    before uploading any documents.
                  </span>
                </div>
              </div>
            )}

            <div className="mb-10 text-left flex items-center gap-2">
              <button
                onClick={handleOpenJotform}
                className={`font-medium hover:underline text-base flex items-center gap-2 ${
                  jotformStatus === "completed"
                    ? "text-green-500 cursor-pointer"
                    : "text-teal-400 dark:text-teal-500 cursor-pointer"
                }`}
              >
                {jotformStatus === "completed" ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaExclamationCircle className="text-red-500" />
                )}
                {jotformStatus === "completed"
                  ? "View New Account Form (Completed)"
                  : "Open New Account Form"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Upload Section */}
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-10 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Upload Supporting Medical Documents
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Upload documents that will be emailed directly to the supervising physician for review. 
          Files are not stored on our servers.
        </p>

        {jotformStatus !== "completed" && (
          <div className="mb-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg text-sm">
            <p className="flex items-center gap-2">
              <FaExclamationCircle />
              Please complete the New Account Form before uploading documents.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
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
              disabled={jotformStatus !== "completed"}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="PROVIDER_RECORDS_REVIEW">
                Provider Records Review
              </option>
              <option value="MISCELLANEOUS">Miscellaneous</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="file-upload"
              className={`w-full min-h-[120px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center transition-all ${
                jotformStatus === "completed"
                  ? "border-gray-300 dark:border-gray-600 cursor-pointer hover:border-teal-500 hover:bg-teal-50 dark:hover:bg-gray-700"
                  : "border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50"
              }`}
            >
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                disabled={jotformStatus !== "completed"}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <FaUpload className="text-3xl text-gray-400 group-hover:text-teal-500 transition-colors" />
                {selectedFiles.length > 0 ? (
                  <div className="flex items-center space-x-2 text-teal-700 dark:text-teal-400">
                    <span className="text-sm font-medium">
                      {selectedFiles.length} file(s) selected
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {jotformStatus === "completed"
                      ? "Click to select file(s) or drag and drop"
                      : "Complete the form first to upload files"}
                  </span>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Supported: PDF, DOCX, JPG, PNG, GIF (Max 10MB per file, 10 files max)
                </span>
              </div>
            </label>

            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 group hover:border-teal-500 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FileIcon filename={file.name} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-3 text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove file"
                    >
                      <FaTimes className="text-lg" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={
              selectedFiles.length === 0 ||
              isUploading ||
              jotformStatus !== "completed"
            }
            className={`w-full py-3 px-4 rounded-md font-semibold transition duration-200 flex items-center justify-center gap-2 ${
              selectedFiles.length === 0 ||
              isUploading ||
              jotformStatus !== "completed"
                ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-teal-600 dark:bg-teal-700 text-white hover:bg-teal-700 dark:hover:bg-teal-600 shadow-md hover:shadow-lg"
            }`}
          >
            {isUploading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Uploading & Emailing...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>Email Document(s) to Physician</span>
              </>
            )}
          </button>

          {uploadStatus.message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm font-medium text-center ${
                uploadStatus.type === "success"
                  ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"
                  : uploadStatus.type === "error"
                  ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"
                  : "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
              }`}
            >
              {uploadStatus.message}
            </div>
          )}
        </div>
      </div>

      <NewAccountFormModal
        open={showNewAccountFormModal}
        onClose={() => setShowNewAccountFormModal(false)}
        onFormComplete={handleFormComplete}
        initialData={providerInfo}
      />
    </div>
  );
};

export default Documents;
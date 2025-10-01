 // Corrected EditPdfFormModal.jsx
import React, { useState, useEffect } from "react";
import authRequest from "../../../utils/axios";
import toast from "react-hot-toast";

const EditPdfFormModal = ({ formData, patientId, onClose, onSuccess }) => {
  const [form, setForm] = useState(formData);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm({ ...formData });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const axiosInstance = authRequest();
      
      const response = await axiosInstance.post(
        `/onboarding/forms/prepopulate-and-serve/`,
        {
          patient_id: patientId,
          form_type: "IVR_FORM",
          form_data: form,
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      toast.success("PDF updated!");
      onSuccess(blobUrl, form); // Pass both the URL and form data
      onClose(); // Explicitly close the modal here

    } catch (error) {
      console.error("Error updating form:", error);
      toast.error("Failed to update form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // ... rest of the component is the same
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Edit PDF Fields</h2>
        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(form).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">{key}</label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6 space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPdfFormModal;
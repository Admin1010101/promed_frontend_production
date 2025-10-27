import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import logo from "../../../assets/images/logo.png";

export default function NewAccountFormModal({
  open,
  onClose,
  initialData,
  onFormComplete,
}) {
  // Function to get the first name from the full name
  const getFirstName = (fullName) => fullName?.split(" ")[0] || "";
  // Function to set initial form state based on provided data
  const getInitialState = (data) => ({
    distributor: "",
    salesRepName: "",
    isoIfApplicable: "",
    salesRepCell: "",
    providerName: data?.providerName || "",
    taxIdNumber: "",
    practiceName: data?.practiceName || "",
    shipTo: data?.practiceName || "",
    shipCity: data?.city || "",
    shipState: data?.state || "",
    shipZip: data?.zipCode || "",
    contactName: data?.providerName || "",
    contactPhone: data?.contactPhone || "",
    contactEmail: data?.contactEmail || "",
    practicePhone: data?.contactPhone || "",
    practiceFax: "",
    practiceEmail: data?.contactEmail || "",
    individualNpi: "",
    groupNpi: "",
    ptan: "",
    billTo: "",
    billCity: "",
    billState: "",
    billZip: "",
    apContactName: "",
    apPhone: "",
    apEmail: "",
    billingContactName: "",
    billingContactEmail: "",
    billingContactPhone: "",
    billerType: "internal",
    signatureName: getFirstName(data?.providerName),
    signatureDate: new Date().toISOString().split("T")[0],
  });

  console.log('Init Data: ', initialData)

  const [formData, setFormData] = useState(getInitialState(initialData));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData(getInitialState(initialData));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1/onboarding/forms/save-new-account/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          form_data: formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save form");
      }

      const result = await response.json();

      if (onFormComplete) {
        onFormComplete(result);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  // ✅ FIXED: Clear, high-contrast input styling
  const inputClass =
    "w-full border-2 border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all";

  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-5 flex justify-between items-center z-10 rounded-t-2xl">
          <div className="flex flex-row items-center justify-center flex-1 gap-4">
            <img src={logo} alt="ProMed Logo" className="h-24 w-24" />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-wide">
                ProMed Health Plus
              </h1>
              <h2 className="text-lg font-semibold text-blue-100 tracking-wider mt-1">
                NEW ACCOUNT FORM
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-8 bg-gray-50">
          <div ref={formRef} className="space-y-6">
            {/* Summary Section */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 text-base">
                📋 Provider Information Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Provider Name:</span>
                  <span className="text-gray-900 font-medium">{initialData?.providerName || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Practice:</span>
                  <span className="text-gray-900 font-medium">{initialData?.practiceName || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Email:</span>
                  <span className="text-gray-900 font-medium">{initialData?.contactEmail || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-600">Location:</span>
                  <span className="text-gray-900 font-medium">
                    {initialData?.city}, {initialData?.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>Distributor:</label>
                <input
                  type="text"
                  name="distributor"
                  value={formData.distributor}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>Sales Rep Name:</label>
                <input
                  type="text"
                  name="salesRepName"
                  value={formData.salesRepName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>ISO If Applicable:</label>
                <input
                  type="text"
                  name="isoIfApplicable"
                  value={formData.isoIfApplicable}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>Sales Rep Cell:</label>
                <input
                  type="text"
                  name="salesRepCell"
                  value={formData.salesRepCell}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>
                  Provider Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>Tax ID Number:</label>
                <input
                  type="text"
                  name="taxIdNumber"
                  value={formData.taxIdNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <label className={labelClass}>
                Practice Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="practiceName"
                value={formData.practiceName}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            {/* Shipping Address */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-l-4 border-blue-600 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4 text-base flex items-center gap-2">
                <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">
                  📍
                </span>
                Shipping Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Ship To: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shipTo"
                    value={formData.shipTo}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <label className={labelClass}>
                      City: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shipCity"
                      value={formData.shipCity}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <label className={labelClass}>
                      State: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shipState"
                      value={formData.shipState}
                      onChange={handleChange}
                      className={inputClass}
                      maxLength="2"
                      required
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <label className={labelClass}>
                      ZIP: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shipZip"
                      value={formData.shipZip}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-l-4 border-green-600 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4 text-base flex items-center gap-2">
                <span className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm">
                  📞
                </span>
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Contact Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Contact Phone: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Contact Email: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Practice Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>Practice Phone:</label>
                <input
                  type="tel"
                  name="practicePhone"
                  value={formData.practicePhone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>Practice Fax:</label>
                <input
                  type="text"
                  name="practiceFax"
                  value={formData.practiceFax}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>Practice Email:</label>
                <input
                  type="email"
                  name="practiceEmail"
                  value={formData.practiceEmail}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Billing NPI */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-l-4 border-purple-600 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4 text-base flex items-center gap-2">
                <span className="bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm">
                  🏥
                </span>
                Billing NPI
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Individual NPI:</label>
                  <input
                    type="text"
                    name="individualNpi"
                    value={formData.individualNpi}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Group NPI:</label>
                  <input
                    type="text"
                    name="groupNpi"
                    value={formData.groupNpi}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>PTAN:</label>
                <input
                  type="text"
                  name="ptan"
                  value={formData.ptan}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border-l-4 border-amber-600 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4 text-base flex items-center gap-2">
                <span className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-sm">
                  💳
                </span>
                Billing Address
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Bill To:</label>
                  <input
                    type="text"
                    name="billTo"
                    value={formData.billTo}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <label className={labelClass}>City:</label>
                    <input
                      type="text"
                      name="billCity"
                      value={formData.billCity}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <label className={labelClass}>State:</label>
                    <input
                      type="text"
                      name="billState"
                      value={formData.billState}
                      onChange={handleChange}
                      className={inputClass}
                      maxLength="2"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <label className={labelClass}>ZIP:</label>
                    <input
                      type="text"
                      name="billZip"
                      value={formData.billZip}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Accounts Payable */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>AP Contact Name:</label>
                <input
                  type="text"
                  name="apContactName"
                  value={formData.apContactName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>AP Phone:</label>
                <input
                  type="tel"
                  name="apPhone"
                  value={formData.apPhone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <label className={labelClass}>AP Email:</label>
                <input
                  type="email"
                  name="apEmail"
                  value={formData.apEmail}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Billing Party Contact */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-5 text-base flex items-center gap-2">
                <span className="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm">
                  📋
                </span>
                Billing Party Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <div>
                  <label className={labelClass}>Contact Name:</label>
                  <input
                    type="text"
                    name="billingContactName"
                    value={formData.billingContactName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email:</label>
                  <input
                    type="email"
                    name="billingContactEmail"
                    value={formData.billingContactEmail}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 mb-5 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.billerType === "internal"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        billerType: "internal",
                      }))
                    }
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-700">
                    Internal Biller
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.billerType === "thirdParty"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        billerType: "thirdParty",
                      }))
                    }
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                  <span className="font-semibold text-gray-700">
                    3rd Party Biller
                  </span>
                </label>
              </div>

              <div>
                <label className={labelClass}>Phone:</label>
                <input
                  type="tel"
                  name="billingContactPhone"
                  value={formData.billingContactPhone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Authorization */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-3 border-red-300 rounded-xl p-7 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2">
                <span className="text-2xl">✍️</span>
                Authorization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>
                    Print Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="signatureName"
                    value={formData.signatureName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Date: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="signatureDate"
                    value={formData.signatureDate}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t-2 border-gray-300 flex flex-col sm:flex-row justify-end gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all disabled:opacity-50 font-semibold shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !formData.providerName ||
                !formData.practiceName ||
                !formData.shipTo ||
                !formData.shipCity ||
                !formData.shipState ||
                !formData.shipZip ||
                !formData.contactName ||
                !formData.contactPhone ||
                !formData.contactEmail ||
                !formData.signatureName
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Saving...
                </>
              ) : (
                "Save Form"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
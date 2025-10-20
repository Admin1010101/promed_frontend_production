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
    // Pre-fill Provider/Practice info using initialData
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

  const [formData, setFormData] = useState(getInitialState(initialData));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  // Use useEffect to ensure formData updates if initialData changes while the modal is open
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* KEPT BLUE HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-6 flex justify-between items-center z-10">
          <div className="flex flex-row items-center justify-center flex-1">
            <img src={logo} alt="" style={{ height: 120, width: 120 }} />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-wide">
                ProMed Health Plus
              </h1>
              <h2 className="text-lg font-semibold text-blue-100 tracking-wider">
                NEW ACCOUNT FORM
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div ref={formRef} className="space-y-4 text-xs">
            {/* Dark Gray Summary Section */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-5 mb-6">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">
                Provider Information Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Provider Name:</span>{" "}
                  {initialData?.providerName}
                </div>
                <div>
                  <span className="font-semibold">Practice:</span>{" "}
                  {initialData?.practiceName}
                </div>
                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  {initialData?.contactEmail}
                </div>
                <div>
                  <span className="font-semibold">Location:</span>{" "}
                  {initialData?.city}, {initialData?.state}
                </div>
              </div>
            </div>

            {/* Standard Gray Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Distributor:
                </label>
                <input
                  type="text"
                  name="distributor"
                  value={formData.distributor}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Sales Rep Name:
                </label>
                <input
                  type="text"
                  name="salesRepName"
                  value={formData.salesRepName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  ISO If Applicable:
                </label>
                <input
                  type="text"
                  name="isoIfApplicable"
                  value={formData.isoIfApplicable}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Sales Rep Cell:
                </label>
                <input
                  type="text"
                  name="salesRepCell"
                  value={formData.salesRepCell}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Provider Name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-transparent focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Tax ID Number:
                </label>
                <input
                  type="text"
                  name="taxIdNumber"
                  value={formData.taxIdNumber}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-transparent focus:border-gray-500 transition-colors"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
              <label className="font-semibold text-slate-700 block mb-2">
                Practice Name: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="practiceName"
                value={formData.practiceName}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-transparent focus:border-gray-500 transition-colors"
              />
            </div>

            {/* Shipping Address Section - Using Dark Gray Accent */}
            <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-gray-600 shadow-md">
              <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center">
                <span className="bg-gray-600 text-white px-2 py-1 rounded mr-2">
                  📍
                </span>
                Shipping Address
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    Ship To: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shipTo"
                    value={formData.shipTo}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                  />
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <label className="font-semibold text-slate-700 block mb-2">
                      City: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shipCity"
                      value={formData.shipCity}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="font-semibold text-slate-700 block mb-2">
                      State: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shipState"
                      value={formData.shipState}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="font-semibold text-slate-700 block mb-2">
                      ZIP: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="shipZip"
                      value={formData.shipZip}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section - Using Dark Gray Accent */}
            <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-gray-600 shadow-md">
              <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center">
                <span className="bg-gray-600 text-white px-2 py-1 rounded mr-2">
                  📞
                </span>
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    Contact Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    Contact Phone: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    Contact Email: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Practice Phone:
                </label>
                <input
                  type="tel"
                  name="practicePhone"
                  value={formData.practicePhone}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Practice Fax:
                </label>
                <input
                  type="text"
                  name="practiceFax"
                  value={formData.practiceFax}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Practice Email:
                </label>
                <input
                  type="email"
                  name="practiceEmail"
                  value={formData.practiceEmail}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
            </div>

            {/* Billing NPI Section - Using Dark Gray Accent */}
            <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-gray-600 shadow-md">
              <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center">
                <span className="bg-gray-600 text-white px-2 py-1 rounded mr-2">
                  🏥
                </span>
                Billing NPI
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    Individual NPI:
                  </label>
                  <input
                    type="text"
                    name="individualNpi"
                    value={formData.individualNpi}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    Group NPI:
                  </label>
                  <input
                    type="text"
                    name="groupNpi"
                    value={formData.groupNpi}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-2">
                  PTAN:
                </label>
                <input
                  type="text"
                  name="ptan"
                  value={formData.ptan}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                />
              </div>
            </div>

            {/* Billing Address Section - Using Dark Gray Accent */}
            <div className="bg-gray-50 rounded-lg p-5 border-l-4 border-gray-600 shadow-md">
              <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center">
                <span className="bg-gray-600 text-white px-2 py-1 rounded mr-2">
                  💳
                </span>
                Billing Address
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    Bill To:
                  </label>
                  <input
                    type="text"
                    name="billTo"
                    value={formData.billTo}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                  />
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <label className="font-semibold text-slate-700 block mb-2">
                      City:
                    </label>
                    <input
                      type="text"
                      name="billCity"
                      value={formData.billCity}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="font-semibold text-slate-700 block mb-2">
                      State:
                    </label>
                    <input
                      type="text"
                      name="billState"
                      value={formData.billState}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="font-semibold text-slate-700 block mb-2">
                      ZIP:
                    </label>
                    <input
                      type="text"
                      name="billZip"
                      value={formData.billZip}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white/50 focus:border-gray-500 transition-colors rounded-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Accounts Payable Contact Name:
                </label>
                <input
                  type="text"
                  name="apContactName"
                  value={formData.apContactName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Accounts Payable Phone:
                </label>
                <input
                  type="tel"
                  name="apPhone"
                  value={formData.apPhone}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                <label className="font-semibold text-slate-700 block mb-2">
                  Accounts Payable Email:
                </label>
                <input
                  type="email"
                  name="apEmail"
                  value={formData.apEmail}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                />
              </div>
            </div>

            {/* Billing Party Contact Section - Using Dark Gray Accent */}
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 shadow-lg">
              <h3 className="font-bold text-gray-800 mb-4 text-base flex items-center">
                <span className="bg-gray-600 text-white px-3 py-1 rounded mr-2">
                  📋
                </span>
                Billing Party Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    Contact Name:
                  </label>
                  <input
                    type="text"
                    name="billingContactName"
                    value={formData.billingContactName}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white focus:border-gray-500 transition-colors rounded-sm"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="billingContactEmail"
                    value={formData.billingContactEmail}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white focus:border-gray-500 transition-colors rounded-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4 bg-white/60 p-4 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.billerType === "internal"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        billerType: "internal",
                      }))
                    }
                    className="w-5 h-5 accent-gray-600 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-700 group-hover:text-gray-700 transition-colors">
                    Internal Biller
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.billerType === "thirdParty"}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        billerType: "thirdParty",
                      }))
                    }
                    className="w-5 h-5 accent-gray-600 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-700 group-hover:text-gray-700 transition-colors">
                    3rd Party Biller
                  </span>
                </label>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-2">
                  Phone:
                </label>
                <input
                  type="tel"
                  name="billingContactPhone"
                  value={formData.billingContactPhone}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none bg-white focus:border-gray-500 transition-colors rounded-sm"
                />
              </div>
            </div>

            {/* Authorization Section - Using Dark Gray Accent */}
            <div className="bg-gray-50 border-3 border-gray-400 rounded-lg p-8 shadow-xl">
              <h3 className="font-bold text-gray-800 mb-4 text-base">
                ✍️ Authorization
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <label className="font-semibold block mb-2 text-slate-700">
                    Print Name: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="signatureName"
                    value={formData.signatureName}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                  />
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <label className="font-semibold block mb-2 text-slate-700">
                    Date: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="signatureDate"
                    value={formData.signatureDate}
                    onChange={handleChange}
                    className="w-full border-b-2 border-gray-300 px-2 py-1 outline-none focus:border-gray-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t-2 border-gray-300 flex justify-end gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            {/* Kept Blue Save Button for visibility/contrast */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>Saving...
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

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion"; 
import logo from "../../../assets/images/logo.png";
import toast from "react-hot-toast";

// --- Configuration Data ---

const PRODUCT_CHECKBOXES = [
  "Membrane Wrap Q4205",
  "Activate Matrix Q4301",
  "Restorgin Q4191",
  "Amnio-Maxx Q4239",
  "Emerge Matrix Q4297",
  "Helicoll Q4164",
  "NeoStim TL Q4265",
  "Derm-Maxx Q4238",
  "AmnioAMP-MP Q4250",
  "Membrane Wrap Hydro Q4290",
  "Xcell Amnio Matrix Q4280",
  "ACAp-atch Q4325",
  "DermaBind FM Q4313",
  "caregraFT Q4322",
  "DermaBind TL Q4225",
  "alloPLY Q4323",
  "Revoshield+ Q4289",
];

// 💡 Placeholder: Define these arrays as they are used in the form JSX
const POS_OPTIONS = ["Hospital Inpatient (21)", "Hospital Outpatient (22)", "Physician's Office (11)", "ASC (24)", "Home Health (12)"];
const WOUND_BILLING_CODES = [
  { label: "Skin substitute procedure", code: "15271" },
  { label: "Wound care debridement (small)", code: "11042" },
  { label: "Wound care debridement (large)", code: "11045" },
];


// --- Initial State Function ---

const getInitialState = (data) => ({
  patientId: data?.id || data?.patientId || null,
  salesRepresentative: data?.salesRepresentative || "",
  selectedProducts: [],
  // Physician/Facility Demographics
  physicianName: data?.providerName || "",
  physicianSpecialty: data?.specialty || "",
  facilityName: data?.facilityName || "",
  managementCo: "",
  facilityAddress: data?.facilityAddress || "",
  facilityCityStateZip: data?.facilityCityStateZip || "",
  contactName: data?.contactName || "",
  contactPhEmail: "",
  facilityNpi: "",
  taxId: "",
  ptan: "",
  medicaidNumber: "",
  phone: data?.phone || "",
  fax: "",
  // Place of Service
  placeOfService: "",
  otherPosSpecify: "",
  // Insurance
  primaryInsuranceName: data?.primaryInsuranceName || "",
  primaryPolicyNumber: data?.primaryPolicyNumber || "",
  primaryPayerPhone: "",
  primaryInNetwork: true, // true for in, false for out
  secondaryInsuranceName: data?.secondaryInsuranceName || "",
  secondaryPolicyNumber: data?.secondaryPolicyNumber || "",
  secondaryPayerPhone: "",
  secondaryInNetwork: false,
  // Authorization Questions
  permissionToInitiatePA: "no",
  isInHospice: "no",
  isInPartAStay: "no",
  isUnderPostOp: "no",
  postOpCpt: "",
  surgeryDate: "",
  // Wound and Signature
  locationOfWound: "",
  woundBillingCode: "",
  icd10Codes: "", // Mandatory for validation
  totalWoundSize: "",
  physicianSignatureName: data?.providerName || "", // Mandatory for validation
});

// --- Helper Components (Required for the form to compile) ---

const InputLine = ({ label, name, value, onChange, className = "", type = "text", disabled = false }) => (
    <div className={`flex flex-col ${className}`}>
        <label className="text-sm font-bold text-gray-700 uppercase mb-1">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            className={`border-b-2 border-gray-600 h-8 px-1 text-sm outline-none transition-colors ${
                disabled ? 'bg-gray-100 border-dashed text-gray-500' : 'focus:border-blue-500'
            }`}
        />
    </div>
);

const CheckboxItem = ({ label, name, value, checked, onChange, type = "checkbox" }) => (
    <label className="flex items-center text-xs font-medium text-gray-800">
        <input
            type={type}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className={`mr-2 h-4 w-4 border-gray-400 ${type === 'radio' ? 'form-radio' : 'form-checkbox'} accent-blue-600`}
        />
        {label}
    </label>
);

const RadioGroup = ({ label, name, value, options, onChange }) => (
    <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-bold text-gray-700 uppercase flex-shrink-0 mr-2">
            {label}:
        </label>
        {options.map(option => (
            <label key={option.value} className="flex items-center text-sm font-medium text-gray-800">
                <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={onChange}
                    className="form-radio h-4 w-4 text-blue-600 border-gray-400 mr-2 accent-blue-600"
                />
                {option.label}
            </label>
        ))}
    </div>
);

// --- Success Toast Component (Custom content for viewing the PDF) ---
const SuccessToast = ({ t, sasUrl, onClose }) => (
  <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-start w-80">
    <div className="flex items-center mb-2">
      <Check className="w-5 h-5 text-green-500 mr-2" />
      <span className="font-bold text-gray-800">Submission Successful!</span>
    </div>
    <p className="text-sm text-gray-600 mb-3">
      PDF document created and filed successfully.
    </p>

    <a
      href={sasUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        toast.dismiss(t.id);
        onClose();
      }}
      className="w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
    >
      View/Download PDF
    </a>
    <button
      onClick={() => {
        toast.dismiss(t.id);
        onClose();
      }}
      className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
    >
      Close
    </button>
  </div>
);

// --- Main Component ---

export default function IvrFormModal({
  open,
  onClose,
  initialData,
  onFormComplete,
}) {
  const [formData, setFormData] = useState(() => getInitialState(initialData));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const patientIdRef = useRef(initialData?.id || initialData?.patientId);
  
  const formRef = useRef(null); 


  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prevData => {
        if (type === 'checkbox') {
            const currentArray = prevData[name] || [];
            if (checked) {
                return { ...prevData, [name]: [...currentArray, value] };
            } else {
                return { ...prevData, [name]: currentArray.filter(item => item !== value) };
            }
        }
        
        if (type === 'radio') {
            return { ...prevData, [name]: value };
        }

        return {
            ...prevData,
            [name]: value,
        };
    });
  }, []);

  useEffect(() => {
    if (initialData) {
        setFormData(getInitialState(initialData));
        patientIdRef.current = initialData.id || initialData.patientId;
    }
  }, [initialData]);


  const validateForm = useCallback(() => {
    const errors = [];
    if (!patientIdRef.current) {
      errors.push("Missing Patient ID. Cannot submit form.");
    }
    if (formData.selectedProducts.length === 0) {
      errors.push("Please select at least one product requested.");
    }
    if (
      !formData.physicianSignatureName ||
      formData.physicianSignatureName.trim() === ""
    ) {
      errors.push("Physician Signature Name is required.");
    }
    if (!formData.icd10Codes || formData.icd10Codes.trim() === "") {
      errors.push("ICD-10 Codes are required.");
    }

    if (!formData.facilityName || formData.facilityName.trim() === "") {
        errors.push("Facility Name is required.");
    }

    return errors;
  }, [formData]);

  const handleSubmit = async () => {
    const patientId = patientIdRef.current;
    const validationErrors = validateForm();

    // 1. Client-side Validation Check
    if (validationErrors.length > 0) {
        if (formRef.current) {
            // Scroll to the top of the form content on validation error
            formRef.current.scrollTop = 0; 
        }
        validationErrors.forEach((err) => toast.error(err));
        return;
    }

    setIsSubmitting(true);
    let toastId = toast.loading("Verifying data and generating PDF...");

    try {
      const response = await fetch("https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1/forms/save-vr/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          patient_id: patientId,
          form_data: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            errorData.detail ||
            "Failed to save Patient VR form"
        );
      }

      const result = await response.json();

      toast.dismiss(toastId);
      toast(
        (t) => <SuccessToast t={t} sasUrl={result.sas_url} onClose={onClose} />,
        { duration: Infinity }
      );

      if (onFormComplete) {
        onFormComplete(result);
      }
    } catch (error) {
      console.error("Error submitting Patient VR form:", error);

      toast.dismiss(toastId);
      toast.error(`Submission Failed: ${error.message.substring(0, 100)}...`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 overflow-y-auto print:p-0">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[98vh] overflow-y-auto print:max-w-full print:shadow-none print:max-h-full print:rounded-none">
        
        {/* Modal Header (Fixed blue bar) */}
        <div className="sticky top-0 bg-blue-900 p-4 flex justify-between items-center z-10 print:hidden rounded-t-xl">
          <h2 className="text-xl font-bold text-white">
            Patient Verification Request Form
          </h2>
          <motion.button
            onClick={onClose}
            className="text-white hover:text-red-300 transition"
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        <div className="p-4 sm:p-6 md:p-8 print:p-0">
          
          {/* --- MAIN FORM CONTENT CONTAINER --- */}
          <div
            ref={formRef}
            className="space-y-6 text-xs border border-gray-300 p-4 sm:p-6 print:border-none print:p-0"
          >
            
            {/* 1. Header Section (The missing part, now fixed) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-b-4 border-gray-800 pb-3 mb-4 gap-4">
                {/* Left Column (Service Details) */}
                <div className="text-xs text-left sm:pr-4 order-2 sm:order-1 text-gray-900">
                    <p className="font-bold">SERVICED BY:</p>
                    <p>ProMed Health Plus</p>
                    <p>30839 Thousand Oaks Blvd</p>
                    <p>Westlake Village, CA 91362</p>
                    <p>(888)338-0490</p>
                    <p>www.promedhealthplus.com</p>
                </div>

                {/* Center Column (Title) */}
                <div className="flex flex-col items-center justify-center sm:border-l sm:border-r border-gray-300 px-2 sm:px-4 order-1 sm:order-2">
                    <h1 className="text-lg sm:text-xl font-extrabold text-center text-gray-800 tracking-wider flex justify-center items-center">
                        <img src={logo} alt="ProMed Logo" style={{height: 30, width: 30}} className="mr-2"/>
                        ProMed Health Plus
                    </h1>
                    <h3 className="text-md font-bold text-center text-blue-800 tracking-widest mt-1 border-t border-b border-blue-800 px-2 py-0.5">
                        INSURANCE VERIFICATION REQUEST
                    </h3>
                </div>

                {/* Right Column (Sales Rep) */}
                <div className="text-sm text-left sm:text-right sm:pl-4 flex flex-col justify-end order-3 sm:order-3">
                    <div className="flex items-center justify-start sm:justify-end font-semibold text-gray-800">
                        <label className="flex-shrink-0 mr-1">Sales Rep:</label>
                        <input
                            type="text"
                            name="salesRepresentative"
                            value={formData.salesRepresentative}
                            onChange={handleChange}
                            className="border-b border-gray-600 w-full sm:w-3/5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
            {/* END 1. Header Section */}


            {/* 2. Product Checkboxes */}
            <div className="p-3 border border-gray-300 bg-blue-50/50">
              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b-2 border-blue-800 pb-1">
                PRODUCTS REQUESTED
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
                {PRODUCT_CHECKBOXES.map((product) => (
                  <CheckboxItem
                    key={product}
                    label={product}
                    name="selectedProducts"
                    value={product}
                    checked={formData.selectedProducts.includes(product)}
                    onChange={handleChange}
                  />
                ))}
              </div>
            </div>

            {/* 3. Treating Physician and Facility Demographics */}
            <div className="p-4 border border-gray-300 bg-slate-50/50">
              <h3 className="text-sm font-bold text-gray-700 mb-3 border-b-2 border-gray-500 pb-1 uppercase">
                TREATING PHYSICIAN AND FACILITY DEMOGRAPHIC INFORMATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
                <InputLine
                  label="PHYSICIAN NAME"
                  name="physicianName"
                  value={formData.physicianName}
                  onChange={handleChange}
                  className="lg:col-span-2"
                />
                <InputLine
                  label="PHYSICIAN SPECIALTY"
                  name="physicianSpecialty"
                  value={formData.physicianSpecialty}
                  onChange={handleChange}
                />

                <InputLine
                  label="FACILITY NAME"
                  name="facilityName"
                  value={formData.facilityName}
                  onChange={handleChange}
                  className="lg:col-span-2"
                />
                <InputLine
                  label="MANAGEMENT CO"
                  name="managementCo"
                  value={formData.managementCo}
                  onChange={handleChange}
                />

                <InputLine
                  label="FACILITY ADDRESS"
                  name="facilityAddress"
                  value={formData.facilityAddress}
                  onChange={handleChange}
                  className="lg:col-span-3"
                />
                <InputLine
                  label="CITY, STATE, ZIP"
                  name="facilityCityStateZip"
                  value={formData.facilityCityStateZip}
                  onChange={handleChange}
                  className="lg:col-span-3"
                />

                <InputLine
                  label="CONTACT NAME"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                />
                <InputLine
                  label="CONTACT PH/EMAIL"
                  name="contactPhEmail"
                  value={formData.contactPhEmail}
                  onChange={handleChange}
                  className="sm:col-span-2"
                />

                {/* Split Demographics */}
                <InputLine
                  label="FACILITY NPI"
                  name="facilityNpi"
                  value={formData.facilityNpi}
                  onChange={handleChange}
                />
                <InputLine
                  label="TAX ID"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                />
                <InputLine
                  label="PTAN"
                  name="ptan"
                  value={formData.ptan}
                  onChange={handleChange}
                />
                <InputLine
                  label="MEDICAID #"
                  name="medicaidNumber"
                  value={formData.medicaidNumber}
                  onChange={handleChange}
                />
                <InputLine
                  label="PHONE #"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <InputLine
                  label="FAX #"
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 4. Place of Service */}
            <div className="p-4 border border-gray-300 bg-white shadow-inner">
              <h3 className="text-sm font-bold text-gray-700 mb-3 border-b-2 border-gray-500 pb-1 uppercase">
                PLACE OF SERVICE WHERE PATIENT IS BEING SEEN
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6">
                {POS_OPTIONS.map((pos) => (
                  <CheckboxItem
                    key={pos}
                    label={pos}
                    name="placeOfService"
                    value={pos}
                    checked={formData.placeOfService === pos}
                    onChange={handleChange}
                    type="radio"
                  />
                ))}
                <div className="col-span-full flex flex-col sm:flex-row items-start sm:items-center mt-2">
                  <label className="flex items-center text-sm font-medium text-gray-800 mr-2 flex-shrink-0">
                    <input
                      type="radio"
                      name="placeOfService"
                      value="OTHER"
                      checked={formData.placeOfService === "OTHER"}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-blue-600 border-gray-400 mr-2 accent-blue-600"
                    />
                    OTHER (PLEASE SPECIFY):
                  </label>
                  <input
                    type="text"
                    name="otherPosSpecify"
                    value={formData.otherPosSpecify}
                    onChange={handleChange}
                    disabled={formData.placeOfService !== "OTHER"}
                    className={`flex-1 min-w-0 border-b-2 border-gray-600 h-8 px-1 text-sm outline-none transition-colors mt-1 sm:mt-0 ${
                      formData.placeOfService !== "OTHER"
                        ? "bg-gray-100 border-dashed"
                        : "focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* 5. Insurance and Authorization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 border border-gray-300 bg-blue-50/50">
              {/* 5A & 5B: Insurance Columns */}
              {[
                {
                  type: "primary",
                  label: "PRIMARY INSURANCE",
                  namePrefix: "primary",
                },
                {
                  type: "secondary",
                  label: "SECONDARY INSURANCE",
                  namePrefix: "secondary",
                },
              ].map(({ label, namePrefix }) => (
                <div
                  key={namePrefix}
                  className={
                    namePrefix === "secondary" ? "lg:border-l lg:pl-8" : ""
                  }
                >
                  <h4 className="text-sm font-bold text-gray-700 mb-3 border-b-2 border-gray-500 pb-1 uppercase">
                    {label}
                  </h4>
                  <InputLine
                    label="INSURANCE NAME"
                    name={`${namePrefix}InsuranceName`}
                    value={formData[`${namePrefix}InsuranceName`]}
                    onChange={handleChange}
                  />
                  <InputLine
                    label="POLICY NUMBER"
                    name={`${namePrefix}PolicyNumber`}
                    value={formData[`${namePrefix}PolicyNumber`]}
                    onChange={handleChange}
                  />
                  <InputLine
                    label="PAYER PHONE"
                    name={`${namePrefix}PayerPhone`}
                    value={formData[`${namePrefix}PayerPhone`]}
                    onChange={handleChange}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center mt-3 pt-3 border-t border-gray-300 gap-4">
                    <label className="text-sm font-bold text-gray-700 flex-shrink-0">
                      PROVIDER STATUS:
                    </label>
                    <RadioGroup
                      name={`${namePrefix}InNetwork`}
                      value={formData[`${namePrefix}InNetwork`] ? "in" : "out"}
                      options={[
                        { label: "In-Network", value: "in" },
                        { label: "Out-of-Network", value: "out" },
                      ]}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [`${namePrefix}InNetwork`]: e.target.value === "in",
                        }))
                      }
                    />
                  </div>
                </div>
              ))}

              {/* 5C. Authorization Questions (Full Width Below) */}
              <div className="lg:col-span-2 mt-4 pt-4 border-t-2 border-gray-400 space-y-4">
                <RadioGroup
                  label="PERMISSION TO INITIATE PRIOR AUTHORIZATION"
                  name="permissionToInitiatePA"
                  value={formData.permissionToInitiatePA}
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  onChange={handleChange}
                />

                <RadioGroup
                  label="IS THE PATIENT CURRENTLY IN HOSPICE"
                  name="isInHospice"
                  value={formData.isInHospice}
                  options={[
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                  ]}
                  onChange={handleChange}
                />

                <div className="flex flex-col gap-2">
                  <RadioGroup
                    label="IS THE PATIENT IN A FACILITY UNDER PART A STAY"
                    name="isInPartAStay"
                    value={formData.isInPartAStay}
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    onChange={handleChange}
                  />
                  {formData.isInPartAStay === "yes" && (
                    <span className="text-xs text-red-600 font-semibold ml-0 sm:ml-4 bg-red-50 p-1 rounded">
                      (IF YES, PART B SERVICES CANNOT BE BILLED)
                    </span>
                  )}
                </div>

                <div className="border border-dashed border-gray-300 p-3 rounded-md space-y-3">
                  <RadioGroup
                    label="IS THE PATIENT CURRENTLY UNDER A POST-OP GLOBAL SURGICAL PERIOD"
                    name="isUnderPostOp"
                    value={formData.isUnderPostOp}
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    onChange={handleChange}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <InputLine
                      label="IF YES, PLEASE LIST CPT CODE(S) OF PREVIOUS SURGERY"
                      name="postOpCpt"
                      value={formData.postOpCpt}
                      onChange={handleChange}
                      disabled={formData.isUnderPostOp !== "yes"}
                      className="col-span-1"
                    />
                    <InputLine
                      label="SURGERY DATE"
                      name="surgeryDate"
                      value={formData.surgeryDate}
                      onChange={handleChange}
                      disabled={formData.isUnderPostOp !== "yes"}
                      type="date"
                      className="col-span-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Wound Location, Codes, and Signature */}
            <div className="p-4 border border-gray-300 space-y-4">
              <InputLine
                label="LOCATION OF WOUND"
                name="locationOfWound"
                value={formData.locationOfWound}
                onChange={handleChange}
                className="lg:col-span-3"
              />

              {/* Wound Billing Checkboxes (Radio Group) */}
              <h4 className="text-sm font-bold text-gray-700 mb-2 mt-4 uppercase border-b border-gray-300 pb-1">
                WOUND BILLING CODES:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 p-3 border border-dashed border-gray-300">
                {WOUND_BILLING_CODES.map(({ label, code }) => (
                  <CheckboxItem
                    key={code}
                    label={
                      <>
                        {" "}
                        {label}{" "}
                        <span className="ml-2 font-mono text-xs text-gray-600 font-normal">
                          ({code})
                        </span>{" "}
                      </>
                    }
                    name="woundBillingCode"
                    value={code}
                    checked={formData.woundBillingCode === code}
                    onChange={handleChange}
                    type="radio"
                  />
                ))}
              </div>

              {/* Large Text Areas */}
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 uppercase mb-1">
                  ICD-10 CODES:
                </label>
                <textarea
                  name="icd10Codes"
                  value={formData.icd10Codes}
                  onChange={handleChange}
                  rows="3"
                  className="border-2 border-gray-400 p-2 text-sm focus:border-blue-500 outline-none resize-y rounded-md"
                ></textarea>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 uppercase mb-1">
                  TOTAL WOUND SIZE AND / OR MEDICAL HISTORY:
                </label>
                <textarea
                  name="totalWoundSize"
                  value={formData.totalWoundSize}
                  onChange={handleChange}
                  rows="3"
                  className="border-2 border-gray-400 p-2 text-sm focus:border-blue-500 outline-none resize-y rounded-md"
                ></textarea>
              </div>

              {/* Signature */}
              <div className="flex flex-col pt-4 border-t border-gray-300">
                <label className="text-sm font-bold text-gray-700 uppercase mb-1">
                  PHYSICIAN SIGNATURE NAME (TYPED):
                </label>
                <input
                  type="text"
                  name="physicianSignatureName"
                  value={formData.physicianSignatureName}
                  onChange={handleChange}
                  className="border-b-2 border-gray-600 h-8 px-1 text-base focus:border-blue-500 outline-none font-semibold"
                />
              </div>
            </div>
          </div>
          {/* --- END MAIN FORM CONTENT CONTAINER --- */}

          {/* Footer Buttons */}
          <div className="mt-8 pt-4 border-t-2 border-gray-300 flex flex-col sm:flex-row justify-end gap-4 print:hidden">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" /> Submit Patient VR Form
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
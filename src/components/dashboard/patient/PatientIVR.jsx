import React, { useState, useRef, useEffect } from "react";
import { X, Check } from "lucide-react";
import logo from "../../../assets/images/logo.png";

// --- Form Data Configuration ---

const productCheckboxes = [
  'Membrane Wrap Q4205', 'Activate Matrix Q4301', 'Restorgin Q4191', 'Amnio-Maxx Q4239',
  'Emerge Matrix Q4297', 'Helicoll Q4164', 'NeoStim TL Q4265', 'Derm-Maxx Q4238',
  'AmnioAMP-MP Q4250', 'Membrane Wrap Hydro Q4290', 'Xcell Amnio Matrix Q4280', 'ACAp-atch Q4325',
  'DermaBind FM Q4313', 'caregraFT Q4322', 'DermaBind TL Q4225', 'alloPLY Q4323',
  'Revoshield+ Q4289'
];

// Initial state for the IVR form
const getInitialState = (data) => ({
  // Sales Rep (Header)
  salesRepresentative: "",

  // Products (Checkboxes)
  selectedProducts: [], 

  // Physician & Facility Demographics
  physicianName: data?.providerName || "",
  physicianSpecialty: "",
  facilityName: data?.practiceName || "",
  facilityAddress: data?.address || "",
  facilityCityStateZip: `${data?.city || ''}, ${data?.state || ''}, ${data?.zipCode || ''}`,
  contactName: data?.providerName || "",
  contactPhEmail: `${data?.contactPhone || ''} / ${data?.contactEmail || ''}`,
  facilityNpi: data?.npi || "",
  taxId: data?.taxId || "",
  ptan: data?.ptan || "",
  medicaidNumber: "",
  phone: data?.contactPhone || "",
  fax: data?.fax || "",
  managementCo: "",

  // Place of Service
  placeOfService: "PHYSICIAN OFFICE (POS 11)", // Default selection
  otherPosSpecify: "",

  // Insurance
  primaryInsuranceName: "",
  primaryPolicyNumber: "",
  primaryPayerPhone: "",
  primaryInNetwork: false,
  secondaryInsuranceName: "",
  secondaryPolicyNumber: "",
  secondaryPayerPhone: "",
  secondaryInNetwork: false,

  // Authorization & Patient Status
  permissionToInitiatePA: "yes",
  isInHospice: "no",
  isInPartAStay: "no",
  isUnderPostOp: "no",
  postOpCpt: "",
  surgeryDate: "",

  // Wound Location & Billing
  locationOfWound: "",
  woundBillingCode: "", // Store the selected code (e.g., '15271/15272')

  // History & Signature
  icd10Codes: "",
  totalWoundSize: "",
  physicianSignatureName: data?.providerName || "",
});


// --- Component Definitions ---

// Helper component for styled input lines (used frequently in the IVR form)
const InputLine = ({ label, name, value, onChange, className = '' }) => (
    <div className={`flex flex-col mb-2 ${className}`}>
      <label className="text-xs font-semibold text-gray-700 uppercase mb-0.5">{label}</label>
      <input 
        type="text" 
        name={name} 
        value={value} 
        onChange={onChange}
        className="border-b border-gray-600 h-6 px-1 text-sm focus:border-blue-500 outline-none transition-colors"
      />
    </div>
);

// Helper component for the checkbox grid
const CheckboxItem = ({ label, name, checked, onChange }) => (
    <label className="flex items-center text-sm font-medium text-gray-800 cursor-pointer">
        <input 
            type="checkbox" 
            name={name}
            checked={checked}
            onChange={onChange}
            className="form-checkbox h-4 w-4 text-blue-600 border-gray-400 rounded mr-2 accent-gray-600" 
        />
        {label}
    </label>
);

// Main Component
export default function IvrFormModal({
  open,
  onClose,
  initialData,
  onFormComplete,
}) {
  const [formData, setFormData] = useState(getInitialState(initialData));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData(getInitialState(initialData));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle specific checkbox array (Products)
    if (name === 'selectedProducts') {
        setFormData(prev => {
            const products = prev.selectedProducts;
            if (checked) {
                return { ...prev, selectedProducts: [...products, value] };
            } else {
                return { ...prev, selectedProducts: products.filter(p => p !== value) };
            }
        });
    } 
    // Handle single radio/checkbox-like fields
    else if (type === 'radio' || type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: checked ? value : (prev[name] === value ? '' : prev[name]) }));
    } 
    // Handle text inputs
    else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // NOTE: Using a hypothetical endpoint for IVR forms
      const response = await fetch("https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1/onboarding/forms/save-ivr-form/", {
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save IVR form");
      }

      const result = await response.json();

      if (onFormComplete) {
        onFormComplete(result);
      }

      alert("IVR Form submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting IVR form:", error);
      alert(`Failed to save form. Error: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto print:max-w-4xl print:shadow-none">
        
        {/* KEPT BLUE HEADER */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-4 flex justify-between items-center z-10 print:hidden">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Patient IVR Form
          </h1>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 print:p-0">
          <div ref={formRef} className="space-y-6 text-xs border border-gray-300 p-6 print:border-none print:p-0">
            
            {/* 1. Header Section (Print-Style Layout) */}
            <div className="grid grid-cols-3 border-b-4 border-gray-800 pb-3 mb-4">
                {/* Left Column (Service Details) */}
                <div className="text-xs text-left pr-4">
                    <p className="font-bold">SERVICED BY:</p>
                    <p>ProMed Health Plus</p>
                    <p>1100 Ludlow Street</p>
                    <p>Philadelphia, PA 19107</p>
                    <p>o. 267-235-1092</p>
                    <p>www.promedhealthplus.com</p>
                </div>

                {/* Center Column (Title) */}
                <div className="flex flex-col items-center justify-center border-l border-r border-gray-300 px-4">
                    <h1 className="text-xl font-extrabold text-center text-gray-800 tracking-wider">
                        ProMed Health Plus
                    </h1>
                    <h2 className="text-md font-semibold text-center text-gray-600 tracking-wide">
                        Philadelphia, USA
                    </h2>
                    <h3 className="text-lg font-bold text-center text-blue-800 tracking-widest mt-2 border-t border-b border-blue-800 px-2 py-0.5">
                        INSURANCE VERIFICATION REQUEST
                    </h3>
                </div>

                {/* Right Column (Sales Rep) */}
                <div className="text-sm text-right pl-4 flex flex-col justify-end">
                    <div className="flex items-center justify-end font-semibold text-gray-800">
                        Sales Representative: 
                        <input
                            type="text"
                            name="salesRepresentative"
                            value={formData.salesRepresentative}
                            onChange={handleChange}
                            className="border-b border-gray-600 ml-1 inline-block w-3/5 text-sm outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Product Checkboxes (17 items) */}
            <div className="p-3 border border-gray-300">
                <h3 className="text-sm font-bold text-gray-700 mb-2 border-b border-gray-400 pb-1">PRODUCTS REQUESTED</h3>
                <div className="grid grid-cols-4 gap-x-6 gap-y-1">
                    {productCheckboxes.map((product) => (
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
            <div className="p-4 border border-gray-300">
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-500 pb-1 uppercase">
                    TREATING PHYSICIAN AND FACILITY DEMOGRAPHIC INFORMATION
                </h3>
                
                <div className="grid grid-cols-3 gap-x-6">
                    {/* Left/Middle Column - Full Width Lines */}
                    <div className="col-span-2">
                        <InputLine label="PHYSICIAN NAME" name="physicianName" value={formData.physicianName} onChange={handleChange} />
                        <InputLine label="PHYSICIAN SPECIALTY" name="physicianSpecialty" value={formData.physicianSpecialty} onChange={handleChange} />
                        <InputLine label="FACILITY NAME" name="facilityName" value={formData.facilityName} onChange={handleChange} />
                        <InputLine label="FACILITY ADDRESS" name="facilityAddress" value={formData.facilityAddress} onChange={handleChange} />
                        <InputLine label="CITY, STATE, ZIP" name="facilityCityStateZip" value={formData.facilityCityStateZip} onChange={handleChange} />
                        <InputLine label="CONTACT NAME" name="contactName" value={formData.contactName} onChange={handleChange} />
                        <InputLine label="CONTACT PH/EMAIL" name="contactPhEmail" value={formData.contactPhEmail} onChange={handleChange} />
                    </div>

                    {/* Right Column - Split Demographics */}
                    <div className="col-span-1 grid grid-cols-2 gap-x-4">
                        <InputLine label="FACILITY NPI" name="facilityNpi" value={formData.facilityNpi} onChange={handleChange} />
                        <InputLine label="TAX ID" name="taxId" value={formData.taxId} onChange={handleChange} />
                        <InputLine label="PTAN" name="ptan" value={formData.ptan} onChange={handleChange} />
                        <InputLine label="MEDICAID #" name="medicaidNumber" value={formData.medicaidNumber} onChange={handleChange} />
                        <InputLine label="PHONE #" name="phone" value={formData.phone} onChange={handleChange} />
                        <InputLine label="FAX #" name="fax" value={formData.fax} onChange={handleChange} />
                        <div className="col-span-2">
                            <InputLine label="MANAGEMENT CO" name="managementCo" value={formData.managementCo} onChange={handleChange} />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 4. Place of Service */}
            <div className="p-4 border border-gray-300">
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-500 pb-1 uppercase">
                    PLACE OF SERVICE WHERE PATIENT IS BEING SEEN
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        "PHYSICIAN OFFICE (POS 11)",
                        "HOSPITAL OUTPATIENT (POS 22)",
                        "SURGERY CENTER (POS 24)",
                        "HOME (POS 12)",
                        "NURSING CARE FACILITY (POS 32 )"
                    ].map(pos => (
                        <label key={pos} className="flex items-center text-sm font-medium text-gray-800 cursor-pointer">
                            <input 
                                type="radio" 
                                name="placeOfService" 
                                value={pos} 
                                checked={formData.placeOfService === pos}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 border-gray-400 mr-2 accent-gray-600"
                            />
                            {pos}
                        </label>
                    ))}
                    <div className="col-span-3 flex items-center">
                        <label className="flex items-center text-sm font-medium text-gray-800 mr-2">
                            <input 
                                type="radio" 
                                name="placeOfService" 
                                value="OTHER" 
                                checked={formData.placeOfService === "OTHER"}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 border-gray-400 mr-2 accent-gray-600"
                            />
                            OTHER (PLEASE SPECIFY):
                        </label>
                        <input
                            type="text"
                            name="otherPosSpecify"
                            value={formData.otherPosSpecify}
                            onChange={handleChange}
                            disabled={formData.placeOfService !== "OTHER"}
                            className={`flex-1 border-b border-gray-600 h-6 px-1 text-sm outline-none transition-colors ${formData.placeOfService !== "OTHER" ? 'bg-gray-100 border-dashed' : 'focus:border-blue-500'}`}
                        />
                    </div>
                </div>
            </div>

            {/* 5. Insurance and Authorization */}
            <div className="grid grid-cols-2 gap-x-8 p-4 border border-gray-300">
                {/* 5A. Primary Insurance Column */}
                <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-500 pb-1 uppercase">
                        PRIMARY INSURANCE
                    </h4>
                    <InputLine label="INSURANCE NAME" name="primaryInsuranceName" value={formData.primaryInsuranceName} onChange={handleChange} />
                    <InputLine label="POLICY NUMBER" name="primaryPolicyNumber" value={formData.primaryPolicyNumber} onChange={handleChange} />
                    <InputLine label="PAYER PHONE" name="primaryPayerPhone" value={formData.primaryPayerPhone} onChange={handleChange} />
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
                        <label className="text-sm font-bold text-gray-700">PROVIDER STATUS:</label>
                        <CheckboxItem 
                            label="In-Network" 
                            name="primaryInNetwork" 
                            checked={formData.primaryInNetwork} 
                            onChange={(e) => setFormData(prev => ({...prev, primaryInNetwork: e.target.checked}))} 
                        />
                        <CheckboxItem 
                            label="Out-of-Network" 
                            name="primaryInNetwork" 
                            checked={!formData.primaryInNetwork} 
                            onChange={(e) => setFormData(prev => ({...prev, primaryInNetwork: !e.target.checked}))} 
                        />
                    </div>
                </div>

                {/* 5B. Secondary Insurance Column */}
                <div className="border-l border-gray-300 pl-8">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 border-b border-gray-500 pb-1 uppercase">
                        SECONDARY INSURANCE
                    </h4>
                    <InputLine label="INSURANCE NAME" name="secondaryInsuranceName" value={formData.secondaryInsuranceName} onChange={handleChange} />
                    <InputLine label="POLICY NUMBER" name="secondaryPolicyNumber" value={formData.secondaryPolicyNumber} onChange={handleChange} />
                    <InputLine label="PAYER PHONE" name="secondaryPayerPhone" value={formData.secondaryPayerPhone} onChange={handleChange} />
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
                        <label className="text-sm font-bold text-gray-700">PROVIDER STATUS:</label>
                        <CheckboxItem 
                            label="In-Network" 
                            name="secondaryInNetwork" 
                            checked={formData.secondaryInNetwork} 
                            onChange={(e) => setFormData(prev => ({...prev, secondaryInNetwork: e.target.checked}))} 
                        />
                        <CheckboxItem 
                            label="Out-of-Network" 
                            name="secondaryInNetwork" 
                            checked={!formData.secondaryInNetwork} 
                            onChange={(e) => setFormData(prev => ({...prev, secondaryInNetwork: !e.target.checked}))} 
                        />
                    </div>
                </div>

                {/* 5C. Authorization Questions (Full Width Below) */}
                <div className="col-span-2 mt-4 pt-4 border-t border-gray-300 space-y-3">
                    {/* Prior Authorization Permission */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-gray-700 uppercase">
                            DO WE HAVE YOUR PERMISSION TO INITIATE AND FOLLOW UP ON PRIOR AUTHORIZATION?
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-800">
                            <input type="radio" name="permissionToInitiatePA" value="yes" checked={formData.permissionToInitiatePA === 'yes'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600 mr-1 accent-gray-600" /> Yes
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-800">
                            <input type="radio" name="permissionToInitiatePA" value="no" checked={formData.permissionToInitiatePA === 'no'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600 mr-1 accent-gray-600" /> No
                        </label>
                    </div>

                    {/* Hospice Status */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-gray-700 uppercase">
                            IS THE PATIENT CURRENTLY IN HOSPICE?
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-800">
                            <input type="radio" name="isInHospice" value="yes" checked={formData.isInHospice === 'yes'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600 mr-1 accent-gray-600" /> Yes
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-800">
                            <input type="radio" name="isInHospice" value="no" checked={formData.isInHospice === 'no'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600 mr-1 accent-gray-600" /> No
                        </label>
                    </div>

                    {/* Part A Stay Status */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-gray-700 uppercase">
                            IS THE PATIENT IN A FACILITY UNDER PART A STAY?
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-800">
                            <input type="radio" name="isInPartAStay" value="yes" checked={formData.isInPartAStay === 'yes'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600 mr-1 accent-gray-600" /> Yes
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-800">
                            <input type="radio" name="isInPartAStay" value="no" checked={formData.isInPartAStay === 'no'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600 mr-1 accent-gray-600" /> No
                        </label>
                        <span className="text-xs text-red-600 font-semibold ml-4">(IF YES, PART B SERVICES CANNOT BE BILLED)</span>
                    </div>

                    {/* Post-Op Status */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-bold text-gray-700 uppercase">
                            IS THE PATIENT CURRENTLY UNDER A POST-OP GLOBAL SURGICAL PERIOD?
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-800">
                            <input type="radio" name="isUnderPostOp" value="yes" checked={formData.isUnderPostOp === 'yes'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600 mr-1 accent-gray-600" /> Yes
                        </label>
                        <label className="flex items-center text-sm font-medium text-gray-800">
                            <input type="radio" name="isUnderPostOp" value="no" checked={formData.isUnderPostOp === 'no'} onChange={handleChange} className="form-radio h-4 w-4 text-blue-600 mr-1 accent-gray-600" /> No
                        </label>
                    </div>

                    {/* Post-Op Details (Conditional) */}
                    <div className="flex gap-4 pt-2 border-t border-dashed border-gray-300">
                        <label className="text-sm font-bold text-gray-700 uppercase w-1/3">
                            IF YES, PLEASE LIST CPT CODE(S) OF PREVIOUS SURGERY:
                        </label>
                        <input
                            type="text"
                            name="postOpCpt"
                            value={formData.postOpCpt}
                            onChange={handleChange}
                            disabled={formData.isUnderPostOp !== 'yes'}
                            className={`flex-1 border-b border-gray-600 h-6 px-1 text-sm outline-none transition-colors ${formData.isUnderPostOp !== 'yes' ? 'bg-gray-100 border-dashed' : 'focus:border-blue-500'}`}
                        />
                        <label className="text-sm font-bold text-gray-700 uppercase">
                            SURGERY DATE:
                        </label>
                        <input
                            type="date"
                            name="surgeryDate"
                            value={formData.surgeryDate}
                            onChange={handleChange}
                            disabled={formData.isUnderPostOp !== 'yes'}
                            className={`w-1/4 border-b border-gray-600 h-6 px-1 text-sm outline-none transition-colors ${formData.isUnderPostOp !== 'yes' ? 'bg-gray-100 border-dashed' : 'focus:border-blue-500'}`}
                        />
                    </div>
                </div>
            </div>

            {/* 6. Wound Location, Codes, and Signature */}
            <div className="p-4 border border-gray-300 space-y-4">
                <InputLine label="LOCATION OF WOUND" name="locationOfWound" value={formData.locationOfWound} onChange={handleChange} />

                {/* Wound Billing Checkboxes (Radio Group) */}
                <h4 className="text-sm font-bold text-gray-700 mb-2 mt-4 uppercase">WOUND BILLING CODES:</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 p-2 border border-dashed border-gray-300">
                    {[
                        { label: 'LEGS/ARMS/TRUNK ≤ 100 SQ CM', code: '15271/15272' },
                        { label: 'LEGS/ARMSTRUNK ≥ 100 SQ CM', code: '15273/15274' },
                        { label: 'FEET/HANDS/HEAD ≤ 100 SQ CM', code: '15275/15276' },
                        { label: 'FEET/HANDS/HEAD ≥ 100 SQ CM', code: '15277/15278' },
                    ].map(({ label, code }) => (
                        <label key={code} className="flex items-center text-sm font-medium text-gray-800 cursor-pointer">
                            <input 
                                type="radio" 
                                name="woundBillingCode" 
                                value={code} 
                                checked={formData.woundBillingCode === code}
                                onChange={handleChange}
                                className="form-radio h-4 w-4 text-blue-600 border-gray-400 mr-2 accent-gray-600"
                            />
                            {label} <span className="ml-2 font-mono text-xs text-gray-600">({code})</span>
                        </label>
                    ))}
                </div>

                {/* Large Text Areas */}
                <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 uppercase mb-1">ICD-10 CODES:</label>
                    <textarea
                        name="icd10Codes"
                        value={formData.icd10Codes}
                        onChange={handleChange}
                        rows="3"
                        className="border border-gray-600 p-2 text-sm focus:border-blue-500 outline-none resize-y"
                    ></textarea>
                </div>
                
                <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 uppercase mb-1">TOTAL WOUND SIZE AND / OR MEDICAL HISTORY:</label>
                    <textarea
                        name="totalWoundSize"
                        value={formData.totalWoundSize}
                        onChange={handleChange}
                        rows="3"
                        className="border border-gray-600 p-2 text-sm focus:border-blue-500 outline-none resize-y"
                    ></textarea>
                </div>

                {/* Signature */}
                <div className="flex flex-col pt-4 border-t border-gray-300">
                    <label className="text-sm font-bold text-gray-700 uppercase mb-1">PHYSICIAN SIGNATURE:</label>
                    <input
                        type="text"
                        name="physicianSignatureName"
                        value={formData.physicianSignatureName}
                        onChange={handleChange}
                        className="border-b-2 border-gray-600 h-8 px-1 text-sm focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

          </div>
          
          {/* Footer Buttons (Hidden in Print) */}
          <div className="mt-8 pt-4 border-t-2 border-gray-300 flex justify-end gap-4 print:hidden">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>Submitting IVR...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Submit IVR Form
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
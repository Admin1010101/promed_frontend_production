import React from 'react';
import logo from "../../../assets/images/logo.png";

// --- Configuration Data (Must match IvrFormModal.js) ---

const PRODUCT_CHECKBOXES = [
  'Membrane Wrap Q4205', 'Activate Matrix Q4301', 'Restorgin Q4191', 'Amnio-Maxx Q4239',
  'Emerge Matrix Q4297', 'Helicoll Q4164', 'NeoStim TL Q4265', 'Derm-Maxx Q4238',
  'AmnioAMP-MP Q4250', 'Membrane Wrap Hydro Q4290', 'Xcell Amnio Matrix Q4280', 'ACAp-atch Q4325',
  'DermaBind FM Q4313', 'caregraFT Q4322', 'DermaBind TL Q4225', 'alloPLY Q4323',
  'Revoshield+ Q4289'
];

const POS_OPTIONS = [
    "PHYSICIAN OFFICE (POS 11)",
    "HOSPITAL OUTPATIENT (POS 22)",
    "SURGERY CENTER (POS 24)",
    "HOME (POS 12)",
    "NURSING CARE FACILITY (POS 32 )"
];

const WOUND_BILLING_CODES = [
    { label: 'LEGS/ARMS/TRUNK ≤ 100 SQ CM', code: '15271/15272' },
    { label: 'LEGS/ARMSTRUNK ≥ 100 SQ CM', code: '15273/15274' },
    { label: 'FEET/HANDS/HEAD ≤ 100 SQ CM', code: '15275/15276' },
    { label: 'FEET/HANDS/HEAD ≥ 100 SQ CM', code: '15277/15278' },
];


// --- Helper Components for Print Layout ---

const PrintLine = ({ label, value, className = '' }) => (
    <div className={`flex flex-col mb-4 ${className} min-w-0`}>
      <label className="text-xs font-bold text-gray-700 uppercase mb-0.5">{label}</label>
      <div 
        className="border-b border-gray-600 min-h-[24px] px-1 text-sm break-words"
        style={{ wordBreak: 'break-word' }}
      >
        {value || <span className="text-gray-400 italic">N/A</span>}
      </div>
    </div>
);

const PrintCheckboxGrid = ({ label, items, selectedItems }) => (
    <div className="p-3 border border-gray-300 bg-blue-50/50 mb-4 print:p-2 print:border-dotted">
        <h3 className="text-sm font-bold text-gray-700 mb-2 border-b-2 border-blue-800 pb-1 uppercase">{label}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1">
            {items.map((item) => {
                const isSelected = Array.isArray(selectedItems) ? selectedItems.includes(item) : selectedItems === item;
                return (
                    <div key={item} className="flex items-center text-xs font-medium text-gray-800">
                        <span className={`w-3 h-3 border border-gray-600 mr-2 flex items-center justify-center text-xs ${isSelected ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                            {isSelected ? '✓' : ''}
                        </span>
                        {item}
                    </div>
                );
            })}
        </div>
    </div>
);

// --- Main Print Component ---

export default function IvrFormPrintTemplate({ formData }) {
  if (!formData) return <div className="p-10 text-center">Loading form data...</div>;
  
  const isOtherPos = formData.placeOfService === "OTHER";
  const primaryStatus = formData.primaryInNetwork ? 'In-Network' : 'Out-of-Network';
  const secondaryStatus = formData.secondaryInNetwork ? 'In-Network' : 'Out-of-Network';
  
  // Find the label for the selected wound billing code
  const woundCodeLabel = formData.woundBillingCode
    ? WOUND_BILLING_CODES.find(c => c.code === formData.woundBillingCode)?.label || formData.woundBillingCode
    : 'N/A';

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 print:p-0 print:text-black">
      <div className="space-y-6 text-xs border border-gray-800 p-6 print:border print:shadow-none">
        
        {/* 1. Header Section */}
        <div className="grid grid-cols-3 border-b-4 border-gray-800 pb-3 mb-4 gap-4">
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
                <h1 className="text-xl font-extrabold text-center text-gray-800 tracking-wider flex justify-center items-center">
                    <img src={logo} alt="ProMed Logo" style={{height: 30, width: 30}} className="mr-2"/>
                    ProMed Health Plus
                </h1>
                <h3 className="text-md font-bold text-center text-blue-800 tracking-widest mt-1 border-t border-b border-blue-800 px-2 py-0.5">
                    INSURANCE VERIFICATION REQUEST
                </h3>
            </div>

            {/* Right Column (Sales Rep) */}
            <div className="text-sm text-right pl-4 flex flex-col justify-end">
                <p className="font-semibold text-gray-800">
                    Sales Representative: <span className="underline font-normal">{formData.salesRepresentative || 'N/A'}</span>
                </p>
            </div>
        </div>

        {/* 2. Product Checkboxes */}
        <PrintCheckboxGrid 
            label="PRODUCTS REQUESTED"
            items={PRODUCT_CHECKBOXES}
            selectedItems={formData.selectedProducts}
        />
        
        {/* 3. Treating Physician and Facility Demographics */}
        <div className="p-4 border border-gray-300 print:p-2">
            <h3 className="text-sm font-bold text-gray-700 mb-3 border-b-2 border-gray-500 pb-1 uppercase">
                TREATING PHYSICIAN AND FACILITY DEMOGRAPHIC INFORMATION
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6">
                <PrintLine label="PHYSICIAN NAME" value={formData.physicianName} className="lg:col-span-2" />
                <PrintLine label="PHYSICIAN SPECIALTY" value={formData.physicianSpecialty} />
                
                <PrintLine label="FACILITY NAME" value={formData.facilityName} className="lg:col-span-2" />
                <PrintLine label="MANAGEMENT CO" value={formData.managementCo} />
                
                <PrintLine label="FACILITY ADDRESS" value={formData.facilityAddress} className="lg:col-span-3" />
                <PrintLine label="CITY, STATE, ZIP" value={formData.facilityCityStateZip} className="lg:col-span-3" />
                
                <PrintLine label="CONTACT NAME" value={formData.contactName} />
                <PrintLine label="CONTACT PH/EMAIL" value={formData.contactPhEmail} className="sm:col-span-2" />
                
                <PrintLine label="FACILITY NPI" value={formData.facilityNpi} />
                <PrintLine label="TAX ID" value={formData.taxId} />
                <PrintLine label="PTAN" value={formData.ptan} />
                <PrintLine label="MEDICAID #" value={formData.medicaidNumber} />
                <PrintLine label="PHONE #" value={formData.phone} />
                <PrintLine label="FAX #" value={formData.fax} />
            </div>
        </div>
        
        {/* 4. Place of Service */}
        <div className="p-4 border border-gray-300 print:p-2">
            <h3 className="text-sm font-bold text-gray-700 mb-3 border-b-2 border-gray-500 pb-1 uppercase">
                PLACE OF SERVICE WHERE PATIENT IS BEING SEEN
            </h3>
            <div className="grid grid-cols-3 gap-y-2 gap-x-6">
                {POS_OPTIONS.map(pos => (
                    <div key={pos} className="flex items-center text-xs font-medium text-gray-800">
                        <span className={`w-3 h-3 border border-gray-600 mr-2 flex items-center justify-center text-xs ${formData.placeOfService === pos ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                            {formData.placeOfService === pos ? '●' : ''}
                        </span>
                        {pos}
                    </div>
                ))}
            </div>
            {isOtherPos && (
                <div className='mt-2'>
                    <PrintLine label="OTHER POS SPECIFY" value={formData.otherPosSpecify} />
                </div>
            )}
        </div>

        {/* 5. Insurance and Authorization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 border border-gray-300 print:p-2">
            {/* 5A & 5B: Insurance Columns */}
            {[
                { label: 'PRIMARY INSURANCE', namePrefix: 'primary', status: primaryStatus },
                { label: 'SECONDARY INSURANCE', namePrefix: 'secondary', status: secondaryStatus }
            ].map(({ label, namePrefix, status }) => (
                <div key={namePrefix} className={namePrefix === 'secondary' ? 'lg:border-l lg:pl-8 print:pl-4' : ''}>
                    <h4 className="text-sm font-bold text-gray-700 mb-3 border-b-2 border-gray-500 pb-1 uppercase">{label}</h4>
                    <PrintLine label="INSURANCE NAME" value={formData[`${namePrefix}InsuranceName`]} />
                    <PrintLine label="POLICY NUMBER" value={formData[`${namePrefix}PolicyNumber`]} />
                    <PrintLine label="PAYER PHONE" value={formData[`${namePrefix}PayerPhone`]} />
                    <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-sm font-bold text-gray-700">PROVIDER STATUS: <span className="font-normal underline ml-2">{status}</span></p>
                    </div>
                </div>
            ))}

            {/* 5C. Authorization Questions (Full Width Below) */}
            <div className="lg:col-span-2 mt-4 pt-4 border-t-2 border-gray-400 space-y-3">
                <p className="text-sm font-bold text-gray-700 uppercase">
                    DO WE HAVE YOUR PERMISSION TO INITIATE AND FOLLOW UP ON PRIOR AUTHORIZATION? <span className='font-normal underline ml-2'>{formData.permissionToInitiatePA.toUpperCase()}</span>
                </p>
                <p className="text-sm font-bold text-gray-700 uppercase">
                    IS THE PATIENT CURRENTLY IN HOSPICE? <span className='font-normal underline ml-2'>{formData.isInHospice.toUpperCase()}</span>
                </p>
                <p className="text-sm font-bold text-gray-700 uppercase flex items-center">
                    IS THE PATIENT IN A FACILITY UNDER PART A STAY? <span className='font-normal underline ml-2'>{formData.isInPartAStay.toUpperCase()}</span>
                    {formData.isInPartAStay === 'yes' && <span className="text-xs text-red-600 font-semibold ml-4">(IF YES, PART B SERVICES CANNOT BE BILLED)</span>}
                </p>
                <p className="text-sm font-bold text-gray-700 uppercase">
                    IS THE PATIENT CURRENTLY UNDER A POST-OP GLOBAL SURGICAL PERIOD? <span className='font-normal underline ml-2'>{formData.isUnderPostOp.toUpperCase()}</span>
                </p>
                
                {formData.isUnderPostOp === 'yes' && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-gray-300">
                        <PrintLine label="CPT CODE(S) OF PREVIOUS SURGERY" value={formData.postOpCpt} />
                        <PrintLine label="SURGERY DATE" value={formData.surgeryDate} />
                    </div>
                )}
            </div>
        </div>

        {/* 6. Wound Location, Codes, and Signature */}
        <div className="p-4 border border-gray-300 space-y-4 print:p-2">
            <PrintLine label="LOCATION OF WOUND" value={formData.locationOfWound} />

            <h4 className="text-sm font-bold text-gray-700 mb-2 mt-4 uppercase border-b border-gray-300 pb-1">WOUND BILLING CODES:</h4>
            <p className='text-sm font-normal text-gray-800 pl-2'>
                <span className='font-bold'>{woundCodeLabel}</span>
                <span className="ml-2 font-mono text-xs text-gray-600">({formData.woundBillingCode})</span>
            </p>

            <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 uppercase mb-1">ICD-10 CODES:</label>
                <div className='border border-gray-400 p-2 min-h-[70px] text-sm whitespace-pre-wrap'>
                    {formData.icd10Codes || <span className="text-gray-400 italic">N/A</span>}
                </div>
            </div>
            
            <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 uppercase mb-1">TOTAL WOUND SIZE AND / OR MEDICAL HISTORY:</label>
                <div className='border border-gray-400 p-2 min-h-[70px] text-sm whitespace-pre-wrap'>
                    {formData.totalWoundSize || <span className="text-gray-400 italic">N/A</span>}
                </div>
            </div>

            {/* Signature */}
            <div className="flex flex-col pt-4 border-t border-gray-300">
                <label className="text-sm font-bold text-gray-700 uppercase mb-1">PHYSICIAN SIGNATURE:</label>
                <div className="border-b-2 border-gray-800 h-10 px-1 text-base font-semibold">
                    <span className="italic text-gray-600 text-lg">{formData.physicianSignatureName || 'Signature area...'}</span>
                </div>
                <p className='text-xs text-gray-500 mt-1'>Printed name serves as electronic signature.</p>
            </div>
        </div>

      </div>
    </div>
  );
}
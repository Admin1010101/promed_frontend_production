import React, { useState } from 'react';

export default function OnBoardingForm() {
  const [formData, setFormData] = useState({
    distributor: '',
    salesRepName: '',
    isoIfApplicable: '',
    salesRepCell: '',
    providerName: '',
    taxIdNumber: '',
    practiceName: '',
    shipTo: '',
    shipCity: '',
    shipState: '',
    shipZip: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    practicePhone: '',
    practiceFax: '',
    practiceEmail: '',
    individualNpi: '',
    groupNpi: '',
    ptan: '',
    billTo: '',
    billCity: '',
    billState: '',
    billZip: '',
    apContactName: '',
    apPhone: '',
    apEmail: '',
    billingContactName: '',
    billingContactEmail: '',
    billingContactPhone: '',
    billerType: 'internal'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-[8.5in] mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Header Section with gradient */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 p-8">
          <div className="flex items-start">
            {/* Logo with glow effect */}
            <div className="w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center mr-6 flex-shrink-0 border-4 border-blue-200">
              <span className="text-xs font-bold text-blue-900">LOGO</span>
            </div>
            
            {/* Title */}
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold mb-2 text-white tracking-wide drop-shadow-lg">ProMed Health Plus</h1>
              <h2 className="text-xl font-semibold text-blue-100 tracking-wider">NEW ACCOUNT FORM</h2>
            </div>
            
            {/* Right side fields with modern styling */}
            <div className="w-1/2 space-y-3 text-xs">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <label className="font-semibold text-blue-100 block mb-1">Distributor:</label>
                <input
                  type="text"
                  name="distributor"
                  value={formData.distributor}
                  onChange={handleChange}
                  className="w-full bg-white/90 border-b-2 border-blue-300 px-2 py-1 outline-none rounded-sm focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <label className="font-semibold text-blue-100 block mb-1">Sales Rep Name:</label>
                <input
                  type="text"
                  name="salesRepName"
                  value={formData.salesRepName}
                  onChange={handleChange}
                  className="w-full bg-white/90 border-b-2 border-blue-300 px-2 py-1 outline-none rounded-sm focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <label className="font-semibold text-blue-100 block mb-1">ISO If Applicable:</label>
                <input
                  type="text"
                  name="isoIfApplicable"
                  value={formData.isoIfApplicable}
                  onChange={handleChange}
                  className="w-full bg-white/90 border-b-2 border-blue-300 px-2 py-1 outline-none rounded-sm focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <label className="font-semibold text-blue-100 block mb-1">Sales Rep Cell:</label>
                <input
                  type="text"
                  name="salesRepCell"
                  value={formData.salesRepCell}
                  onChange={handleChange}
                  className="w-full bg-white/90 border-b-2 border-blue-300 px-2 py-1 outline-none rounded-sm focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields Section */}
        <div className="p-8 space-y-4 text-xs">
          {/* Provider Name and Tax ID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="font-semibold text-slate-700 block mb-2">Provider Name:</label>
              <input
                type="text"
                name="providerName"
                value={formData.providerName}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-transparent focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="font-semibold text-slate-700 block mb-2">Tax ID Number:</label>
              <input
                type="text"
                name="taxIdNumber"
                value={formData.taxIdNumber}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-transparent focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Practice Name */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <label className="font-semibold text-slate-700 block mb-2">Practice Name:</label>
            <input
              type="text"
              name="practiceName"
              value={formData.practiceName}
              onChange={handleChange}
              className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-transparent focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Shipping Address Section */}
          <div className="bg-gradient-to-br from-blue-900/5 to-slate-100 rounded-lg p-5 border-l-4 border-blue-600 shadow-md">
            <h3 className="font-bold text-blue-900 mb-3 text-sm flex items-center">
              <span className="bg-blue-600 text-white px-2 py-1 rounded mr-2">📍</span>
              Shipping Address
            </h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Ship To:</label>
                <input
                  type="text"
                  name="shipTo"
                  value={formData.shipTo}
                  onChange={handleChange}
                  className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-blue-500 transition-colors rounded-sm"
                />
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <label className="font-semibold text-slate-700 block mb-2">City:</label>
                  <input
                    type="text"
                    name="shipCity"
                    value={formData.shipCity}
                    onChange={handleChange}
                    className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-blue-500 transition-colors rounded-sm"
                  />
                </div>
                <div className="col-span-3">
                  <label className="font-semibold text-slate-700 block mb-2">State:</label>
                  <input
                    type="text"
                    name="shipState"
                    value={formData.shipState}
                    onChange={handleChange}
                    className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-blue-500 transition-colors rounded-sm"
                  />
                </div>
                <div className="col-span-3">
                  <label className="font-semibold text-slate-700 block mb-2">ZIP:</label>
                  <input
                    type="text"
                    name="shipZip"
                    value={formData.shipZip}
                    onChange={handleChange}
                    className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-blue-500 transition-colors rounded-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gradient-to-br from-slate-100 to-blue-900/5 rounded-lg p-5 border-l-4 border-slate-600 shadow-md">
            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center">
              <span className="bg-slate-600 text-white px-2 py-1 rounded mr-2">📞</span>
              Contact Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Contact Name:</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-blue-500 transition-colors rounded-sm"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Contact Phone:</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-blue-500 transition-colors rounded-sm"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Contact Email:</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-blue-500 transition-colors rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* Practice Information */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="font-semibold text-slate-700 block mb-2">Practice Phone:</label>
              <input
                type="text"
                name="practicePhone"
                value={formData.practicePhone}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="font-semibold text-slate-700 block mb-2">Practice Fax:</label>
              <input
                type="text"
                name="practiceFax"
                value={formData.practiceFax}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="font-semibold text-slate-700 block mb-2">Practice Email:</label>
              <input
                type="email"
                name="practiceEmail"
                value={formData.practiceEmail}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Billing NPI Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-5 border-l-4 border-emerald-600 shadow-md">
            <h3 className="font-bold text-emerald-900 mb-3 text-sm flex items-center">
              <span className="bg-emerald-600 text-white px-2 py-1 rounded mr-2">🏥</span>
              Billing NPI
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Individual NPI:</label>
                <input
                  type="text"
                  name="individualNpi"
                  value={formData.individualNpi}
                  onChange={handleChange}
                  className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-emerald-500 transition-colors rounded-sm"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Group NPI:</label>
                <input
                  type="text"
                  name="groupNpi"
                  value={formData.groupNpi}
                  onChange={handleChange}
                  className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-emerald-500 transition-colors rounded-sm"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-2">PTAN:</label>
              <input
                type="text"
                name="ptan"
                value={formData.ptan}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-emerald-500 transition-colors rounded-sm"
              />
            </div>
          </div>

          {/* Billing Address Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border-l-4 border-amber-600 shadow-md">
            <h3 className="font-bold text-amber-900 mb-3 text-sm flex items-center">
              <span className="bg-amber-600 text-white px-2 py-1 rounded mr-2">💳</span>
              Billing Address
            </h3>
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Bill To:</label>
                <input
                  type="text"
                  name="billTo"
                  value={formData.billTo}
                  onChange={handleChange}
                  className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-amber-500 transition-colors rounded-sm"
                />
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <label className="font-semibold text-slate-700 block mb-2">City:</label>
                  <input
                    type="text"
                    name="billCity"
                    value={formData.billCity}
                    onChange={handleChange}
                    className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-amber-500 transition-colors rounded-sm"
                  />
                </div>
                <div className="col-span-3">
                  <label className="font-semibold text-slate-700 block mb-2">State:</label>
                  <input
                    type="text"
                    name="billState"
                    value={formData.billState}
                    onChange={handleChange}
                    className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-amber-500 transition-colors rounded-sm"
                  />
                </div>
                <div className="col-span-3">
                  <label className="font-semibold text-slate-700 block mb-2">ZIP:</label>
                  <input
                    type="text"
                    name="billZip"
                    value={formData.billZip}
                    onChange={handleChange}
                    className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none bg-white/50 focus:border-amber-500 transition-colors rounded-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Accounts Payable */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="font-semibold text-slate-700 block mb-2">Accounts Payable Contact Name:</label>
              <input
                type="text"
                name="apContactName"
                value={formData.apContactName}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="font-semibold text-slate-700 block mb-2">Accounts Payable Phone:</label>
              <input
                type="text"
                name="apPhone"
                value={formData.apPhone}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <label className="font-semibold text-slate-700 block mb-2">Accounts Payable Email:</label>
              <input
                type="email"
                name="apEmail"
                value={formData.apEmail}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Billing Party Contact Information Box */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-purple-900 mb-4 text-base flex items-center">
              <span className="bg-purple-600 text-white px-3 py-1 rounded mr-2">📋</span>
              Billing Party Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Contact Name:</label>
                <input
                  type="text"
                  name="billingContactName"
                  value={formData.billingContactName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-purple-300 px-2 py-1 outline-none bg-white focus:border-purple-500 transition-colors rounded-sm"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-2">Email:</label>
                <input
                  type="email"
                  name="billingContactEmail"
                  value={formData.billingContactEmail}
                  onChange={handleChange}
                  className="w-full border-b-2 border-purple-300 px-2 py-1 outline-none bg-white focus:border-purple-500 transition-colors rounded-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-6 mb-4 bg-white/60 p-4 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.billerType === 'internal'}
                  onChange={() => setFormData(prev => ({ ...prev, billerType: 'internal' }))}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
                <span className="font-semibold text-slate-700 group-hover:text-purple-700 transition-colors">Internal Biller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.billerType === 'thirdParty'}
                  onChange={() => setFormData(prev => ({ ...prev, billerType: 'thirdParty' }))}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
                <span className="font-semibold text-slate-700 group-hover:text-purple-700 transition-colors">3rd Party Biller</span>
              </label>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-2">Phone:</label>
              <input
                type="text"
                name="billingContactPhone"
                value={formData.billingContactPhone}
                onChange={handleChange}
                className="w-full border-b-2 border-purple-300 px-2 py-1 outline-none bg-white focus:border-purple-500 transition-colors rounded-sm"
              />
            </div>
          </div>

          {/* Signature Block */}
          <div className="bg-gradient-to-br from-slate-100 to-blue-100 border-3 border-slate-400 rounded-lg p-8 shadow-xl">
            <h3 className="font-bold text-slate-900 mb-4 text-base">✍️ Authorization</h3>
            <div className="mb-6 bg-white rounded-lg p-4 border-2 border-dashed border-slate-300">
              <label className="font-bold block mb-2 text-slate-700">Signature:</label>
              <div className="border-b-2 border-slate-400 h-20 hover:border-blue-500 transition-colors"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <label className="font-semibold block mb-2 text-slate-700">Print Name:</label>
                <input
                  type="text"
                  className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <label className="font-semibold block mb-2 text-slate-700">Date:</label>
                <input
                  type="date"
                  className="w-full border-b-2 border-slate-300 px-2 py-1 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 py-4 px-8 text-center text-xs text-blue-100">
          <p className="font-medium">ProMed Health Plus | 1100 Ludlow Street Philadelphia, PA 19107 | 267-235-1092 | www.promedhealthplus.com</p>
        </div>
      </div>
    </div>
  );
}

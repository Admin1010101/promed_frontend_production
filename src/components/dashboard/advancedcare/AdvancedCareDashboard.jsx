import React, { useState, useEffect } from 'react';
import { 
  IoCalendarOutline, 
  IoMedkitOutline, 
  IoDocumentTextOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoPersonOutline,
  IoAddCircleOutline,
  IoArrowBack,
  IoCloudUploadOutline,
  IoSearch
} from 'react-icons/io5';
import IvrFormModal from '../patient/IvrFormModal';

// API Configuration
const API_BASE_URL = "https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1";

// API Helper Functionss
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const fetchPatients = async () => {
  const response = await fetch(`${API_BASE_URL}/patients/`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }
  
  return await response.json();
};

const fetchRecentOrders = async (limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/recent/?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  
  return await response.json();
};

const createCareKitOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/carekit/create/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.errors ? JSON.stringify(data.errors) : 'Failed to create order');
  }
  
  return data;
};

const reorderCareKit = async (orderId, overrides = {}) => {
  const response = await fetch(`${API_BASE_URL}/${orderId}/reorder/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(overrides),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.errors ? JSON.stringify(data.errors) : 'Failed to reorder');
  }
  
  return data;
};

const AdvancedCareDashboard = () => {
  // View State
  const [currentView, setCurrentView] = useState('dashboard');
  const [orderStep, setOrderStep] = useState(1);
  
  // Data State
  const [patients, setPatients] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [openIvrModal, setOpenIvrModal] = useState(false);
  const [ivrSubmitted, setIvrSubmitted] = useState(false);

  // Form States
  const [patientSearch, setPatientSearch] = useState('');
  const [newPatientData, setNewPatientData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const [duration, setDuration] = useState('30-day');
  const [woundDetails, setWoundDetails] = useState({
    type: '',
    location: '',
    chronic: false,
    size_length: '',
    size_width: '',
    drainage: '',
    conservative_care: false,
    icd10: ''
  });
  const [recommendedKit, setRecommendedKit] = useState('2x2');

  // Static Data
  const woundTypes = [
    { value: "slow_healing", label: "Slow-healing incision" },
    { value: "dehisced", label: "Dehisced wound" },
    { value: "dfu", label: "DFU" },
    { value: "vlu", label: "VLU" }
  ];

  const icd10Codes = [
    { code: "L97.512", description: "Non-pressure chronic ulcer of other part of right foot with fat layer exposed" },
    { code: "L97.513", description: "Non-pressure chronic ulcer of other part of right foot with necrosis of muscle" },
    { code: "L97.514", description: "Non-pressure chronic ulcer of other part of right foot with necrosis of bone" }
  ];

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [patientsData, ordersData] = await Promise.all([
        fetchPatients(),
        fetchRecentOrders(10)
      ]);
      
      setPatients(patientsData);
      setRecentActivity(ordersData.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get IVR initial data for selected patient
  const getIvrInitialData = (patient) => {
    if (!patient) return {};
    
    return {
      patientId: patient.id,
      physicianName: `${patient.first_name} ${patient.last_name}`,
      contactName: `${patient.first_name} ${patient.last_name}`,
      phone: patient.phone_number || '',
      facilityName: '',
      facilityAddress: patient.address || '',
      facilityCityStateZip: `${patient.city || ''}, ${patient.state || ''} ${patient.zip_code || ''}`.trim(),
      primaryInsuranceName: patient.primary_insurance || '',
      primaryPolicyNumber: patient.primary_insurance_number || '',
      secondaryInsuranceName: patient.secondary_insurance || '',
      secondaryPolicyNumber: patient.secondary_insurance_number || ''
    };
  };

  const getFullIvrInitialData = () => {
  const patient = selectedPatient || newPatientData;
  console.log('Generating IVR initial data for patient:', patient);
  return {
    // 🔹 Patient fields
    patientId: patient.id,
    first_name: patient.first_name,
    last_name: patient.last_name,

    // 🔹 Wound data from Step 2
    woundDetails: {
      type: woundDetails.type,
      location: woundDetails.location,
      icd10: woundDetails.icd10,
      drainage: woundDetails.drainage,
      conservative_care: woundDetails.conservative_care,
      chronic: woundDetails.chronic,
      
    },

    // 🔹 Kit size + Duration from Step 3
    recommendedKit,
    duration,
  };
};


  // Handler for IVR form completion
  const handleIvrFormComplete = (result) => {
    setOpenIvrModal(false);
    console.log('IVR Form submitted:', result);
    setIvrSubmitted(true);
    handleSubmitOrder()// Refresh data
  };

  
  const handleSubmitOrder = async () => {
  // Validation
  if (!selectedPatient && !newPatientData.first_name) {
    alert('Please select a patient or enter new patient details');
    return;
  }

  if (!woundDetails.type) {
    alert('Please select a wound type');
    return;
  }

  try {
    setLoading(true);
    
    let patientId;
    let patientData;
    
    // ✅ STEP 1: Create patient if new patient data provided
    if (!selectedPatient && newPatientData.first_name) {
      console.log('Creating new patient:', newPatientData);
      
      // Use your existing patient creation endpoint
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: newPatientData.first_name,
          last_name: newPatientData.last_name,
          date_of_birth: newPatientData.date_of_birth || null,
          phone_number: newPatientData.phone_number || '',
          address: newPatientData.address || '',
          city: newPatientData.city || '',
          state: newPatientData.state || '',
          zip_code: newPatientData.zip_code || ''
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }
      
      const result = await response.json();
      patientId = result.id;
      patientData = result;
      
      console.log('New patient created with ID:', patientId);
    } else {
      patientId = selectedPatient.id;
      patientData = selectedPatient;
    }
    
    // ✅ STEP 2: Create order for patient
    const orderData = {
      patient: patientId,
      wound_type: woundDetails.type,
      wound_location: woundDetails.location || '',
      is_chronic_wound: woundDetails.chronic,
      wound_drainage: woundDetails.drainage?.toLowerCase() || 'none',
      conservative_care: woundDetails.conservative_care,
      icd10_code: woundDetails.icd10 || '',
      kit_duration: duration,
      kit_size: recommendedKit,
      
      // Use patient data (either selected or newly created)
      facility_name: patientData.facility_name || 'Main Clinic',
      phone_number: patientData.phone_number || newPatientData.phone_number || '0000000000',
      street: patientData.address || newPatientData.address || 'N/A',
      city: patientData.city || newPatientData.city || 'N/A',
      zip_code: patientData.zip_code || newPatientData.zip_code || '00000',
      country: 'US'
    };

    console.log('Creating order with data:', orderData);
    
    const result = await createCareKitOrder(orderData);
    
    console.log('Order created successfully:', result);
    
    // Refresh dashboard data to include new patient
    await loadDashboardData();
    
    // Show success view
    setCurrentView('orderSuccess');
    
    // Reset form
    setOrderStep(1);
    setSelectedPatient(null);
    setPatientSearch('');
    setNewPatientData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      phone_number: '',
      address: '',
      city: '',
      state: '',
      zip_code: ''
    });
    setWoundDetails({
      type: '',
      location: '',
      chronic: false,
      size_length: '',
      size_width: '',
      drainage: '',
      conservative_care: false,
      icd10: ''
    });
    
  } catch (err) {
    console.error('Error creating order:', err);
    alert(`Failed to create order: ${err.message}`);
  } finally {
    setLoading(false);
  }
};


const handleStep1Next = async () => {
  // If existing patient, continue to step 2
  if (selectedPatient) {
    setOrderStep(2);
    return;
  }

  // If new patient, create in backend first
  if (newPatientData.first_name) {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/patients/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatientData)
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Failed to create patient");
        return;
      }
      console.log('New patient created with ID:', data);
      // Save created patient
      setSelectedPatient(data);

      // Continue to wound step
      setOrderStep(2);
    } catch (err) {
      console.error(err);
      alert("Server error when creating patient");
    }
  }
};


  // Reorder Handler
  const handleReorder = async (orderId) => {
    try {
      setLoading(true);
      
      const result = await reorderCareKit(orderId);
      
      console.log('Reorder created successfully:', result);
      
      // Refresh dashboard data
      await loadDashboardData();
      
      // Show success message
      setCurrentView('reorderSuccess');
      
    } catch (err) {
      console.error('Error creating reorder:', err);
      alert(`Failed to create reorder: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Dashboard View
  const renderDashboard = () => {
    if (loading && patients.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 sm:px-6 lg:px-12">
        {/* Header with Actions */}
        <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setCurrentView('newOrder');
                setIvrSubmitted(false);
                setOrderStep(1);
              }}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <IoAddCircleOutline className="text-xl" />
              New CareKit Order
            </button>
            {/* <button 
              onClick={() => setOpenIvrModal(true)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <IoDocumentTextOutline className="text-xl" />
              Submit IVR
            </button> */}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setCurrentView('patientsList')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white 
                        rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Patients
            </button>
            <button className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
              Help & Training
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Wound</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No recent orders found. Create your first CareKit order to get started!
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {order.patient_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {order.wound_type_display || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                          order.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                          order.status === 'shipped' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
                          order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {order.status_display}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleReorder(order.id)}
                          disabled={loading}
                          className="text-teal-600 dark:text-teal-400 hover:underline font-semibold disabled:opacity-50"
                        >
                          Reorder
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // New Order - Step 1: Patient & Duration
  const renderNewOrderStep1 = () => (
    <div className="px-4 sm:px-6 lg:px-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:underline mb-6"
          >
            <IoArrowBack /> Back to Dashboard
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Step 1 of 3 - Patient
          </h2>

          {/* Existing Patient Search */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Existing patient
            </label>
            <div className="relative">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient by name..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            {patientSearch && (
              <div className="mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {patients
                  .filter(p => {
                    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
                    return fullName.includes(patientSearch.toLowerCase());
                  })
                  .map(patient => (
                    <div 
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(patient);
                        setPatientSearch(`${patient.first_name} ${patient.last_name}`);
                      }}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0"
                    >
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {patient.first_name} {patient.last_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        DOB: {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  ))}
                {patients.filter(p => {
                  const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
                  return fullName.includes(patientSearch.toLowerCase());
                }).length === 0 && (
                  <div className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                    No patients found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-center text-gray-500 dark:text-gray-400 my-6">OR</div>

          {/* New Patient */}
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              New patient
            </label>
             <input
    type="text"
    placeholder="Full Name (e.g., John Doe)"
    defaultValue=""
    onBlur={(e) => {
      // Split name only when user leaves the field
      const fullName = e.target.value.trim();
      const parts = fullName.split(' ');
      const firstName = parts[0] || '';
      const lastName = parts.slice(1).join(' ') || '';
      
      setNewPatientData({
        ...newPatientData, 
        first_name: firstName,
        last_name: lastName
      });
    }}
    onChange={(e) => {
      // Clear selected patient if typing
      if (e.target.value) {
        setSelectedPatient(null);
        setPatientSearch('');
      }
    }}
    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
  />
            <input
              type="date"
              placeholder="Date of Birth"
              value={newPatientData.date_of_birth}
              onChange={(e) => setNewPatientData({...newPatientData, date_of_birth: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* CareKit Duration */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              CareKit Duration
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="duration" 
                  value="30-day"
                  checked={duration === '30-day'}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-gray-900 dark:text-white">30-day</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="duration" 
                  value="15-day"
                  checked={duration === '15-day'}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-gray-900 dark:text-white">15-day</span>
              </label>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Back
            </button>
            <button 
              onClick={handleStep1Next}
              disabled={!selectedPatient && !newPatientData.first_name}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Wound
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // New Order - Step 2: Wound Details
  const renderNewOrderStep2 = () => (
    <div className="px-4 sm:px-6 lg:px-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <button 
            onClick={() => setOrderStep(1)}
            className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:underline mb-6"
          >
            <IoArrowBack /> Back
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Step 2 of 3 - Wound Details
          </h2>

          {/* Wound Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Wound Type
            </label>
            <div className="space-y-2">
              {woundTypes.map(type => (
                <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="woundType" 
                    value={type.value}
                    checked={woundDetails.type === type.value}
                    onChange={(e) => setWoundDetails({...woundDetails, type: e.target.value})}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-gray-900 dark:text-white">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Wound Location */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Wound Location
            </label>
            <input
              type="text"
              placeholder="e.g., Right foot, Left leg"
              value={woundDetails.location}
              onChange={(e) => setWoundDetails({...woundDetails, location: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Other Chronic */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={woundDetails.chronic}
                onChange={(e) => setWoundDetails({...woundDetails, chronic: e.target.checked})}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <span className="text-gray-900 dark:text-white">Chronic wound</span>
            </label>
          </div>

          {/* Drainage */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Drainage
            </label>
            <div className="flex gap-4">
              {['None', 'Light', 'Moderate', 'Heavy'].map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="drainage" 
                    value={level}
                    checked={woundDetails.drainage === level}
                    onChange={(e) => setWoundDetails({...woundDetails, drainage: e.target.value})}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-gray-900 dark:text-white text-sm">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Conservative Care */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Conservative Care
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="conservative" 
                  checked={woundDetails.conservative_care === true}
                  onChange={() => setWoundDetails({...woundDetails, conservative_care: true})}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-gray-900 dark:text-white">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="conservative" 
                  checked={woundDetails.conservative_care === false}
                  onChange={() => setWoundDetails({...woundDetails, conservative_care: false})}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-gray-900 dark:text-white">No</span>
              </label>
            </div>
          </div>

          {/* ICD-10 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              ICD-10 Code
            </label>
            <select
              value={woundDetails.icd10}
              onChange={(e) => setWoundDetails({...woundDetails, icd10: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">Select ICD-10 code</option>
              {icd10Codes.map(code => (
                <option key={code.code} value={code.code}>
                  {code.code} - {code.description}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button 
              onClick={() => setOrderStep(1)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Back
            </button>
            <button 
              onClick={() => setOrderStep(3)}
              disabled={!woundDetails.type}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Kit Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // New Order - Step 3: Recommended CareKit
  const renderNewOrderStep3 = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <button 
            onClick={() => setOrderStep(2)}
            className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:underline mb-6"
          >
            <IoArrowBack /> Back
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Step 3 of 3 - Select CareKit Size
          </h2>

          {/* Order Summary */}
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4 mb-6">
            <p className="text-gray-900 dark:text-white">
             <strong>Patient:</strong> {selectedPatient 
  ? `${selectedPatient.first_name} ${selectedPatient.last_name}` 
  : `${newPatientData.first_name} ${newPatientData.last_name}`.trim()}
            </p>
            <p className="text-gray-900 dark:text-white">
              <strong>Wound:</strong> {woundTypes.find(t => t.value === woundDetails.type)?.label || 'N/A'}
              {woundDetails.icd10 && ` | ICD-10: ${woundDetails.icd10}`}
            </p>
            <p className="text-gray-900 dark:text-white">
              <strong>Duration:</strong> {duration}
            </p>
          </div>

          {/* Kit Size Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Kit Size
            </h3>
            
            <div className="space-y-2">
              {['2x2', '1x1', '7x7', '10x10', 'powder'].map(size => (
                <label key={size} className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="radio" 
                    name="kitSize" 
                    value={size}
                    checked={recommendedKit === size}
                    onChange={(e) => setRecommendedKit(e.target.value)}
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-gray-900 dark:text-white">
                    {size === '2x2' ? '2×2 pad (recommended)' : 
                     size === '1x1' ? '1×1 pad' :
                     size === '7x7' ? '7×7 pad' :
                     size === '10x10' ? '10×10 pad' :
                     'Powder option'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button 
              onClick={() => setOrderStep(2)}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Back
            </button>
            <button 
              onClick={() => {
                if (!ivrSubmitted) {
                  setOpenIvrModal(true);
                } else {
                  handleSubmitOrder();
                }
              }}
              disabled={loading}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                'Submit Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )};

  const renderIVRRequiredStep = () => (
  <div className="px-4 sm:px-6 lg:px-12">
    <div className="max-w-2xl mx-auto text-center py-16">
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        IVR Submission Required
      </h2>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Before submitting this CareKit order, you must complete an IVR form for the selected patient.
      </p>

      <button
        onClick={() => setOpenIvrModal(true)}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 
                   text-white rounded-lg font-semibold transition"
      >
        Submit IVR Form
      </button>

      <div className="mt-6">
        <button
          onClick={() => setCurrentView('newOrder')}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:underline"
        >
          ← Back to Kit Selection
        </button>
      </div>
    </div>
  </div>
);


  // Success Messages
  const renderSuccess = (type) => (
    <div className="px-4 sm:px-6 lg:px-12 flex items-center justify-center min-h-[60vh]">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <IoCheckmarkCircle className="text-5xl text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {type === 'order' && 'CareKit order submitted successfully!'}
          {type === 'reorder' && 'Reorder submitted successfully!'}
        </h2>
        <div className="flex gap-4 justify-center mt-8">
          {type === 'order' && (
            <>
              {/* <button 
                onClick={() => {
                  setOpenIvrModal(true);
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
              >
                Submit IVR
              </button> */}
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Dashboard
              </button>
            </>
          )}
          {type === 'reorder' && (
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );


  // Patients List View
const renderPatientsList = () => (
  <div className="px-4 sm:px-6 lg:px-12">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        
        {/* Back Button */}
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:underline mb-6"
        >
          <IoArrowBack /> Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          My Patients
        </h2>

        {/* Search Bar */}
        <div className="relative mb-4">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients..."
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 
                       border border-gray-300 dark:border-gray-700 rounded-lg 
                       text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Patient List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {patients
            .filter(p => {
              const full = `${p.first_name} ${p.last_name}`.toLowerCase();
              return full.includes(patientSearch.toLowerCase());
            })
            .map(patient => (
              <div 
                key={patient.id}
                className="p-4 cursor-pointer border border-gray-200 dark:border-gray-700 
                           bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 
                           dark:hover:bg-gray-700 transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {patient.first_name} {patient.last_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  DOB: {patient.date_of_birth || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phone: {patient.phone_number || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Latest IVR: {patient.latest_ivr_status_display || 'None'}
                </p>
              </div>
            ))
          }

          {patients.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No patients found.
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);


  // Main Render Logic
  return (
    <>
      <div>
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'patientsList' && renderPatientsList()}
        {currentView === 'newOrder' && orderStep === 1 && renderNewOrderStep1()}
        {currentView === 'newOrder' && orderStep === 2 && renderNewOrderStep2()}
        {currentView === 'newOrder' && orderStep === 3 && renderNewOrderStep3()}
        {currentView === 'ivrRequired' && renderIVRRequiredStep()}
        {currentView === 'orderSuccess' && renderSuccess('order')}
        {currentView === 'reorderSuccess' && renderSuccess('reorder')}
      </div>

      {/* IVR Form Modal */}
      <IvrFormModal
        open={openIvrModal}
        onClose={() => setOpenIvrModal(false)}
        initialData={getFullIvrInitialData()}
        onFormComplete={handleIvrFormComplete}
      />
    </>
  );
};

export default AdvancedCareDashboard;
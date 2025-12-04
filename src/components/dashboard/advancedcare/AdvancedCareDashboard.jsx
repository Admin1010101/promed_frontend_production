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
  IoSearch,
  IoFlashOutline,
  IoRocketOutline,
  IoTrendingUpOutline,
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import IvrFormModal from '../patient/IvrFormModal';

// API Configuration
const API_BASE_URL = "https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1";

// API Helper Functions
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

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
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
    { value: "slow_healing", label: "Slow-healing incision", icon: "🩹" },
    { value: "dehisced", label: "Dehisced wound", icon: "⚠️" },
    { value: "dfu", label: "DFU", icon: "🦶" },
    { value: "vlu", label: "VLU", icon: "🔬" }
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
      patientId: patient.id,
      first_name: patient.first_name,
      last_name: patient.last_name,
      woundDetails: {
        type: woundDetails.type,
        location: woundDetails.location,
        icd10: woundDetails.icd10,
        drainage: woundDetails.drainage,
        conservative_care: woundDetails.conservative_care,
        chronic: woundDetails.chronic,
      },
      recommendedKit,
      duration,
    };
  };

  const handleIvrFormComplete = (result) => {
    setOpenIvrModal(false);
    console.log('IVR Form submitted:', result);
    setIvrSubmitted(true);
    handleSubmitOrder();
  };

  const handleSubmitOrder = async () => {
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
      
      if (!selectedPatient && newPatientData.first_name) {
        console.log('Creating new patient:', newPatientData);
        
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
      
      await loadDashboardData();
      setCurrentView('orderSuccess');
      
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
    if (selectedPatient) {
      setOrderStep(2);
      return;
    }

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
        setSelectedPatient(data);
        setOrderStep(2);
      } catch (err) {
        console.error(err);
        alert("Server error when creating patient");
      }
    }
  };

  const handleReorder = async (orderId) => {
    try {
      setLoading(true);
      const result = await reorderCareKit(orderId);
      console.log('Reorder created successfully:', result);
      await loadDashboardData();
      setCurrentView('reorderSuccess');
    } catch (err) {
      console.error('Error creating reorder:', err);
      alert(`Failed to create reorder: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ULTRA COOL DASHBOARD VIEW
  const renderDashboard = () => {
    if (loading && patients.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mx-auto mb-4"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-teal-300 opacity-20 mx-auto"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-semibold">Loading your dashboard...</p>
          </motion.div>
        </div>
      );
    }

    if (error) {
      return (
        <motion.div 
          className="flex items-center justify-center min-h-[60vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-600 dark:text-red-400 mb-4 font-semibold">Error: {error}</p>
            <motion.button
              onClick={loadDashboardData}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        className="px-4 sm:px-6 lg:px-12 pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Header with Gradient */}
        <motion.div 
          className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 p-8 shadow-2xl"
          variants={itemVariants}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.7s'}}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <IoRocketOutline className="text-5xl text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-black text-white">Conservative Care</h1>
                <p className="text-teal-100 text-lg">Advanced Wound Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
              <motion.button 
                onClick={() => {
                  setCurrentView('newOrder');
                  setIvrSubmitted(false);
                  setOrderStep(1);
                }}
                className="px-8 py-4 bg-white text-teal-600 rounded-2xl font-bold flex items-center gap-3 shadow-xl hover:shadow-2xl transition-all group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoAddCircleOutline className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
                New CareKit Order
              </motion.button>
              
              <motion.button 
                onClick={() => setCurrentView('patientsList')}
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold hover:bg-white/30 transition-all border-2 border-white/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoPersonOutline className="inline mr-2 text-xl" />
                View Patients
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl font-bold hover:bg-white/30 transition-all border-2 border-white/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Help & Training
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg group hover:shadow-2xl transition-all"
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <IoTrendingUpOutline className="text-5xl text-white/80 mb-3 relative z-10" />
            <h3 className="text-3xl font-black text-white relative z-10">{recentActivity.length}</h3>
            <p className="text-blue-100 font-semibold relative z-10">Total Orders</p>
          </motion.div>

          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg group hover:shadow-2xl transition-all"
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <IoPersonOutline className="text-5xl text-white/80 mb-3 relative z-10" />
            <h3 className="text-3xl font-black text-white relative z-10">{patients.length}</h3>
            <p className="text-purple-100 font-semibold relative z-10">Active Patients</p>
          </motion.div>

          <motion.div 
            className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg group hover:shadow-2xl transition-all"
            whileHover={{ y: -5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <IoFlashOutline className="text-5xl text-white/80 mb-3 relative z-10" />
            <h3 className="text-3xl font-black text-white relative z-10">
              {recentActivity.filter(o => o.status === 'delivered').length}
            </h3>
            <p className="text-green-100 font-semibold relative z-10">Completed</p>
          </motion.div>
        </motion.div>

        {/* Recent Activity Table */}
        <motion.div 
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
          variants={itemVariants}
        >
          <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <tr>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Order #</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Wound Type</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-5 text-left text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-7xl">📦</div>
                        <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                          No recent orders found. Create your first CareKit order to get started!
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((order, index) => (
                    <motion.tr 
                      key={order.id} 
                      className="hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-all group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                            {order.patient_name?.charAt(0)}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {order.patient_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {order.wound_type_display || 'N/A'}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg ${
                          order.status === 'pending' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900' :
                          order.status === 'processing' ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-blue-900' :
                          order.status === 'shipped' ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-purple-900' :
                          order.status === 'delivered' ? 'bg-gradient-to-r from-green-400 to-green-500 text-green-900' :
                          'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-900'
                        }`}>
                          {order.status_display}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <motion.button
                          onClick={() => handleReorder(order.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Reorder
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Rest of your render functions remain the same...
  // (I'm keeping them as-is since we're focusing on the main dashboard and adding cool design elements)
  
  // For brevity, I'll include placeholders for the remaining render functions
  // ============================================================================
// RENDER NEW ORDER STEP 1 - ULTRA COOL VERSION
// Replace your existing renderNewOrderStep1() function with this
// ============================================================================

const renderNewOrderStep1 = () => (
  <motion.div 
    className="px-4 sm:px-6 lg:px-12 pb-8"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
  >
    <div className="max-w-3xl mx-auto">
      <motion.div 
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-10 relative overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Back Button */}
          <motion.button 
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:gap-3 transition-all font-bold mb-6 group"
            whileHover={{ x: -5 }}
          >
            <IoArrowBack className="text-xl group-hover:scale-110 transition-transform" /> 
            Back to Dashboard
          </motion.button>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                      orderStep >= step 
                        ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-lg' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: step * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {step}
                  </motion.div>
                  {step < 3 && (
                    <div className={`h-1 w-24 mx-2 rounded transition-all duration-500 ${
                      orderStep > step 
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
              <span className={orderStep === 1 ? 'text-teal-600 dark:text-teal-400' : ''}>Patient</span>
              <span className={orderStep === 2 ? 'text-teal-600 dark:text-teal-400' : ''}>Wound Details</span>
              <span className={orderStep === 3 ? 'text-teal-600 dark:text-teal-400' : ''}>Kit Selection</span>
            </div>
          </div>

          {/* Title */}
          <motion.h2 
            className="text-3xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Step 1 of 3 - Patient Information
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Select an existing patient or create a new one</p>

          {/* Existing Patient Search */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              🔍 Search Existing Patient
            </label>
            <div className="relative">
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Type patient name..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold placeholder:text-gray-400"
              />
            </div>
            
            <AnimatePresence>
              {patientSearch && (
                <motion.div 
                  className="mt-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-2xl max-h-80 overflow-y-auto"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {patients
                    .filter(p => {
                      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
                      return fullName.includes(patientSearch.toLowerCase());
                    })
                    .map(patient => (
                      <motion.div 
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setPatientSearch(`${patient.first_name} ${patient.last_name}`);
                        }}
                        className="px-5 py-4 hover:bg-teal-50 dark:hover:bg-teal-900/20 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-0 transition-all group"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {patient.first_name?.charAt(0)}
                          </motion.div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-bold group-hover:text-teal-600 transition">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              DOB: {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  {patients.filter(p => {
                    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
                    return fullName.includes(patientSearch.toLowerCase());
                  }).length === 0 && (
                    <div className="px-5 py-8 text-center">
                      <div className="text-5xl mb-3">😕</div>
                      <p className="text-gray-500 dark:text-gray-400 font-semibold">No patients found</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* OR Divider */}
          <div className="relative flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            <span className="text-gray-500 dark:text-gray-400 font-black uppercase text-sm">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          </div>

          {/* New Patient Form */}
          <motion.div 
            className="space-y-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              ➕ Create New Patient
            </label>
            
            <input
              type="text"
              placeholder="Full Name (e.g., John Doe)"
              defaultValue=""
              onBlur={(e) => {
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
                if (e.target.value) {
                  setSelectedPatient(null);
                  setPatientSearch('');
                }
              }}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold placeholder:text-gray-400"
            />
            
            <input
              type="date"
              placeholder="Date of Birth"
              value={newPatientData.date_of_birth}
              onChange={(e) => setNewPatientData({...newPatientData, date_of_birth: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-semibold"
            />

            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              * Only name and DOB required. Address details optional.
            </p>
          </motion.div>

          {/* Duration Selection */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              ⏱️ CareKit Duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['30-day', '15-day'].map((dur) => (
                <motion.label 
                  key={dur}
                  className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                    duration === dur
                      ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input 
                    type="radio" 
                    name="duration" 
                    value={dur}
                    checked={duration === dur}
                    onChange={(e) => setDuration(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-gray-900 dark:text-white">{dur}</span>
                    {duration === dur && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center"
                      >
                        <IoCheckmarkCircle className="text-white text-xl" />
                      </motion.div>
                    )}
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div 
            className="flex justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button 
              onClick={() => setCurrentView('dashboard')}
              className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button 
              onClick={handleStep1Next}
              disabled={!selectedPatient && !newPatientData.first_name}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next: Wound Details 
              <IoArrowBack className="rotate-180" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

  // ============================================================================
// RENDER NEW ORDER STEP 2 - ULTRA COOL VERSION
// Replace your existing renderNewOrderStep2() function with this
// ============================================================================

const renderNewOrderStep2 = () => (
  <motion.div 
    className="px-4 sm:px-6 lg:px-12 pb-8"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.3 }}
  >
    <div className="max-w-3xl mx-auto">
      <motion.div 
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-10 relative overflow-hidden"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Back Button */}
          <motion.button 
            onClick={() => setOrderStep(1)}
            className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:gap-3 transition-all font-bold mb-6 group"
            whileHover={{ x: -5 }}
          >
            <IoArrowBack className="text-xl group-hover:scale-110 transition-transform" /> 
            Back
          </motion.button>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                      orderStep >= step 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: step * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {orderStep > step ? <IoCheckmarkCircle className="text-2xl" /> : step}
                  </motion.div>
                  {step < 3 && (
                    <div className={`h-1 w-24 mx-2 rounded transition-all duration-500 ${
                      orderStep > step 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
              <span>Patient</span>
              <span className="text-blue-600 dark:text-blue-400">Wound Details</span>
              <span>Kit Selection</span>
            </div>
          </div>

          {/* Title */}
          <motion.h2 
            className="text-3xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Step 2 of 3 - Wound Details
          </motion.h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Provide detailed wound information</p>

          {/* Wound Type Selection */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              🩹 Wound Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {woundTypes.map((type, index) => (
                <motion.label 
                  key={type.value}
                  className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                    woundDetails.type === type.value
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (index * 0.05) }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input 
                    type="radio" 
                    name="woundType" 
                    value={type.value}
                    checked={woundDetails.type === type.value}
                    onChange={(e) => setWoundDetails({...woundDetails, type: e.target.value})}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{type.icon}</span>
                      <span className="text-lg font-black text-gray-900 dark:text-white">{type.label}</span>
                    </div>
                    {woundDetails.type === type.value && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                      >
                        <IoCheckmarkCircle className="text-white text-xl" />
                      </motion.div>
                    )}
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Wound Location */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              📍 Wound Location
            </label>
            <input
              type="text"
              placeholder="e.g., Right foot, Left leg, Lower back"
              value={woundDetails.location}
              onChange={(e) => setWoundDetails({...woundDetails, location: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold placeholder:text-gray-400"
            />
          </motion.div>

          {/* Chronic Wound Checkbox */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.label 
              className={`flex items-center gap-4 cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                woundDetails.chronic
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input 
                type="checkbox"
                checked={woundDetails.chronic}
                onChange={(e) => setWoundDetails({...woundDetails, chronic: e.target.checked})}
                className="w-6 h-6 text-orange-600 rounded-lg focus:ring-orange-500 focus:ring-offset-0"
              />
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">Chronic Wound</span>
              </div>
            </motion.label>
          </motion.div>

          {/* Drainage Level */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              💧 Drainage Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['None', 'Light', 'Moderate', 'Heavy'].map((level, index) => (
                <motion.label 
                  key={level}
                  className={`cursor-pointer rounded-xl p-4 border-2 text-center transition-all ${
                    woundDetails.drainage === level
                      ? 'border-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300'
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (index * 0.05) }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <input 
                    type="radio" 
                    name="drainage" 
                    value={level}
                    checked={woundDetails.drainage === level}
                    onChange={(e) => setWoundDetails({...woundDetails, drainage: e.target.value})}
                    className="sr-only"
                  />
                  <span className="text-sm font-black text-gray-900 dark:text-white block">{level}</span>
                  {woundDetails.drainage === level && (
                    <motion.div 
                      className="mt-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <IoCheckmarkCircle className="text-cyan-500 mx-auto text-lg" />
                    </motion.div>
                  )}
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Conservative Care */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
              ⚕️ Conservative Care
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: true, label: 'Yes', emoji: '✅' },
                { value: false, label: 'No', emoji: '❌' }
              ].map((option, index) => (
                <motion.label 
                  key={String(option.value)}
                  className={`cursor-pointer rounded-xl p-5 border-2 text-center transition-all ${
                    woundDetails.conservative_care === option.value
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                  }`}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.05) }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input 
                    type="radio" 
                    name="conservative" 
                    checked={woundDetails.conservative_care === option.value}
                    onChange={() => setWoundDetails({...woundDetails, conservative_care: option.value})}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white">{option.label}</span>
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* ICD-10 Code */}
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              📋 ICD-10 Code
            </label>
            <select
              value={woundDetails.icd10}
              onChange={(e) => setWoundDetails({...woundDetails, icd10: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
            >
              <option value="">Select ICD-10 code (optional)</option>
              {icd10Codes.map(code => (
                <option key={code.code} value={code.code}>
                  {code.code} - {code.description}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div 
            className="flex justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button 
              onClick={() => setOrderStep(1)}
              className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoArrowBack />
              Back
            </motion.button>
            <motion.button 
              onClick={() => setOrderStep(3)}
              disabled={!woundDetails.type}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next: Kit Selection
              <IoArrowBack className="rotate-180" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

  // ============================================================================
// RENDER NEW ORDER STEP 3 - ULTRA COOL VERSION
// Replace your existing renderNewOrderStep3() function with this
// ============================================================================

const renderNewOrderStep3 = () => {
  return (
    <motion.div 
      className="px-4 sm:px-6 lg:px-12 pb-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-10 relative overflow-hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-400/10 to-teal-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Back Button */}
            <motion.button 
              onClick={() => setOrderStep(2)}
              className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:gap-3 transition-all font-bold mb-6 group"
              whileHover={{ x: -5 }}
            >
              <IoArrowBack className="text-xl group-hover:scale-110 transition-transform" /> 
              Back
            </motion.button>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${
                        orderStep >= step 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: step * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {orderStep > step ? <IoCheckmarkCircle className="text-2xl" /> : step}
                    </motion.div>
                    {step < 3 && (
                      <div className={`h-1 w-24 mx-2 rounded transition-all duration-500 ${
                        orderStep > step 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
                <span>Patient</span>
                <span>Wound Details</span>
                <span className="text-green-600 dark:text-green-400">Kit Selection</span>
              </div>
            </div>

            {/* Title */}
            <motion.h2 
              className="text-3xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Step 3 of 3 - Select CareKit Size
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Review your selections and choose kit size</p>

            {/* Order Summary */}
            <motion.div 
              className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-6 mb-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Order Summary
                </h3>
                
                <div className="space-y-3">
                  <motion.div 
                    className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-lg">
                      {selectedPatient 
                        ? selectedPatient.first_name?.charAt(0) 
                        : newPatientData.first_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Patient</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        {selectedPatient 
                          ? `${selectedPatient.first_name} ${selectedPatient.last_name}` 
                          : `${newPatientData.first_name} ${newPatientData.last_name}`.trim()}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                      {woundTypes.find(t => t.value === woundDetails.type)?.icon || '🩹'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Wound Type</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">
                        {woundTypes.find(t => t.value === woundDetails.type)?.label || 'N/A'}
                        {woundDetails.icd10 && (
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            ICD-10: {woundDetails.icd10}
                          </span>
                        )}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-2xl">
                      ⏱️
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Duration</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{duration}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Kit Size Selection */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">📦</span>
                Select Kit Size
              </h3>
              
              <div className="space-y-3">
                {[
                  { value: '2x2', label: '2×2 pad', recommended: true, emoji: '⭐' },
                  { value: '1x1', label: '1×1 pad', recommended: false, emoji: '📏' },
                  { value: '7x7', label: '7×7 pad', recommended: false, emoji: '📐' },
                  { value: '10x10', label: '10×10 pad', recommended: false, emoji: '📊' },
                  { value: 'powder', label: 'Powder option', recommended: false, emoji: '💊' }
                ].map((size, index) => (
                  <motion.label 
                    key={size.value}
                    className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all flex items-center justify-between ${
                      recommendedKit === size.value
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.05) }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input 
                      type="radio" 
                      name="kitSize" 
                      value={size.value}
                      checked={recommendedKit === size.value}
                      onChange={(e) => setRecommendedKit(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{size.emoji}</span>
                      <div>
                        <span className="text-lg font-black text-gray-900 dark:text-white block">
                          {size.label}
                        </span>
                        {size.recommended && (
                          <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>
                    {recommendedKit === size.value && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                      >
                        <IoCheckmarkCircle className="text-white text-xl" />
                      </motion.div>
                    )}
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div 
              className="flex justify-between gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button 
                onClick={() => setOrderStep(2)}
                className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IoArrowBack />
                Back
              </motion.button>
              <motion.button 
                onClick={() => {
                  if (!ivrSubmitted) {
                    setOpenIvrModal(true);
                  } else {
                    handleSubmitOrder();
                  }
                }}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <IoRocketOutline className="text-xl" />
                    Submit Order
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Info Banner */}
            <motion.div 
              className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1">
                    What happens next?
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Your order will be reviewed and processed. You'll receive a confirmation email once the CareKit has been shipped.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

  // ============================================================================
// RENDER IVR REQUIRED STEP - ULTRA COOL VERSION
// Replace your existing renderIVRRequiredStep() function with this
// ============================================================================

const renderIVRRequiredStep = () => (
  <motion.div 
    className="px-4 sm:px-6 lg:px-12 pb-8"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    <div className="max-w-2xl mx-auto">
      <motion.div 
        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-10 relative overflow-hidden"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-400/10 to-yellow-400/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          {/* Animated Icon */}
          <motion.div 
            className="mb-6 inline-block"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <motion.div 
              className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-2xl"
              animate={{ 
                boxShadow: [
                  "0 20px 50px rgba(249, 115, 22, 0.3)",
                  "0 20px 60px rgba(249, 115, 22, 0.5)",
                  "0 20px 50px rgba(249, 115, 22, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IoDocumentTextOutline className="text-5xl text-white" />
            </motion.div>
          </motion.div>

          {/* Title with gradient */}
          <motion.h2 
            className="text-4xl font-black text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            IVR Form Required
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Complete the IVR form to proceed with your order
          </motion.p>

          {/* Info Cards */}
          <motion.div 
            className="space-y-4 mb-8 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-2xl">📋</span>
                </motion.div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wide">
                    What is IVR?
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Intravenous Therapy Request form captures essential patient and insurance information required for processing.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-5"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  <span className="text-2xl">⏱️</span>
                </motion.div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wide">
                    Quick Process
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    The form takes just 2-3 minutes to complete. Your patient information will be pre-filled to save time.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-5"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-start gap-4">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <span className="text-2xl">🔒</span>
                </motion.div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wide">
                    Secure & Compliant
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    All information is encrypted and HIPAA-compliant. Your data is stored securely and never shared.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Required Fields Preview */}
          <motion.div 
            className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4 uppercase tracking-wide flex items-center gap-2">
              <span className="text-xl">📝</span>
              Required Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                '✓ Patient Details',
                '✓ Physician Info',
                '✓ Facility Information',
                '✓ Primary Insurance',
                '✓ Contact Information',
                '✓ Delivery Address'
              ].map((item, index) => (
                <motion.div 
                  key={item}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (index * 0.05) }}
                >
                  <span className="text-green-500 font-black">{item.split(' ')[0]}</span>
                  <span>{item.substring(2)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button 
              onClick={() => {
                setCurrentView('dashboard');
                setOrderStep(1);
              }}
              className="flex-1 px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel Order
            </motion.button>
            <motion.button 
              onClick={() => setOpenIvrModal(true)}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoDocumentTextOutline className="text-xl" />
              Open IVR Form
            </motion.button>
          </motion.div>

          {/* Help Text */}
          <motion.p 
            className="mt-6 text-xs text-gray-500 dark:text-gray-400 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Need help? Contact support at <span className="text-orange-600 dark:text-orange-400 font-bold">support@promedhealth.com</span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  </motion.div>
);

  // ============================================================================
// RENDER SUCCESS - ULTRA COOL VERSION
// Replace your existing renderSuccess() function with this
// ============================================================================

const renderSuccess = (type = 'order') => {
  const isReorder = type === 'reorder';
  
  return (
    <motion.div 
      className="px-4 sm:px-6 lg:px-12 pb-8 min-h-[60vh] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl w-full">
        <motion.div 
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-12 relative overflow-hidden"
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-cyan-400/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{ 
                  y: '120vh', 
                  opacity: 0,
                  rotate: 360 
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2, 
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center">
            {/* Animated Success Icon */}
            <motion.div 
              className="mb-8 inline-block"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 10,
                delay: 0.2 
              }}
            >
              <motion.div 
                className="relative"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Outer ring */}
                <motion.div 
                  className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
                  animate={{ 
                    boxShadow: [
                      "0 25px 60px rgba(16, 185, 129, 0.4)",
                      "0 25px 70px rgba(16, 185, 129, 0.6)",
                      "0 25px 60px rgba(16, 185, 129, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <IoCheckmarkCircle className="text-7xl text-white" />
                  </motion.div>
                </motion.div>

                {/* Ripple effect */}
                <motion.div 
                  className="absolute inset-0 border-4 border-green-400 rounded-full"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute inset-0 border-4 border-emerald-400 rounded-full"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
            </motion.div>

            {/* Success Title */}
            <motion.h2 
              className="text-5xl font-black text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {isReorder ? '🎉 Reorder Successful!' : '🎉 Order Created!'}
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 mb-8 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Your CareKit {isReorder ? 'reorder' : 'order'} has been submitted successfully
            </motion.p>

            {/* Success Details Cards */}
            <motion.div 
              className="space-y-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <IoTimeOutline className="text-3xl text-white" />
                  </motion.div>
                  <div className="text-left">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wide">
                      What's Next?
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Your order is being processed. You'll receive a confirmation email within 24 hours.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    <IoMedkitOutline className="text-3xl text-white" />
                  </motion.div>
                  <div className="text-left">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wide">
                      Shipping Timeline
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Your CareKit will be shipped within 2-3 business days. Track your order via email.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    <IoDocumentTextOutline className="text-3xl text-white" />
                  </motion.div>
                  <div className="text-left">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 uppercase tracking-wide">
                      Order History
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      View all your orders anytime from the dashboard. Download invoices and track shipments.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <div className="text-3xl font-black text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text">
                    {recentActivity.length}
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mt-1">
                    Total Orders
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                    {patients.length}
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mt-1">
                    Patients
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <div className="text-3xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                    {recentActivity.filter(o => o.status === 'delivered').length}
                  </div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mt-1">
                    Completed
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <motion.button 
                onClick={() => {
                  setCurrentView('newOrder');
                  setOrderStep(1);
                  setIvrSubmitted(false);
                }}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <IoAddCircleOutline className="text-2xl" />
                Create Another Order
              </motion.button>
              <motion.button 
                onClick={() => setCurrentView('dashboard')}
                className="flex-1 px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <IoArrowBack className="text-xl rotate-180" />
                Back to Dashboard
              </motion.button>
            </motion.div>

            {/* Celebration Message */}
            <motion.p 
              className="mt-8 text-sm text-gray-500 dark:text-gray-400 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              🎊 Thank you for using ProMed Health Plus! 🎊
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

  // ============================================================================
// RENDER PATIENTS LIST - ULTRA COOL VERSIONs
// Replace your existing renderPatientsList() function with this
// ============================================================================

const renderPatientsList = () => {
  const filteredPatients = patientSearch 
    ? patients.filter(p => {
        const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
        return fullName.includes(patientSearch.toLowerCase());
      })
    : patients;

  return (
    <motion.div 
      className="px-4 sm:px-6 lg:px-12 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 p-8 shadow-2xl"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '0.7s'}}></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.button 
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center gap-2 text-white/90 hover:text-white hover:gap-3 transition-all font-bold group"
                  whileHover={{ x: -5 }}
                >
                  <IoArrowBack className="text-xl group-hover:scale-110 transition-transform" /> 
                  Back
                </motion.button>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <IoPersonOutline className="text-5xl text-white" />
              </motion.div>
            </div>
            
            <h1 className="text-4xl font-black text-white mb-2">Patient Management</h1>
            <p className="text-purple-100 text-lg">View and manage all your patients</p>
          </div>
        </motion.div>

        {/* Search and Stats Bar */}
        <motion.div 
          className="mb-6 flex flex-col md:flex-row gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Search Box */}
          <div className="flex-1 relative">
            <IoSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl z-10" />
            <motion.input
              type="text"
              placeholder="Search patients by name..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full pl-14 pr-5 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-semibold placeholder:text-gray-400 shadow-lg"
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          {/* Quick Stats */}
          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl px-6 py-4 shadow-lg text-center min-w-[100px]"
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-3xl font-black text-white">{patients.length}</div>
              <div className="text-xs font-bold text-blue-100 uppercase">Total</div>
            </motion.div>
            <motion.div 
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl px-6 py-4 shadow-lg text-center min-w-[100px]"
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <div className="text-3xl font-black text-white">{filteredPatients.length}</div>
              <div className="text-xs font-bold text-purple-100 uppercase">Showing</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Patients Grid */}
        {loading && patients.length === 0 ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="relative mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-300 opacity-20 mx-auto"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-semibold">Loading patients...</p>
            </motion.div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-8xl mb-6">👥</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
              {patientSearch ? 'No patients found' : 'No patients yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
              {patientSearch 
                ? 'Try adjusting your search terms' 
                : 'Create your first order to add patients'}
            </p>
            {!patientSearch && (
              <motion.button 
                onClick={() => {
                  setCurrentView('newOrder');
                  setOrderStep(1);
                }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <IoAddCircleOutline className="text-2xl" />
                Create First Order
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 rounded-2xl"></div>
                
                <div className="relative z-10">
                  {/* Avatar and Name */}
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-lg"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white truncate mb-1">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold">
                          Patient #{patient.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="space-y-3 mb-4">
                    <motion.div 
                      className="flex items-center gap-3 text-sm"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IoCalendarOutline className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">DOB</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {patient.date_of_birth 
                            ? new Date(patient.date_of_birth).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })
                            : 'Not provided'}
                        </p>
                      </div>
                    </motion.div>

                    {patient.phone_number && (
                      <motion.div 
                        className="flex items-center gap-3 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">📱</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Phone</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {patient.phone_number}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {patient.address && (
                      <motion.div 
                        className="flex items-center gap-3 text-sm"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm">📍</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Address</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {patient.address}
                            {patient.city && `, ${patient.city}`}
                            {patient.state && `, ${patient.state}`}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Action Button */}
                  <motion.button 
                    onClick={() => {
                      setSelectedPatient(patient);
                      setCurrentView('newOrder');
                      setOrderStep(2);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IoAddCircleOutline className="text-xl" />
                    Create Order
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom Action Bar */}
        {!loading && filteredPatients.length > 0 && (
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button 
              onClick={() => {
                setCurrentView('newOrder');
                setOrderStep(1);
              }}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoAddCircleOutline className="text-2xl" />
              Create New Order
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentView === 'dashboard' && renderDashboard()}
          {currentView === 'patientsList' && renderPatientsList()}
          {currentView === 'newOrder' && orderStep === 1 && renderNewOrderStep1()}
          {currentView === 'newOrder' && orderStep === 2 && renderNewOrderStep2()}
          {currentView === 'newOrder' && orderStep === 3 && renderNewOrderStep3()}
          {currentView === 'ivrRequired' && renderIVRRequiredStep()}
          {currentView === 'orderSuccess' && renderSuccess('order')}
          {currentView === 'reorderSuccess' && renderSuccess('reorder')}
        </motion.div>
      </AnimatePresence>

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
import React, { useEffect, useState, useContext, useCallback } from "react";
import toast from "react-hot-toast"; 
import axiosAuth from "../../../utils/axios";
import { AuthContext } from "../../../utils/context/auth";
import { FilterContext } from "../../../utils/context/FilterContext"; 

const OrderHistory = () => {
  const { user } = useContext(AuthContext); 
  const { activationFilter } = useContext(FilterContext); 
  
  const [history, setHistory] = useState([]);
  const [expandedPatients, setExpandedPatients] = useState({});
  const [loading, setLoading] = useState(true); 

  // --- Utility Functions ---

  const orderStatus = (status) => {
    const lowerStatus = String(status).toLowerCase();
    const baseColors = {
      accepted: "text-green-500", pending: "text-yellow-500",
      delivered: "text-green-500", cancelled: "text-red-500",
      refunded: "text-orange-500", failed: "text-red-500", default: "text-gray-500",
    };
    const darkColors = {
      accepted: "dark:text-green-400", pending: "dark:text-yellow-400",
      delivered: "dark:text-green-400", cancelled: "dark:text-red-400",
      refunded: "dark:text-orange-400", failed: "dark:text-red-400", default: "dark:text-gray-400",
    };
    const colorKey = baseColors[lowerStatus] ? lowerStatus : "default";
    return `${baseColors[colorKey]} ${darkColors[colorKey]}`;
  };

  const downloadInvoice = async (orderId) => {
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.get(
        `/provider/invoice/${orderId}/`,
        { responseType: "blob" }
      );
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("application/pdf")) {
        console.error("Expected PDF, got unexpected content.");
        toast.error("Failed to download PDF. Server returned unexpected content.");
        return;
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_order_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download invoice:", err);
      toast.error("Could not download invoice. Please try again.");
    }
  };

  const handleToggle = async (patientId) => {
    const isExpanded = expandedPatients[patientId];
    if (isExpanded) {
      setExpandedPatients((prev) => ({ ...prev, [patientId]: false }));
    } else {
      setExpandedPatients((prev) => ({ ...prev, [patientId]: true }));
      
      const patient = history.find(p => p.id === patientId);
      // Only fetch if the patient is found AND they don't have enough orders already loaded
      if (patient && patient.orders && patient.orders.length > 5) {
          return;
      }

      try {
        const axiosInstance = axiosAuth(); 
        const res = await axiosInstance.get(`/provider/patient/${patientId}/order-history-full/`); 
        
        const updatedPatientData = res.data; 

        setHistory((prev) =>
          prev.map((p) => (p.id === patientId ? updatedPatientData : p))
        );
      } catch (err) {
        console.error("Failed to load full order history", err);
        setExpandedPatients((prev) => ({ ...prev, [patientId]: false })); 
        toast.error("Could not load all orders for the patient.");
      }
    }
  };

  // --- Data Fetching and Effects ---

  // Fetches ALL patient order history
  const fetchHistory = useCallback(async () => {
    if (!user) return; 
    
    setLoading(true);
    try {
      const axiosInstance = axiosAuth();
      const res = await axiosInstance.get(`/provider/order-history/`);
      setHistory(res.data);
      console.log("Order history fetched successfully.");
    } catch (err) {
      console.error("Failed to fetch order history", err);
      toast.error("Failed to load order history.");
    }
    setLoading(false);
  }, [user]);

  // Initial data load effect (only depends on user)
  useEffect(() => {
    if (user) {
      fetchHistory();
    } else if (user === null) { 
      setLoading(false);
    }
  }, [user, fetchHistory]); 

  // --- Filtering Logic ---

  // ✅ Local filtering is performed on every render when activationFilter changes
  const filteredHistory = history.filter(patient => 
      !activationFilter || patient.activate_Account === activationFilter
  );
  
  // --- Render ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
      </div>
    );
  }

  if (filteredHistory.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        No order history found for the current filter.
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8 bg-gray-50 dark:bg-gray-800">
      {filteredHistory.map((patient) => (
        <div 
          key={patient.id} 
          className="bg-white dark:bg-gray-700 p-4 rounded shadow mb-4 transition-shadow hover:shadow-lg border border-gray-100 dark:border-gray-600"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 border-b dark:border-gray-600 pb-2 flex justify-between items-center">
            <span>
                {patient.first_name} {patient.last_name}
            </span>
            <span className="ml-3 text-sm font-normal text-teal-600 dark:text-teal-400">
                ({patient.activate_Account})
            </span>
          </h3>
          
          {patient.orders && patient.orders.length > 0 ? (
            <ul className="space-y-4 pt-2">
              {patient.orders.map((order) => (
                <li
                  key={order.id}
                  className="border border-gray-200 dark:border-gray-600 p-3 rounded bg-gray-50 dark:bg-gray-800 flex justify-between items-center transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Order <span className="font-bold">#{order.id}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-semibold ${orderStatus(order.status)}`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => downloadInvoice(order.id)}
                      className="text-xs text-teal-500 dark:text-teal-300 hover:underline mt-1"
                      aria-label={`View Invoice for Order ${order.id}`}
                    >
                      View Invoice PDF
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-2">
              No orders found for this patient.
            </p>
          )}
          
          {patient.orders && patient.orders.length >= 5 && (
            <div className="mt-3 text-right">
              <button
                onClick={() => handleToggle(patient.id)}
                className="text-teal-600 dark:text-teal-400 hover:underline text-xs font-semibold"
              >
                {expandedPatients[patient.id] ? "Show Less" : "Show All Orders"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../utils/constants";
import axiosAuth from "../../../utils/axios";
import { AuthContext } from "../../../utils/auth"; // <-- Import AuthContext

const OrderHistory = ({ activationFilter }) => {
  const { user } = useContext(AuthContext); // <-- Get the user object
  const [history, setHistory] = useState([]);
  const [expandedPatients, setExpandedPatients] = useState({});
  const [loading, setLoading] = useState(true); // <-- Add loading state

  const fetchHistory = async () => {
    // CRITICAL CHECK: Ensure user is present before making the authenticated API call
    if (!user) {
      setLoading(false);
      return; 
    }
    
    setLoading(true);
    try {
      const axiosInstance = axiosAuth();
      // Ensure your backend URL is correct. Assuming it's `/provider/order-history/`
      const res = await axiosInstance.get(`/provider/order-history/`); 
      setHistory(res.data);
      console.log("Order history response:", res.data);
    } catch (err) {
      console.error("Failed to fetch order history", err);
      // Optional: Show error toast/message to the user
    }
    setLoading(false);
  };

  useEffect(() => {
    // Run fetchHistory only when the user object is confirmed to be available.
    if (user) {
      fetchHistory();
    }
    // Dependency array now includes 'user' to ensure it runs *after* user is set
  }, [user]); 

  // ----------------------------------------------------------------
  // Helper Functions (No changes needed, included for completeness)
  // ----------------------------------------------------------------
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
        const text = await response.data.text();
        console.error("Expected PDF, got:", text);
        alert("Failed to download PDF. Server returned unexpected content.");
        return;
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_order_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download invoice:", err);
      alert("Could not download invoice. Please try again.");
    }
  };

  const handleToggle = async (patientId) => {
    const isExpanded = expandedPatients[patientId];
    if (isExpanded) {
      setExpandedPatients((prev) => ({ ...prev, [patientId]: false }));
    } else {
      try {
        // NOTE: While you are using plain axios here, using axiosAuth is safer
        const axiosInstance = axiosAuth(); 
        const res = await axiosInstance.get(`/provider/order-history/`, {
          params: { all: true },
        });
        const updated = res.data.find((p) => p.id === patientId);
        setHistory((prev) =>
          prev.map((p) => (p.id === patientId ? updated : p))
        );
        setExpandedPatients((prev) => ({ ...prev, [patientId]: true }));
      } catch (err) {
        console.error("Failed to load full order history", err);
      }
    }
  };

  // ----------------------------------------------------------------
  // Render Logic
  // ----------------------------------------------------------------

  if (loading) {
    // Show a small loader while fetching data
    return (
      <div className="flex justify-center items-center h-24">
        <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
      </div>
    );
  }
  
  const filteredHistory = history.filter(patient => patient.activate_Account === activationFilter);
  
  if (filteredHistory.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center mt-6">
        No order history yet.
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-8 bg-gray-50 dark:bg-gray-800">
      {/* ... (rest of your map logic) ... */}
      {filteredHistory.map((patient) => (
        <div key={patient.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {patient.first_name} {patient.last_name}
          </h3>
          {patient.orders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No orders.
            </p>
          ) : (
            <ul className="space-y-4">
              {patient.orders.map((order) => (
                <li
                  key={order.id}
                  className="border border-gray-200 dark:border-gray-600 p-4 rounded bg-white dark:bg-gray-800 flex flex-col justify-center"
                >
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Order #{order.id} •{" "}
                    <span className={orderStatus(order.status)}>
                      {order.status}
                    </span>{" "}
                    • {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => downloadInvoice(order.id)}
                      className="text-xs text-teal-400 dark:text-teal-300 hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      View Invoice PDF
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {patient.orders.length >= 5 && (
            <div className="mt-3 text-right">
              <button
                onClick={() => handleToggle(patient.id)}
                className="text-teal-600 dark:text-teal-400 hover:underline text-xs"
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
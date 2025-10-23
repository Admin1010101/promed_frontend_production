import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosAuth from "../../../utils/axios";
import { useFilter } from "../../../utils/context/FilterContext";
import {
  IoDownloadOutline,
  IoReceiptOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoCloseCircle,
  IoAlertCircle,
} from "react-icons/io5";

const OrderHistory = () => {
  const { activationFilter, orderRefreshTrigger } = useFilter(); // ✅ Get refresh trigger from context
  const [history, setHistory] = useState([]);
  const [expandedPatients, setExpandedPatients] = useState({});
  const [loadingInvoice, setLoadingInvoice] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(null);

  // ✅ Fetch history on mount AND when orderRefreshTrigger changes
  useEffect(() => {
    console.log("📊 OrderHistory: Fetching data (trigger:", orderRefreshTrigger, ")");
    fetchHistory();
  }, [orderRefreshTrigger]); // This will re-fetch whenever an order is placed

  const fetchHistory = async () => {
    try {
      const axiosInstance = axiosAuth();
      const res = await axiosInstance.get(`/order-history/`);
      setHistory(Array.isArray(res.data) ? res.data : []);
      console.log("✅ Order history fetched:", res.data.length, "patients");
    } catch (err) {
      console.error("❌ Failed to fetch order history", err);
    }
  };

  const getOrderStatusConfig = (status) => {
    const lowerStatus = String(status).toLowerCase();
    const configs = {
      accepted: {
        icon: IoCheckmarkCircle,
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        label: "Accepted"
      },
      pending: {
        icon: IoTimeOutline,
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        text: "text-yellow-700 dark:text-yellow-400",
        border: "border-yellow-200 dark:border-yellow-800",
        label: "Pending"
      },
      delivered: {
        icon: IoCheckmarkCircle,
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-700 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
        label: "Delivered"
      },
      cancelled: {
        icon: IoCloseCircle,
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        label: "Cancelled"
      },
      refunded: {
        icon: IoAlertCircle,
        bg: "bg-orange-50 dark:bg-orange-900/20",
        text: "text-orange-700 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
        label: "Refunded"
      },
      failed: {
        icon: IoCloseCircle,
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        label: "Failed"
      },
    };
    return configs[lowerStatus] || {
      icon: IoAlertCircle,
      bg: "bg-gray-50 dark:bg-gray-700/50",
      text: "text-gray-700 dark:text-gray-400",
      border: "border-gray-200 dark:border-gray-700",
      label: status
    };
  };

  const OrderStatusBadge = ({ status }) => {
    const config = getOrderStatusConfig(status);
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const downloadInvoice = async (orderId) => {
    setLoadingInvoice(orderId);
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.get(`/invoice/${orderId}/`, {
        responseType: "blob",
      });
      
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
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download invoice:", err);
      alert("Could not download invoice. Please try again.");
    } finally {
      setLoadingInvoice(null);
    }
  };

  const handleToggle = async (patientId) => {
    const isExpanded = expandedPatients[patientId];
    
    if (isExpanded) {
      setExpandedPatients((prev) => ({ ...prev, [patientId]: false }));
      setLoadingPatient(patientId);
      
      try {
        const axiosInstance = axiosAuth();
        const res = await axiosInstance.get(`/order-history/`, {
          params: { all: false },
        });
        const updated = res.data.find((p) => p.id === patientId);
        if (updated) {
          setHistory((prev) =>
            prev.map((p) => (p.id === patientId ? updated : p))
          );
        }
      } catch (err) {
        console.error("Failed to reload order history", err);
      } finally {
        setLoadingPatient(null);
      }
    } else {
      setLoadingPatient(patientId);
      
      try {
        const axiosInstance = axiosAuth();
        const res = await axiosInstance.get(`/order-history/`, {
          params: { all: true },
        });
        const updated = res.data.find((p) => p.id === patientId);
        if (updated) {
          setHistory((prev) =>
            prev.map((p) => (p.id === patientId ? updated : p))
          );
          setExpandedPatients((prev) => ({ ...prev, [patientId]: true }));
        }
      } catch (err) {
        console.error("Failed to load full order history", err);
        alert("Could not load all orders. Please try again.");
      } finally {
        setLoadingPatient(null);
      }
    }
  };

  const filteredHistory = history.filter(
    (patient) =>
      !activationFilter || patient.activate_Account === activationFilter
  );

  if (filteredHistory.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="text-center">
          <IoReceiptOutline className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            No order history yet
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Orders will appear here once placed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {filteredHistory.map((patient) => {
          const totalOrders = patient.total_orders_count || patient.orders.length;
          const hasMoreOrders = totalOrders > 5;
          const isExpanded = expandedPatients[patient.id];
          
          return (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <IoPersonOutline className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">
                      {patient.first_name} {patient.last_name}
                    </h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {patient.orders.length === 0 ? (
                  <div className="text-center py-6">
                    <IoReceiptOutline className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      No orders for this patient
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {patient.orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                                Order #{order.id}
                              </span>
                              <OrderStatusBadge status={order.status} />
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400">
                              <IoCalendarOutline className="w-3 h-3" />
                              <span>
                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>

                          <motion.button
                            onClick={() => downloadInvoice(order.id)}
                            disabled={loadingInvoice === order.id}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {loadingInvoice === order.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <IoDownloadOutline className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[10px] font-semibold">Invoice</span>
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {hasMoreOrders && (
                  <motion.button
                    onClick={() => handleToggle(patient.id)}
                    disabled={loadingPatient === patient.id}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loadingPatient === patient.id ? (
                      <div className="w-4 h-4 border-2 border-teal-600 dark:border-teal-400 border-t-transparent rounded-full animate-spin" />
                    ) : isExpanded ? (
                      <>
                        <IoChevronUpOutline className="w-4 h-4" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <IoChevronDownOutline className="w-4 h-4" />
                        <span>Show All {totalOrders} Orders</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default OrderHistory;
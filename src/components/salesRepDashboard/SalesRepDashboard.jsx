import React, { useState, useEffect, useContext } from "react";
import {
  MdOutlineBookmarkAdded,
  MdOutlineShoppingBag,
  MdOutlinePersonOutline,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdPictureAsPdf,
  MdLocalHospital,
} from "react-icons/md";
import { AuthContext } from "../../utils/auth";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion, AnimatePresence } from "framer-motion"; // <-- Framer Motion Import
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const orderDetailsVariants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.3 } },
};

// --- HELPER FUNCTIONS ---

// Helper function to format the patient's name
const formatName = (fullName) => {
  if (!fullName || typeof fullName !== 'string' || fullName.length < 3) return fullName;

  const parts = fullName.split(' ');
  const formattedParts = parts.map(part => {
    if (part.length <= 3) {
      return part;
    }
    // Mask all but the first character
    const firstChar = part.substring(0, 1);
    const middleAsterisks = '*'.repeat(part.length - 1);
    return `${firstChar}${middleAsterisks}`;
  });
  return formattedParts.join(' ');
};

const getIvrStatusColor = (status) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-amber-100 text-amber-700";
    case "Denied":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getOrderStatusColor = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-teal-100 text-teal-700";
    case "Shipped":
      return "bg-indigo-100 text-indigo-700";
    case "Pending":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// --- COMPONENTS ---

// StatBox (simple numerical display with Framer Motion)
const StatBox = ({ title, current, total, icon, color, delay }) => (
  <motion.div
    className="flex items-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl cursor-default"
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    custom={delay}
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600 mr-4`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        {current}
        {total !== null && (
          <span className="text-xl font-medium text-gray-400 dark:text-gray-500 ml-1">
            / {total}
          </span>
        )}
      </p>
      <h3 className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
        {title}
      </h3>
    </div>
  </motion.div>
);

// ChartStatBox (reusable bar chart stat box with Framer Motion)
const ChartStatBox = ({ title, labels, data, colors }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        font: { size: 16, weight: "600" },
        color: "#4B5563", // gray-600
        padding: 10,
      },
      tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 14 },
          bodyFont: { size: 12 },
          padding: 8,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
            color: '#6B7280' // gray-500
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6B7280' // gray-500
        },
        grid: {
            color: 'rgba(209, 213, 219, 0.3)' // light gray for grid lines
        }
      },
    },
  };
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg transition-all hover:shadow-xl"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="h-56">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
};


// --- MAIN DASHBOARD COMPONENT ---

const SalesRepDashboard = () => {
  const { getSalesRepDashboardData } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPatients, setExpandedPatients] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getSalesRepDashboardData();
      if (response.success) {
        setDashboardData(response.data);
      } else {
        setError("Failed to load dashboard data. Please check your connection.");
        console.error("Error fetching dashboard data:", response.error);
      }
      setLoading(false);
    };
    fetchData();
  }, [getSalesRepDashboardData]);

  const toggleOrders = (patientId) => {
    setExpandedPatients((prev) => ({
      ...prev,
      [patientId]: !prev[patientId],
    }));
  };

  const exportPDF = () => {
    const input = document.getElementById("dashboard-root");
    if (!input) return;

    // Temporarily hide elements that shouldn't be in the PDF (like the PDF button itself)
    const exportButton = document.getElementById("export-button");
    if (exportButton) exportButton.style.display = 'none';
    
    // Use a higher scale for better resolution in the PDF
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0); // Use JPEG for smaller file size
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("SalesRepDashboard.pdf");

      // Restore hidden elements
      if (exportButton) exportButton.style.display = 'flex';
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-teal-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading sales insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-red-300 dark:border-red-700">
            <p className="text-xl text-red-500 font-semibold">{error}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Please ensure you are logged in and try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboard-root" className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8 transition-colors duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b pb-4 border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-0">
          Sales Representative Dashboard 📈
        </h2>
        <button
          id="export-button"
          onClick={exportPDF}
          className="p-3 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition duration-200 flex items-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        >
          <MdPictureAsPdf size={20} className="mr-2" />
          Download Report
        </button>
      </div>

      {/* Stat Boxes (Global Summary) */}
      {dashboardData?.stats?.summary && (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <StatBox
            title="Total Orders"
            current={dashboardData.stats.summary.totalOrders}
            total={null}
            icon={<MdOutlineShoppingBag />}
            color="teal"
          />
          <StatBox
            title="Delivered Orders"
            current={dashboardData.stats.summary.deliveredOrders}
            total={dashboardData.stats.summary.totalOrders}
            icon={<MdOutlineShoppingBag />}
            color="indigo"
          />
          <StatBox
            title="Total IVRs"
            current={dashboardData.stats.summary.totalIVRs}
            total={null}
            icon={<MdOutlineBookmarkAdded />}
            color="purple"
          />
          <StatBox
            title="Approved IVRs"
            current={dashboardData.stats.summary.approvedIVRs}
            total={dashboardData.stats.summary.totalIVRs}
            icon={<MdOutlineBookmarkAdded />}
            color="green"
          />
        </motion.div>
      )}

      {/* Provider-Level Charts */}
      {dashboardData?.stats?.by_provider && (
        <>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Provider Performance Overview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {dashboardData.stats.by_provider.map((provider) => (
                <div key={provider.provider_id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl space-y-4">
                    <div className="flex items-center text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                        <MdLocalHospital className="mr-2 text-teal-600" />
                        <span>{provider.provider_name}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <ChartStatBox
                        title="Order Status Breakdown"
                        labels={["Delivered", "Pending"]}
                        data={[
                            provider.delivered_orders,
                            provider.total_orders - provider.delivered_orders,
                        ]}
                        colors={["#10B981", "#F59E0B"]} 
                        />
                        <ChartStatBox
                        title="IVR Status Breakdown"
                        labels={["Approved", "Other"]}
                        data={[
                            provider.approved_ivrs,
                            provider.total_ivrs - provider.approved_ivrs,
                        ]}
                        colors={["#3B82F6", "#D1D5DB"]}
                        />
                    </div>
                </div>
            ))}
            </div>
        </>
      )}

      {/* Detailed Provider and Patient List */}
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Provider and Patient Details</h3>
      <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
        {dashboardData?.providers?.map((provider, index) => (
          <motion.div 
            key={provider.id} 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border-t-4 border-teal-600"
            variants={itemVariants}
            custom={index * 0.1}
          >
            {/* Provider Header */}
            <div className="flex items-center text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <MdOutlinePersonOutline className="mr-3 text-teal-600 text-2xl" />
              <span>{provider.full_name}</span>
            </div>
            
            {/* Patient Cards */}
            {provider.patients?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {provider.patients.map((patient) => {
                  const ordersToShow = patient.orders.slice(0, 3);
                  const hasMoreOrders = patient.orders.length > 3;
                  const isExpanded = expandedPatients[patient.id];
                  
                  return (
                    <motion.div 
                        key={patient.id} 
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 shadow-inner hover:shadow-md transition-shadow duration-200 border-l-4 border-indigo-400"
                        variants={itemVariants}
                    >
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate mb-3">
                          Patient: {formatName(patient.full_name)}
                      </p>
                      
                      {/* IVRs */}
                      <div className="mt-3 border-t pt-3 border-gray-200 dark:border-gray-600">
                        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">IVRs</h4>
                        <ul className="list-none space-y-1">
                          {patient.ivrs?.length > 0 ? (
                            patient.ivrs.map((ivr) => (
                              <li key={ivr.id} className="flex items-center justify-between text-sm">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getIvrStatusColor(ivr.status)}`}>
                                  {ivr.status}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">IVR #{ivr.id}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500 dark:text-gray-400 text-sm italic">No IVRs found.</li>
                          )}
                        </ul>
                      </div>
                      
                      {/* Orders */}
                      <div className="mt-4 border-t pt-3 border-gray-200 dark:border-gray-600">
                        <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">Recent Orders</h4>
                        <ul className="list-none space-y-1">
                          {ordersToShow?.length > 0 ? (
                            ordersToShow.map((order) => (
                              <li key={order.id} className="flex items-center justify-between text-sm">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  #{order.id} ({new Date(order.created_at).toLocaleDateString()})
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500 dark:text-gray-400 text-sm italic">No recent orders.</li>
                          )}
                        </ul>
                        
                        {/* Expanded Orders (Framer Motion) */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.ul
                              variants={orderDetailsVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              className="list-none space-y-1 overflow-hidden pt-2"
                            >
                                {patient.orders.slice(3).map((order) => (
                                    <li key={order.id} className="flex items-center justify-between text-sm">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            #{order.id} ({new Date(order.created_at).toLocaleDateString()})
                                        </span>
                                    </li>
                                ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>

                        {/* Toggle Button */}
                        {hasMoreOrders && (
                          <button
                            onClick={() => toggleOrders(patient.id)}
                            className="mt-3 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center"
                          >
                            {isExpanded ? "Show Less" : "Show All Orders"}
                            {isExpanded ? <MdKeyboardArrowUp className="inline-block ml-1 text-lg" /> : <MdKeyboardArrowDown className="inline-block ml-1 text-lg" />}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center italic py-8">
                No patients are currently managed by this provider.
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SalesRepDashboard;
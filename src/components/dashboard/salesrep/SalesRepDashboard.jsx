// src/views/dashboard/salesrep/SalesRepDashboard.jsx
import React, { useState, useEffect } from "react";
import { 
  IoPersonOutline, 
  IoStatsChartOutline,
  IoDocumentTextOutline,
  IoTimeOutline,
  IoCartOutline,
  IoCheckmarkCircleOutline,
  IoPersonAddOutline
} from "react-icons/io5";
import { Loader2 } from "lucide-react";

const API_BASE_URL =
  "https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1";

const SalesRepDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalProviders: 0,
    activeProviders: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sales-rep/dashboard-stats/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      
      setStats({
        totalProviders: data.stats.total_providers,
        activeProviders: data.stats.active_providers,
      });
      setRecentActivities(data.recent_activities || []);
      setProviders(data.providers || []);
      
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'added':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'denied':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'placed':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'document':
        return <IoDocumentTextOutline className="text-teal-600 dark:text-teal-400" />;
      case 'cart':
        return <IoCartOutline className="text-blue-600 dark:text-blue-400" />;
      case 'person':
        return <IoPersonAddOutline className="text-purple-600 dark:text-purple-400" />;
      case 'checkmark':
        return <IoCheckmarkCircleOutline className="text-green-600 dark:text-green-400" />;
      default:
        return <IoDocumentTextOutline className="text-teal-600 dark:text-teal-400" />;
    }
  };

  const getActivityBgColor = (iconType) => {
    switch (iconType) {
      case 'document':
        return 'bg-teal-100 dark:bg-teal-900';
      case 'cart':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'person':
        return 'bg-purple-100 dark:bg-purple-900';
      case 'checkmark':
        return 'bg-green-100 dark:bg-green-900';
      default:
        return 'bg-teal-100 dark:bg-teal-900';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 text-sm text-red-700 dark:text-red-300 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.full_name || 'Sales Rep'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's an overview of your providers and activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-8">
        {/* Total Providers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <IoPersonOutline className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalProviders}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Providers
          </p>
        </div>

        {/* Active Providers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <IoStatsChartOutline className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Active
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.activeProviders}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Active Providers
          </p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Activities
        </h2>
        
        {recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <IoTimeOutline className="text-4xl text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              No recent activities from your providers yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${getActivityBgColor(activity.icon)} rounded-full flex items-center justify-center`}>
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {activity.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.type} - {activity.detail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
                    {activity.date_formatted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Provider Management Section - Coming Soon */}
      {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Provider Management
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Advanced provider management features coming soon!
          </p>
          <div className="inline-flex items-center space-x-2 text-teal-600 dark:text-teal-400">
            <span className="animate-pulse">⚡</span>
            <span className="font-semibold">In Development</span>
            <span className="animate-pulse">⚡</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SalesRepDashboard;
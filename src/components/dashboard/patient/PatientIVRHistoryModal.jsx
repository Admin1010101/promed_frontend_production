import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoClose,
  IoDocumentsOutline,
  IoDownloadOutline,
  IoCalendarOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoCloseCircle,
  IoEyeOutline,
} from 'react-icons/io5';

const PatientIVRHistoryModal = ({ open, onClose, patientId, patientName }) => {
  const [ivrForms, setIvrForms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && patientId) {
      fetchPatientIVRs();
    }
  }, [open, patientId]);

  const fetchPatientIVRs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1/patients/${patientId}/ivr-forms/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setIvrForms(data);
      }
    } catch (error) {
      console.error('Error fetching IVR forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      Approved: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
      Denied: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    };
    
    const icons = {
      Approved: <IoCheckmarkCircle className="w-3.5 h-3.5" />,
      Pending: <IoTimeOutline className="w-3.5 h-3.5" />,
      Denied: <IoCloseCircle className="w-3.5 h-3.5" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${styles[status] || styles.Pending}`}>
        {icons[status] || icons.Pending}
        {status || 'Pending'}
      </span>
    );
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                IVR Form History
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {patientName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <IoClose className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : ivrForms.length === 0 ? (
              <div className="text-center py-12">
                <IoDocumentsOutline className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No IVR Forms Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No Insurance Verification Request forms have been submitted for this patient yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {ivrForms.map((form, index) => (
                  <motion.div
                    key={form.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left - Form Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                            <IoDocumentsOutline className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              IVR Form #{form.id}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              <IoCalendarOutline className="w-3.5 h-3.5" />
                              {formatDate(form.date_created)}
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                              Status
                            </p>
                            {getStatusBadge(form.ivr_status)}
                          </div>
                          
                          {form.primary_insurance && (
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                Primary Insurance
                              </p>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {form.primary_insurance}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Additional Info */}
                        {form.form_data?.physicianName && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-semibold">Physician:</span> {form.form_data.physicianName}
                          </div>
                        )}
                      </div>

                      {/* Right - Actions */}
                      <div className="flex flex-col gap-2">
                        {form.pdf_url ? (
                          <>
                            <motion.a
                              href={form.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                            >
                              <IoEyeOutline className="w-4 h-4" />
                              View
                            </motion.a>
                            <motion.a
                              href={form.pdf_url}
                              download
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                            >
                              <IoDownloadOutline className="w-4 h-4" />
                              Download
                            </motion.a>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic px-3 py-2">
                            PDF unavailable
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Latest Badge */}
                    {index === 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded">
                          ⭐ Most Recent
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Forms: <span className="font-semibold">{ivrForms.length}</span>
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PatientIVRHistoryModal;
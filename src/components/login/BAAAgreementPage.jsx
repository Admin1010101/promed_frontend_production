import React, { useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from "../../utils/context/auth"; 
import BAAForm from './BAAForm';
import { motion } from "framer-motion"; // 1. Import motion

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 50, damping: 20, delay: 0.1 }
  }
};

const BAAAgreementPage = () => {
  const { signBAA, user, isBAARequired } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isBAARequired) {
    if (user) return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  const handleAgreementAccepted = async (formData) => {
    const result = await signBAA(formData);
    if (result.success && result.mfa_required) navigate('/mfa', { replace: true });
    else if (result.success) navigate('/dashboard', { replace: true });
  };

  const prefillData = {
    full_name: user?.full_name || user?.email || '',
    facility: user?.facility || user?.company_name || '',
    title: user?.title || '',
  };

  return (
    // 2. Add dark background and animation classes
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-6">
      
      {/* 3. Animated background elements (Copied from ForgotPasswordPage) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content / Form Container */}
      <motion.div
        className="relative z-10 w-full max-w-3xl" // Removed extra padding since the outer div has it
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
          <h1 className="text-3xl font-bold mb-3 text-center text-white">
            Business Associate Agreement (BAA) Acceptance
          </h1>
          <p className="text-center mb-6 text-gray-300">
            To continue, please review and accept the Business Associate Agreement.
          </p>
          <BAAForm 
            onAgreementAccepted={handleAgreementAccepted} 
            userData={prefillData}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default BAAAgreementPage;
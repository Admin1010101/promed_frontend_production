import React, { useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from "../../utils/context/auth"; 
import BAAForm from './BAAForm';

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

  // ✅ Correct key names for BAAForm
  const prefillData = {
    full_name: user?.full_name || user?.email || '',
    facility: user?.facility || user?.company_name || '',
    title: user?.title || '',
  };

  return (
    <div className="flex items-center justify-center p-6 min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-red-400">
          Business Associate Agreement (BAA) Acceptance
        </h1>
        <p className="text-center mb-6">
          To continue, please accept the Business Associate Agreement (BAA).
        </p>
        <BAAForm 
          onAgreementAccepted={handleAgreementAccepted} 
          userData={prefillData}
        />
      </div>
    </div>
  );
};

export default BAAAgreementPage;

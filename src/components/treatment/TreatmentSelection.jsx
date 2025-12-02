import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMedkitOutline, IoHeartCircleOutline, IoArrowForward } from 'react-icons/io5';

const TreatmentSelection = () => {
  const navigate = useNavigate();
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const treatments = [
    {
      id: 'skin_subs',
      title: 'Skin Subs',
      description: 'Advanced wound care and skin substitutes for optimal patient healing and recovery',
      icon: IoMedkitOutline,
      gradient: 'from-teal-500 to-blue-500',
      hoverGradient: 'from-teal-400 to-blue-400',
      iconBg: 'bg-teal-500/20',
      features: ['Patient Management', 'Document Processing', 'Order Tracking', 'BAA Agreement']
    },
    {
      id: 'conservative_care',
      title: 'Conservative Care',
      description: 'Comprehensive treatment plans with advanced care management and monitoring',
      icon: IoHeartCircleOutline,
      gradient: 'from-purple-500 to-pink-500',
      hoverGradient: 'from-purple-400 to-pink-400',
      iconBg: 'bg-purple-500/20',
      features: ['Treatment Planning', 'Appointment Scheduling', 'Care Monitoring', 'Progress Tracking']
    }
  ];

  const handleSelection = (treatmentId) => {
    setSelectedTreatment(treatmentId);
    setIsNavigating(true);
    
    // Store selection in localStorage
    localStorage.setItem('selectedTreatment', treatmentId);
    
    // Navigate after animation
    setTimeout(() => {
      navigate('/dashboard', { state: { initialService: treatmentId }});
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-2 h-16 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full"></div>
                <h1 className="text-5xl md:text-6xl font-semibold text-white">
                  ProMed Health
                  <span className="block text-teal-400 mt-1">Plus</span>
                </h1>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-2xl md:text-3xl text-gray-300 mb-4 font-light"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Select Your Treatment Program
            </motion.p>
            
            <motion.p 
              className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Choose the care pathway that best suits your practice needs
            </motion.p>
          </motion.div>

          {/* Treatment Cards */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12"
          >
            {treatments.map((treatment, index) => {
              const Icon = treatment.icon;
              const isSelected = selectedTreatment === treatment.id;

              return (
                <motion.div
                  key={treatment.id}
                  variants={cardVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !isNavigating && handleSelection(treatment.id)}
                  className={`
                    relative cursor-pointer group
                    bg-white/5 backdrop-blur-xl rounded-3xl p-8
                    border-2 transition-all duration-500
                    ${isSelected 
                      ? 'border-white shadow-2xl shadow-white/30 ring-4 ring-white/20' 
                      : 'border-white/10 hover:border-white/30'
                    }
                    ${isNavigating ? 'pointer-events-none' : ''}
                  `}
                >
                  {/* Gradient Background on Hover/Select */}
                  <div className={`
                    absolute inset-0 rounded-3xl transition-opacity duration-500
                    bg-gradient-to-br ${treatment.gradient}
                    ${isSelected ? 'opacity-10' : 'opacity-0 group-hover:opacity-5'}
                  `}></div>

                  {/* Selection Pulse Effect */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-3xl border-2 border-white"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div 
                      className={`
                        ${treatment.iconBg} 
                        w-24 h-24 rounded-2xl flex items-center justify-center mb-6
                        backdrop-blur-sm border border-white/10
                      `}
                      whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="text-5xl text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors">
                      {treatment.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-base leading-relaxed mb-6">
                      {treatment.description}
                    </p>

                    {/* Features List */}
                    <div className="mb-6 space-y-2">
                      {treatment.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + (idx * 0.1) }}
                          className="flex items-center gap-2 text-sm text-gray-400"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${treatment.gradient}`}></div>
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Select Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <motion.button
                        className={`
                          px-8 py-3 rounded-xl font-bold text-white
                          bg-gradient-to-r ${isSelected ? treatment.hoverGradient : treatment.gradient}
                          shadow-lg transition-all duration-300
                          flex items-center gap-2 group-hover:shadow-2xl
                          ${isNavigating ? 'opacity-50' : ''}
                        `}
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isNavigating}
                      >
                        {isSelected && isNavigating ? (
                          <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading...
                          </>
                        ) : (
                          <>
                            Select
                            <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </motion.button>

                      {/* Selection Checkmark */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: isSelected ? 1 : 0, rotate: isSelected ? 0 : -180 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                      >
                        <svg className="w-6 h-6 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom Info */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-400">
                Need assistance? Contact your sales representative
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TreatmentSelection;
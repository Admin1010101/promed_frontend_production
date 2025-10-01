import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
// 1. Import motion
import { motion } from "framer-motion"; 
import mfa_bg_img from "../../assets/images/login_img.jpg";
import mfa_bg_img_2 from '../../assets/images/mfa_bg_img.jpeg'

const MFA = () => {
  const { verifyCode, user } = useContext(AuthContext);
  const [code, setCode] = useState(new Array(6).fill(""));
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.verified) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (value, index) => {
    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    verifyCode(fullCode)
      .then((response) => {
        if (response.success) {
          setVerified(true);
          navigate("/dashboard");
          setError(null);
        } else {
          setError(response.error || "Verification failed. Please try again.");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || "An error occurred. Please try again.");
      });
  };

  // --- Framer Motion Variants (Same as Login/Register) ---

  // For the left (image) panel, slides in from the left
  const imagePanelVariants = {
    hidden: { x: "-100vw" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.1 },
    },
  };

  // For the right (form) panel, fades and slides in from the right
  const formPanelVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.3 },
    },
  };
  
  // For the form content (input array, button)
  const formContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: 0.5,
        duration: 0.5 
      } 
    },
  };


  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-500 min-h-screen">
      <div className="flex justify-center h-screen relative">
        
        {/* Left Side Image with Overlay - Now uses motion */}
        <motion.div
          className="relative hidden lg:block lg:w-2/3 bg-cover"
          style={{ backgroundImage: `url(${mfa_bg_img_2})` }}
          initial="hidden"
          animate="visible"
          variants={imagePanelVariants}
        >
          {/* Overlay for professional dark look */}
          <div className="absolute inset-0 z-10 bg-gray-900/60" /> 

          {/* Text content */}
          <div className="flex items-center h-full px-20 relative z-20">
            <div>
              <h2 className="text-5xl font-bold text-white drop-shadow-lg">
                ProMed Health <span className="text-teal-400">Plus</span>
              </h2>
              <p className="max-w-xl mt-3 text-gray-200 text-xl font-light drop-shadow">
                We sent a secure code to your registered device for identity verification.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Form Panel - Now uses motion */}
        <motion.div 
            className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6 justify-center bg-white dark:bg-gray-900"
            initial="hidden"
            animate="visible"
            variants={formPanelVariants}
        >
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100">
                Two-Factor Authentication
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300 text-lg">
                Enter the 6-digit code sent to your phone
              </p>
            </div>

            {!verified ? (
              <motion.form 
                onSubmit={handleSubmit} 
                className="mt-10 space-y-8"
                initial="hidden"
                animate="visible"
                variants={formContentVariants}
              >
                
                {/* 6-digit code input */}
                <div className="flex justify-center gap-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      // Updated styling for teal focus and professional look
                      className="w-12 h-14 text-center text-3xl font-semibold border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>

                <input type="hidden" name="method" value="sms" />

                {/* Submit */}
                <motion.button
                  type="submit"
                  className="w-full px-4 py-3 tracking-wide text-white font-bold transition-colors duration-200 transform bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 uppercase shadow-lg disabled:opacity-50"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={code.some(d => d === "")}
                >
                  Verify Code
                </motion.button>

                {/* Error Message */}
                {error && (
                    <motion.p 
                        className="text-red-600 dark:text-red-400 text-sm text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {error}
                    </motion.p>
                )}
              </motion.form>
            ) : (
              <h3 className="mt-8 text-green-600 dark:text-green-400 text-xl font-medium text-center">
                Verification successful! Redirecting...
              </h3>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MFA;
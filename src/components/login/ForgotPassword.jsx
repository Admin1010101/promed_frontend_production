import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link for 'Back to Login' button
import { IoArrowBack, IoMail } from "react-icons/io5";

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  // Set initial state for submission status
  const [isSubmitting, setIsSubmitting] = useState(false); 
  // 'sent' state is for displaying the successful message to the user
  const [sent, setSent] = useState(false); 
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // The backend should return a 200/204 even if the email doesn't exist
      // to prevent email enumeration. We immediately set `sent` to true here
      // to display the generic success message.
      await axios.post(`${API_BASE_URL}/provider/request-password-reset/`, { email });
      setSent(true);
    } catch (err) {
      // If the request fails entirely (e.g., network error, server down)
      setError("Failed to send request. Please check your connection and try again.");
      console.error("Password reset request error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements (copied from Login) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 left-6 z-50"
      >
        <Link
          to="/login" // Assuming you want to go back to the login page
          className="group flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full shadow-xl transition-all duration-300 border border-white/20"
          title="Back to Login"
        >
          <IoArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
        </Link>
      </motion.div>

      {/* Main Content / Form Container */}
      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants} 
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold text-white mb-3">
            Forgot Password
          </h2>
          <p className="text-gray-400 text-lg">
            Enter your email to receive a reset link
          </p>
        </motion.div>

        {/* Form/Message Box */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10"
        >
          {sent ? (
            <div className="text-center p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
                <p className="text-teal-400 font-semibold">
                    Check your email for a password reset link.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    (If an account with that email exists, the link has been sent.)
                </p>
                <Link
                    to="/login"
                    className="mt-6 inline-block text-sm text-white font-semibold hover:text-teal-400 transition-colors"
                >
                    Back to Login
                </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <IoMail className="text-gray-400 group-focus-within:text-teal-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-300"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="example@example.com"
                    required
                  />
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </motion.button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
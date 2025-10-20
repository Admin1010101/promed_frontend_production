import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { IoCheckmarkCircle, IoArrowBack, IoEyeOutline, IoEyeOffOutline, IoLockClosed } from "react-icons/io5";
import { API_BASE_URL } from "../../utils/constants";
import login_bg_img from "../../assets/images/login_img.jpg";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Password checks
  const hasMinLength = password.length >= 12;
  const hasUppercase = (password.match(/[A-Z]/g) || []).length >= 2;
  const hasLowercase = (password.match(/[a-z]/g) || []).length >= 2;
  const hasNumbers = (password.match(/[0-9]/g) || []).length >= 2;
  const hasSpecialChars = (password.match(/[^A-Za-z0-9]/g) || []).length >= 2;
  const passwordsMatch = password === password2 && password.length > 0;

  const passwordRequirements = [
    { met: hasMinLength, text: "Minimum 12 characters" },
    { met: hasUppercase, text: "At least two uppercase letters" },
    { met: hasLowercase, text: "At least two lowercase letters" },
    { met: hasNumbers, text: "At least two numbers" },
    { met: hasSpecialChars, text: "At least two special characters" },
    { met: passwordsMatch, text: "Passwords match" }
  ];

  const allValid = passwordRequirements.every(req => req.met);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!allValid) {
      setError("Password does not meet all requirements or does not match.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/provider/reset-password/${token}/`, {
        password,
        confirm_password: password2,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "There was an error resetting your password.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const metRequirements = passwordRequirements.filter(req => req.met).length;
    if (metRequirements <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
    if (metRequirements <= 4) return { label: "Medium", color: "bg-yellow-500", width: "66%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = password.length > 0 ? getPasswordStrength() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6 z-50"
        >
          <Link
            to="/forgot-password"
            className="group flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full shadow-xl transition-all duration-300 border border-white/20"
          >
            <IoArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Left Panel */}
        <motion.div
          className="hidden lg:flex lg:w-3/5 relative"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${login_bg_img})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent"></div>

          <div className="relative z-10 flex items-center px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-6xl font-black text-white mb-4">
                ProMed
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Health Plus
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Improving Patient Outcomes with Proven Wound Care Solutions
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {!success ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full mb-6 border-4 border-white/10">
                      <IoLockClosed className="text-4xl text-indigo-400" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-3">
                      Reset Password
                    </h2>
                    <p className="text-gray-400">
                      Create a new secure password
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                            className="w-full px-4 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
                          >
                            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                          </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {strength && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-gray-400">Password Strength</span>
                              <span className={`text-xs font-semibold ${strength.color.replace('bg-', 'text-')}`}>
                                {strength.label}
                              </span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${strength.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: strength.width }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Requirements */}
                        <div className="mt-4 space-y-2">
                          {passwordRequirements.map((req, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center gap-2"
                            >
                              <IoCheckmarkCircle
                                className={`text-lg transition-colors ${req.met ? 'text-green-400' : 'text-gray-600'}`}
                              />
                              <span className={`text-sm transition-colors ${req.met ? 'text-green-400' : 'text-gray-500'}`}>
                                {req.text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password2}
                          onChange={(e) => setPassword2(e.target.value)}
                          placeholder="Repeat your password"
                          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                          required
                        />
                      </div>

                      <AnimatePresence>
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
                      </AnimatePresence>

                      <motion.button
                        type="submit"
                        disabled={!allValid || isLoading}
                        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10">
                          {isLoading ? "Resetting..." : "Reset Password"}
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6"
                  >
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>

                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Password Reset!
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Your password has been successfully reset.
                      <span className="block mt-2">Redirecting you to login...</span>
                    </p>
                    <div className="flex justify-center">
                      <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
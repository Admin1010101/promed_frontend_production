import React, { useState, useContext } from "react";
import { AuthContext } from "../../utils/context/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoArrowBack,
  IoCheckmarkCircle,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import toast from "react-hot-toast";
import register_bg_img_2 from "../../assets/images/register_bg_img.jpg";
import { countryCodesList } from "../../utils/data";
import { states } from "../../utils/data/index";

// --- START: MOVED COMPONENTS OUTSIDE REGISTER ---

const StepIndicator = ({ step, currentStep }) => (
  <div className="flex items-center">
    <motion.div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
        currentStep >= step
          ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white"
          : "bg-white/10 text-gray-400"
      }`}
      whileHover={{ scale: 1.1 }}
    >
      {currentStep > step ? <IoCheckmarkCircle size={24} /> : step}
    </motion.div>
  </div>
);

const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  ...props
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // IMPORTANT: Ensure the value and onChange props are correctly passed down
        className={`w-full ${
          icon ? "pl-12" : "pl-4"
        } pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-300`}
        {...props}
      />
    </div>
  </div>
);

// --- END: MOVED COMPONENTS OUTSIDE REGISTER ---

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    npiNumber: "",
    countryCode: "+1",
    password: "",
    password2: "",
    city: "",
    state: "",
    country: "",
    facility: "",
    facilityPhoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Password validation
  const hasMinLength = formData.password.length >= 8; // Changed from 12 to 8
  const hasUppercase = (formData.password.match(/[A-Z]/g) || []).length >= 2;
  const hasLowercase = (formData.password.match(/[a-z]/g) || []).length >= 2;
  const hasNumbers = (formData.password.match(/[0-9]/g) || []).length >= 2;
  const hasSpecialChars =
    (formData.password.match(/[^A-Za-z0-9]/g) || []).length >= 2;

  const passwordRequirements = [
    { met: hasMinLength, text: "Minimum 8 characters" }, // Changed from 12 to 8
    { met: hasUppercase, text: "At least two uppercase letters" },
    { met: hasLowercase, text: "At least two lowercase letters" },
    { met: hasNumbers, text: "At least two numbers" },
    { met: hasSpecialChars, text: "At least two special characters" },
  ];
  
  const handleChange = (field, value) => {
    // This correctly updates the state
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const formattedPhoneNumber = `${
      formData.countryCode
    }${formData.phoneNumber.replace(/\D/g, "")}`;
    const formattedFacilityPhoneNumber = formData.facilityPhoneNumber.replace(
      /\D/g,
      ""
    );

    if (formData.password !== formData.password2) {
      setErrorMsg("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (
      !(
        hasMinLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumbers &&
        hasSpecialChars
      )
    ) {
      setErrorMsg("Password does not meet all complexity requirements.");
      setIsLoading(false);
      return;
    }

    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      phone_number: formattedPhoneNumber,
      country_code: formData.countryCode,
      password: formData.password,
      password2: formData.password2,
      npi_number: formData.npiNumber,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      facility: formData.facility,
      facility_phone_number: formattedFacilityPhoneNumber,
    };

    const result = await register(payload);

    if (result.success) {
      toast.success(
        "Account created! Please check your email to verify your account.",
        { duration: 5000 }
      );
      navigate("/login");
    } else {
      const error = result.error;
      if (typeof error === "object") {
        const messages = Object.values(error).flat().join(" ");
        setErrorMsg(messages);
      } else {
        setErrorMsg(error);
      }
    }
    setIsLoading(false);
  };

  // The StepIndicator and InputField component definitions have been removed from here.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-teal-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
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
            to="/"
            className="group flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full shadow-xl transition-all duration-300 border border-white/20"
          >
            <IoArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Left Panel */}
        <motion.div
          className="hidden lg:flex lg:w-2/5 relative"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${register_bg_img_2})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent"></div>

          <div className="relative z-10 flex items-center px-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-xl flex items-start gap-6" // <-- Add flex here
            >
              {/* LINE ON THE LEFT */}
              <div className="w-3 h-20 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full mt-6"></div>

              {/* TEXT CONTENT */}
              <div>
                <h1 className="text-6xl font-semibold text-white mb-4">
                  Join
                  <span className="block text-teal-400">ProMed</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Securely manage your patient care and medical supplies with
                  our comprehensive platform.
                </p>

                <div className="mt-12 space-y-4">
                  {["HIPAA Compliant", "Real-time Updates", "24/7 Support"].map(
                    (feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <IoCheckmarkCircle className="text-teal-400 text-2xl" />
                        <span className="text-gray-300">{feature}</span>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3">
                Create Account
              </h2>
              <p className="text-gray-400">Enter your details to get started</p>
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-4 mb-8">
              <StepIndicator step={1} currentStep={currentStep} />
              <div className="flex-1 max-w-[100px] h-1 bg-white/10 rounded-full self-center">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: currentStep >= 2 ? "100%" : "0%" }}
                />
              </div>
              <StepIndicator step={2} currentStep={currentStep} />
              <div className="flex-1 max-w-[100px] h-1 bg-white/10 rounded-full self-center">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: currentStep >= 3 ? "100%" : "0%" }}
                />
              </div>
              <StepIndicator step={3} currentStep={currentStep} />
            </div>

            <motion.div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-white mb-4">
                        Personal Information
                      </h3>
                      <InputField
                        label="Full Name"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        placeholder="John Doe"
                        required
                      />
                      <InputField
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={formData.countryCode}
                            onChange={(e) =>
                              handleChange("countryCode", e.target.value)
                            }
                            className="w-32 px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                          >
                            {countryCodesList.map((country) => (
                              <option
                                key={country.code}
                                value={country.code}
                                className="bg-slate-800"
                              >
                                {country.flag} {country.code}
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              handleChange("phoneNumber", e.target.value)
                            }
                            placeholder="555-555-5555"
                            className="flex-1 px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                            required
                          />
                        </div>
                      </div>
                      <InputField
                        label="NPI Number"
                        type="text"
                        value={formData.npiNumber}
                        onChange={(e) =>
                          handleChange("npiNumber", e.target.value)
                        }
                        placeholder="10-digit NPI"
                        maxLength="10"
                        required
                      />
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-white mb-4">
                        Facility Information
                      </h3>
                      <InputField
                        label="Facility Name"
                        type="text"
                        value={formData.facility}
                        onChange={(e) =>
                          handleChange("facility", e.target.value)
                        }
                        placeholder="Your Clinic or Hospital"
                        required
                      />
                      <InputField
                        label="Facility Phone"
                        type="tel"
                        value={formData.facilityPhoneNumber}
                        onChange={(e) =>
                          handleChange("facilityPhoneNumber", e.target.value)
                        }
                        placeholder="555-555-5555"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        {/* Existing City Input */}
                        <InputField
                          label="City"
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          placeholder="Chicago"
                          required
                        />

                        {/* --- State Dropdown Replacement --- */}
                        <div>
                          <label
                            htmlFor="state-select"
                            className="block text-sm font-semibold text-gray-300 mb-2"
                          >
                            State
                          </label>
                          {/* The 'relative group' div is kept to maintain the styling context from your other components */}
                          <div className="relative group">
                            <select
                              id="state-select"
                              value={formData.state}
                              onChange={(e) =>
                                handleChange("state", e.target.value)
                              }
                              className="w-full pl-4 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-300"
                              required
                            >
                              {/* Default/Placeholder Option */}
                              <option
                                value=""
                                disabled
                                className="bg-slate-900 text-gray-500"
                              >
                                Select State
                              </option>

                              {/* Map over the states array to create options */}
                              {states.map((state) => (
                                <option
                                  key={state}
                                  value={state}
                                  className="bg-slate-900 text-white"
                                >
                                  {state}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        {/* ---------------------------------- */}
                      </div>
                      <InputField
                        label="Country"
                        type="text"
                        value={formData.country}
                        onChange={(e) =>
                          handleChange("country", e.target.value)
                        }
                        placeholder="United States"
                        required
                      />
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-bold text-white mb-4">
                        Security
                      </h3>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                              handleChange("password", e.target.value)
                            }
                            placeholder="Create a strong password"
                            className="w-full px-4 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-400"
                          >
                            {showPassword ? (
                              <IoEyeOffOutline size={20} />
                            ) : (
                              <IoEyeOutline size={20} />
                            )}
                          </button>
                        </div>
                        <div className="mt-3 space-y-2">
                          {passwordRequirements.map((req, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center gap-2"
                            >
                              <IoCheckmarkCircle
                                className={`text-lg ${
                                  req.met ? "text-teal-400" : "text-gray-600"
                                }`}
                              />
                              <span
                                className={`text-sm ${
                                  req.met ? "text-teal-400" : "text-gray-500"
                                }`}
                              >
                                {req.text}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <InputField
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password2}
                        onChange={(e) =>
                          handleChange("password2", e.target.value)
                        }
                        placeholder="Repeat your password"
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                    >
                      <p className="text-red-400 text-sm">{errorMsg}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 mt-8">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back
                    </motion.button>
                  )}
                  {currentStep < 3 ? (
                    <motion.button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </motion.button>
                  )}
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-teal-400 hover:text-teal-300 font-semibold"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;

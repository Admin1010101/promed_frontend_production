import React, { useState, useContext } from "react";
import { AuthContext } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
// 1. Import motion
import { motion } from "framer-motion"; 
import register_bg_img_2 from '../../assets/images/register_bg_img.jpg';
import { IoArrowBack, IoCheckmarkCircleOutline } from "react-icons/io5";
import { countryCodesList } from "../../utils/data";
import toast from "react-hot-toast";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [npiNumber, setNpiNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // New state variables to match the Django model
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [facility, setFacility] = useState("");
  const [facilityPhoneNumber, setFacilityPhoneNumber] = useState("");

  // Validation rules
  const hasMinLength = password.length >= 12;
  const hasUppercase = (password.match(/[A-Z]/g) || []).length >= 2;
  const hasLowercase = (password.match(/[a-z]/g) || []).length >= 2;
  const hasNumbers = (password.match(/[0-9]/g) || []).length >= 2;
  const hasSpecialChars = (password.match(/[^A-Za-z0-9]/g) || []).length >= 2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const formattedPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`;
    const formattedFacilityPhoneNumber = facilityPhoneNumber.replace(/\D/g, "");

    if (password !== password2) {
      setErrorMsg("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!(hasMinLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChars)) {
        setErrorMsg("Password does not meet all complexity requirements.");
        setIsLoading(false);
        return;
    }
    
    const formData = {
        full_name: fullName,
        email,
        phone_number: formattedPhoneNumber,
        country_code: countryCode,
        password,
        password2,
        npi_number: npiNumber,
        city,
        state,
        country,
        facility,
        facility_phone_number: formattedFacilityPhoneNumber,
    };
    
    const result = await register(formData);

    if (result.success) {
      toast.success(
        "Account created! Please check your email to verify your account."
      );
      // Reset form fields
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setNpiNumber("");
      setCountryCode("+1");
      setPassword("");
      setPassword2("");
      setCity("");
      setState("");
      setCountry("");
      setFacility("");
      setFacilityPhoneNumber("");
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

  // --- Framer Motion Variants ---

  // For the left (image) panel, slides in from the left
  const imagePanelVariants = {
    hidden: { x: "-100vw" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.1 },
    },
  };

  // For the right (registration form) panel, fades and slides in from the right
  const formPanelVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.3 },
    },
  };

  // For the individual form sections (staggered entrance)
  const formItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // For the main form container to orchestrate the stagger
  const formContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05, // Small stagger delay for each input field
        delayChildren: 0.5,
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-500 min-h-screen">
      <div className="flex justify-center flex-col lg:flex-row relative">
        
        {/* Back arrow - now uses motion and is styled */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute top-6 left-6 z-50"
        >
          <Link
            to="/"
            className="p-3 bg-teal-700/80 hover:bg-teal-700 text-white rounded-full shadow-xl transition duration-300 backdrop-blur-sm flex justify-center items-center"
            title="Back to Home"
          >
            <IoArrowBack size={24} />
          </Link>
        </motion.div>

        {/* Left image panel (only shown on large screens) - now uses motion */}
        <motion.div
          className="relative hidden bg-cover lg:block lg:w-2/3"
          style={{ backgroundImage: `url(${register_bg_img_2})` }}
          initial="hidden"
          animate="visible"
          variants={imagePanelVariants}
        >
          {/* Darker, professional overlay */}
          <div className="absolute inset-0 z-0 bg-gray-900/60"></div>
          <div className="flex items-center h-full px-20 relative z-20">
            <div>
              <h2 className="text-5xl font-bold text-white drop-shadow-lg">
                ProMed Health <span className="text-teal-400">Plus</span>
              </h2>
              <p className="max-w-xl mt-3 text-gray-200 text-xl font-light drop-shadow">
                Securely manage your patient care and medical supplies with a single, intuitive platform.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right registration panel - now uses motion for entrance and styling */}
        <motion.div
          className="flex w-full max-w-md px-6 mx-auto lg:w-2/6 bg-white dark:bg-gray-900 rounded-lg lg:h-screen lg:overflow-y-auto"
          initial="hidden"
          animate="visible"
          variants={formPanelVariants}
        >
          <div className="flex-1 my-auto py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Enter your details to register as a provider
              </p>
            </div>
            
            <motion.div 
                className="mt-8"
                initial="hidden"
                animate="visible"
                variants={formContainerVariants} // Apply container variant for stagger
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                </motion.div>
                
                {/* Email */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                </motion.div>
                
                {/* Phone Number */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    Personal Phone Number
                  </label>
                  <div className="flex">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-1/3 px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    >
                      {countryCodesList.map((country) => (
                        <option key={`${country.code}-${country.name}`} value={country.code}>
                          {country.flag} {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phoneNumber"
                      placeholder="555-555-5555"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-2/3 px-4 py-3 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    />
                  </div>
                </motion.div>

                {/* Facility Name */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="facility" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    Facility Name
                  </label>
                  <input
                    type="text"
                    id="facility"
                    placeholder="Your Clinic or Hospital Name"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                </motion.div>

                {/* Facility Phone Number */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="facilityPhoneNumber" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    Facility Phone Number
                  </label>
                  <input
                    type="tel"
                    id="facilityPhoneNumber"
                    placeholder="555-555-5555"
                    value={facilityPhoneNumber}
                    onChange={(e) => setFacilityPhoneNumber(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                </motion.div>
                
                {/* City */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    placeholder="e.g., Chicago"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                </motion.div>

                {/* State */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    placeholder="e.g., IL"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                </motion.div>

                {/* Country */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    placeholder="e.g., United States"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                </motion.div>

                {/* NPI Number */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="npiNumber" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    NPI Number
                  </label>
                  <input
                    type="text"
                    id="npiNumber"
                    placeholder="Your 10-digit NPI number"
                    value={npiNumber}
                    onChange={(e) => setNpiNumber(e.target.value)}
                    maxLength="10"
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                </motion.div>

                {/* Password */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                  <div className="mt-2 text-sm">
                    <ul className="list-none text-gray-500 dark:text-gray-400 space-y-1">
                      {[
                        { valid: hasMinLength, text: "Minimum 12 characters" },
                        { valid: hasUppercase, text: "At least two uppercase letters" },
                        { valid: hasLowercase, text: "At least two lowercase letters" },
                        { valid: hasNumbers, text: "At least two numbers" },
                        { valid: hasSpecialChars, text: "At least two special characters" }
                      ].map(({ valid, text }, idx) => (
                        <li
                          key={idx}
                          className={`${valid ? "text-teal-600 dark:text-teal-400" : ""} flex items-center`}
                        >
                          <IoCheckmarkCircleOutline 
                            className={`mr-2 ${valid ? "text-teal-600 dark:text-teal-400" : "text-gray-400 dark:text-gray-600"}`} 
                          />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
                
                {/* Confirm Password */}
                <motion.div variants={formItemVariants}>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Repeat your password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    required
                  />
                </motion.div>
                
                {/* Show Password */}
                <motion.div variants={formItemVariants}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-teal-600 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded focus:ring-teal-500 transition duration-200"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Show Password</span>
                  </label>
                </motion.div>
                
                {/* Submit Button */}
                <motion.div className="pt-4" variants={formItemVariants}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-3 tracking-wide text-white font-bold transition-colors duration-200 transform bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 uppercase shadow-lg"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </button>
                  {errorMsg && (
                    <motion.p 
                      className="mt-4 text-sm text-center text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errorMsg}
                    </motion.p>
                  )}
                </motion.div>
              </form>

              {/* Login Link */}
              <motion.p 
                className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-teal-600 dark:text-teal-400 font-semibold focus:outline-none focus:underline hover:underline transition duration-200"
                >
                  Log in
                </Link>.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
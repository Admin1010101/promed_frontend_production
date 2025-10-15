import React, { useState, useContext } from "react";
import { AuthContext } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import toast from "react-hot-toast";

// Assuming this image path is correct
import login_bg_img_2 from "../../assets/images/login_bg.jpg"; 

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [method, setMethod] = useState("sms"); 
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // **UPDATED:** Pass the chosen method to the login function
    const result = await login(email, password, method);

    if (result.mfa_required) {
      // Navigate to the MFA page, passing the session_id and email
      navigate("/mfa", { state: { session_id: result.session_id, email } });
    } else if (result.success) {
      navigate("/dashboard");
    } else {
      // result.error is the whole response, including {"username": ["This field is required."]}
      let displayError = "An unknown error occurred.";
      if (typeof result.error === 'object' && result.error !== null) {
          // Attempt to extract the first error message from the object
          const firstKey = Object.keys(result.error)[0];
          displayError = result.error[firstKey] && Array.isArray(result.error[firstKey]) 
              ? `${firstKey}: ${result.error[firstKey][0]}` 
              : JSON.stringify(result.error);
      } else if (typeof result.error === 'string') {
          displayError = result.error;
          toast.error(displayError)
      }
      setErrorMsg(displayError);
    }

    setIsLoading(false);
  };

  const imagePanelVariants = {
    hidden: { x: "-100vw" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.1 },
    },
  };

  const formPanelVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.3 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // ------------------------------------------------------------------------

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="flex justify-center h-screen relative">
        
        {/* Back Arrow */}
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

        {/* Left image panel */}
        <motion.div
          className="relative hidden bg-cover lg:block lg:w-2/3"
          style={{ backgroundImage: `url(${login_bg_img_2})` }}
          initial="hidden"
          animate="visible"
          variants={imagePanelVariants}
        >
          <div className="absolute inset-0 z-0 bg-gray-900/60"></div>
          
          <div className="flex items-center h-full px-20 relative z-20">
            <div>
              <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                ProMed Health <span className="text-teal-400">Plus</span>
              </h1>
              <p className="max-w-xl mt-3 text-gray-200 text-xl font-light drop-shadow">
                Improving Patient Outcomes with Proven Wound Care Solutions
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right login panel */}
        <motion.div
          className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6 bg-white dark:bg-gray-900 rounded-lg"
          initial="hidden"
          animate="visible"
          variants={formPanelVariants}
        >
          <div className="flex-1">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Sign in to access your dashboard
              </p>
            </div>

            <div className="mt-10">
              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Email Input (The value for the Django 'username' field) */}
                <motion.div variants={contentVariants}>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="example@example.com"
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>
                {/* Password Input */}
                <motion.div className="mt-6" variants={contentVariants}>
                  <div className="flex justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-800 dark:text-gray-200"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-teal-500 hover:text-teal-400 dark:text-teal-400 dark:hover:text-teal-300 hover:underline transition duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Your secure password"
                    className="block w-full px-4 py-3 mt-1 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-teal-500 focus:ring-teal-500 focus:outline-none focus:ring-1 transition duration-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </motion.div>
                {/* Login Button */}
                <motion.div className="mt-8" variants={contentVariants}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-3 tracking-wide text-white font-bold transition-colors duration-200 transform bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 uppercase shadow-lg"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                  {errorMsg && (
                    <motion.p 
                      className="mt-4 text-sm text-center text-red-600 dark:text-red-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Display the error message extracted from the object */}
                    </motion.p>
                  )}
                </motion.div>
              </form>

              {/* Register Link */}
              <motion.p 
                className="mt-10 text-sm text-center text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Don't have an account yet?{" "}
                <Link
                  to="/register"
                  className="text-teal-600 dark:text-teal-400 font-semibold focus:outline-none focus:underline hover:underline transition duration-200"
                >
                  Register
                </Link>
                .
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
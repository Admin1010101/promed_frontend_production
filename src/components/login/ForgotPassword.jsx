import React, { useState } from "react";
import { API_BASE_URL } from "../../utils/constants";
import axios from "axios";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import login_bg_img from "../../assets/images/login_img.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/provider/request-password-reset/`, {
        email,
      });
      setSent(true);
    } catch (err) {
      setError(
        "There was an issue sending the reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex justify-center h-screen">
        <div
          className="relative hidden bg-cover lg:block lg:w-2/3"
          style={{ backgroundImage: `url(${login_bg_img})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

          {/* Back arrow */}
          <Link
            to="/login"
            className="absolute top-6 left-6 z-20 text-white hover:text-blue-300 transition duration-200 z-50"
            title="Back to Login"
          >
            <IoArrowBack size={28} />
          </Link>

          <div className="flex items-center h-full px-20 bg-gray-9600 bg-opacity-40 relative z-20">
            <div>
              <h2 className="text-5xl font-semibold text-white">
                ProMed Health Plus
              </h2>
              <p className="max-w-xl mt-3 text-white text-xl font-light">
               Improving Patient Outcomes with Proven Wound Care Solutions 
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="flex-1">
            <div className="text-center">
              <p className="mt-3 text-gray-900 dark:text-gray-100 text-xl font-semibold uppercase">
                Forgot Your Password?
              </p>
              <p className="mt-2 text-gray-500 dark:text-gray-300 text-sm">
                Enter your email address to receive a password reset link.
              </p>
            </div>
            <div className="mt-8">
              {sent ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
                  <p className="text-blue-500 dark:text-blue-300 text-center font-medium">
                    Password reset link sent! Please check your inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm text-gray-800 dark:text-gray-200"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="example@example.com"
                      className="block w-full px-4 py-2 mt-2 text-gray-600 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-6">
                    <button
                      disabled={isLoading}
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 uppercase"
                      type="submit"
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                    {error && (
                      <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>
                    )}
                  </div>
                </form>
              )}
              <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-blue-400 focus:outline-none focus:underline hover:underline"
                >
                  Sign In
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
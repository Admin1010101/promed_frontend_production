import React, { useEffect, useContext, useRef, useState } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { PropagateLoader } from 'react-spinners'; // Added to show loader when Auth is initializing
import Dashboard from "./components/dashboard/Dashboard";
import SalesRepDashboard from './components/salesRepDashboard/SalesRepDashboard';
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Navbar from "./components/navbar/Navbar";
import About from "./components/about/About";
import Products from "./components/products/Products";
import Contact from "./components/contact/Contact";
import MFA from "./components/MFA/MFA";
import FillablePdf from "./components/dashboard/documemts/FillablePdf";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import ProviderProfileCard from "./components/profile/ProviderProfileCard";
import VerifyEmail from "./components/verifyEmail/VerifyEmail";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from "./components/login/ResetPassword";
import DashboardWrapper from "./components/salesRepDashboard/DashboardWrapper";
import PrivateRoute from "./utils/privateRoutes";
import { AuthContext } from "./utils/auth";
import "./App.css";

function AppWrapper() {
  const location = useLocation();
  const { logout, user, loading: authLoading } = useContext(AuthContext); // Use 'loading' from context
  const warningTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Define paths that hide the Navbar and Footer
  const hiddenPaths = [
    "/login",
    "/register",
    "/mfa",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ];
  const shouldHideNavAndFooter = hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // 1. Dark Mode Initialization
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const isDark = savedMode === "true";
    setIsDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 2. Session Timeout Logic (HIPAA Compliance)
  useEffect(() => {
    if (!user) return; // Only run if the user is logged in

    const HIPAA_IDLE_TIMEOUT_MINUTES = 15;
    const WARNING_BEFORE_LOGOUT_SECONDS = 60;

    const warningDuration =
      1000 * 60 * HIPAA_IDLE_TIMEOUT_MINUTES -
      1000 * WARNING_BEFORE_LOGOUT_SECONDS;
    const logoutDuration = 1000 * 60 * HIPAA_IDLE_TIMEOUT_MINUTES;

    const logoutAndRedirect = () => {
      logout();
      // Ensure redirect happens outside of a React lifecycle event
      setTimeout(() => {
        window.location.href = "/login";
      }, 0); 
    };

    const showWarning = () => {
      toast("You will be logged out in 1 minute due to inactivity.", {
        icon: "⚠️",
        duration: WARNING_BEFORE_LOGOUT_SECONDS * 1000,
      });
    };

    const resetTimers = () => {
      clearTimeout(warningTimeoutRef.current);
      clearTimeout(logoutTimeoutRef.current);

      warningTimeoutRef.current = setTimeout(showWarning, warningDuration);
      logoutTimeoutRef.current = setTimeout(logoutAndRedirect, logoutDuration);
    };

    resetTimers();

    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimers)
    );

    return () => {
      clearTimeout(warningTimeoutRef.current);
      clearTimeout(logoutTimeoutRef.current);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimers)
      );
    };
  }, [logout, user]);


  // 3. Global Auth Loading Check (Prevents White Screen)
  // If the AuthContext is still checking for tokens, display a full-screen loader.
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <PropagateLoader color={isDarkMode ? "#00A389" : "#10B981"} loading={true} size={15} />
      </div>
    );
  }


  return (
    <>
      <Toaster />
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen transition-colors duration-300">
        
        {/* Navbar */}
        {!shouldHideNavAndFooter && (
          <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        )}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mfa" element={<MFA />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Private Routes (Secured) */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard /> {/* Direct Dashboard render now */}
                </PrivateRoute>
              }
            />
            <Route
              path="/sales-rep/dashboard"
              element={
                <PrivateRoute>
                  <SalesRepDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProviderProfileCard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        {/* Footer */}
        {!shouldHideNavAndFooter && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AppWrapper />
    </HashRouter>
  );
}

export default App;
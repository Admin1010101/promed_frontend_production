import { useEffect, useContext, useRef, useState } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Dashboard from "./components/dashboard/Dashboard";
import SalesRepDashboard from './components/salesRepDashboard/SalesRepDashboard';
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import Navbar from "./components/navbar/Navbar";
import About from "./components/about/About";
import Services from "./components/services/Services";
import Contact from "./components/contact/Contact";
import MFA from "./components/MFA/MFA";
import FillablePdf from "./components/dashboard/documemts/FillablePdf";
import Home from "./components/home/Home";
import Footer from "./components/footer/Footer";
import ProviderProfileCard from "./components/profile/ProviderProfileCard";
import VerifyEmail from "./components/verifyEmail/VerifyEmail";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from "./components/login/ResetPassword";
// import IvrForm from "./components/dashboard/patient/IvrForm";
import DashboardWrapper from "./components/salesRepDashboard/DashboardWrapper";
import PrivateRoute from "./utils/privateRoutes";
import { AuthContext } from "./utils/auth";
import "./App.css";

function AppWrapper() {
  const location = useLocation();
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

  const { logout, user } = useContext(AuthContext);
  const warningTimeoutRef = useRef(null);
  const logoutTimeoutRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

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

  useEffect(() => {
    if (!user) return;

    const HIPAA_IDLE_TIMEOUT_MINUTES = 15;
    const WARNING_BEFORE_LOGOUT_SECONDS = 60;

    const warningDuration =
      1000 * 60 * HIPAA_IDLE_TIMEOUT_MINUTES -
      1000 * WARNING_BEFORE_LOGOUT_SECONDS;
    const logoutDuration = 1000 * 60 * HIPAA_IDLE_TIMEOUT_MINUTES;

    const logoutAndRedirect = () => {
      logout();
      window.location.href = "/login";
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

  return (
    <>
      <Toaster />
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen transition-colors duration-300">
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
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardWrapper />
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
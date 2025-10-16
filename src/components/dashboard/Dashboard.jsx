import React, { useState, useEffect, useContext } from "react";
import { PropagateLoader } from 'react-spinners';
import OrderManagement from "./orders/OrderManagement";
import Documents from "./documemts/Documents";
import Patients from "./patient/Patient";
import { IoChatbubblesOutline } from "react-icons/io5";
import ContactModal from "../contact/contactModal/ContactModal";
import { AuthContext } from "../../utils/auth"; // Import AuthContext

// --- Configuration Constants ---
const SPLASH_DURATION = 1000; // 1.0 second fixed duration
const FADE_OUT_TIME = 500;    // 0.5 seconds (matches the CSS transition duration)

const Dashboard = () => {
  // --- Context & State Hooks ---
  const { user } = useContext(AuthContext); // Get user for safety check
  const [openModal, setOpenModal] = useState(false);
  const [activationFilter, setActivationFilter] = useState("Activated");
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // --- Effect for Splash Screen Timer and Fade-out ---
  useEffect(() => {
    // 1. Timer to start the fade-out animation
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, SPLASH_DURATION);

    // 2. Timer to fully unmount the splash screen after the CSS transition completes
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_DURATION + FADE_OUT_TIME); 

    // Cleanup
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []); // Run only once on mount

  // -----------------------------------------------------
  // 1. CONDITIONAL RENDER: SAFETY/MFA CHECK
  // -----------------------------------------------------
  // If the user context is somehow null after passing PrivateRoute, show a safe loader
  // instead of crashing. This is a critical safety net against a white screen.
  if (!user) {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <PropagateLoader color={"#10B981"} loading={true} size={15} />
        </div>
    );
  }

  // -----------------------------------------------------
  // 2. CONDITIONAL RENDER: LOADING OVERLAY (Splash Screen)
  // -----------------------------------------------------
  if (showSplash) {
    return (
      <div 
        className={`
          fixed inset-0 
          bg-teal-200 dark:bg-teal-700 /* Updated dark background color for better contrast */
          z-50 
          flex flex-col items-center justify-center 
          transition-opacity duration-500 ease-in-out
          ${fadeOut ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <div className="text-white text-3xl font-extrabold flex flex-col items-center">
          
          {/* ProMed Health Plus Branding */}
          <h1 className="text-5xl font-bold mb-8 drop-shadow-lg text-white">ProMed Health <span className="text-teal-500">Plus</span></h1>
          
          {/* react-spinners Loader */}
          <div className="mb-10">
            <PropagateLoader 
              color={"#FFFFFF"} 
              loading={true}
              size={15}
              margin={5}
              speedMultiplier={0.8}
            />
          </div>
          
          <span className="tracking-wider text-xl text-white">Creating Your Dashboard...</span>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // 3. MAIN DASHBOARD CONTENT
  // -----------------------------------------------------
  return (
    <div className="flex-1 bg-white dark:bg-gray-900 pt-6">
      <div className="px-4 sm:px-6 ml-11 font-bold mb-6">
        <button
          onClick={() => setOpenModal(true)}
          className="
            bg-red-500 text-white 
            py-1.5 px-3 md:py-2 md:px-4 lg:py-3 lg:px-6 
            rounded-full shadow-lg 
            hover:bg-red-600 /* Adjusted hover color */
            transition duration-300 
            flex items-center text-sm /* Adjusted text size */
            font-semibold'
          "
        >
          <IoChatbubblesOutline className="text-lg mr-2" />
          Chat With Your Rep
        </button>
      </div>
      
      {/* Modal */}
      <ContactModal open={openModal} onClose={() => setOpenModal(false)} />

      <div
        className="px-4 sm:px-6 lg:px-12 grid gap-6
                grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      >
        <div className="h-full">
          <Patients activationFilter={activationFilter} setActivationFilter={setActivationFilter} />
          <h1>Patients</h1>
        </div>
        <div className="h-full">
          <Documents />
        </div>
        <div className="h-full">
          <OrderManagement activationFilter={activationFilter}/>
          <h1>Orders</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
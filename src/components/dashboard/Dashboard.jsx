import React, { useState, useEffect, useMemo } from "react";
import { PropagateLoader } from 'react-spinners'; // Imported for a clean animation
import OrderManagement from "./orders/OrderManagement";
import Documents from "./documemts/Documents";
import Patients from "./patient/Patient";
import { IoChatbubblesOutline } from "react-icons/io5";
import ContactModal from "../contact/contactModal/ContactModal";

// --- Configuration Constants ---
const MIN_DURATION = 4000; // 4 seconds
const MAX_DURATION = 10000; // 10 seconds
const FADE_OUT_TIME = 500; // 0.5 seconds (matches the CSS transition duration)

const Dashboard = () => {
  // --- State Hooks ---
  const [openModal, setOpenModal] = useState(false);
  const [activationFilter, setActivationFilter] = useState("Activated");
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // --- Memoized Random Duration ---
  // Calculates a stable random duration only once when the component mounts.
  const randomDuration = useMemo(() => {
    return Math.floor(Math.random() * (MAX_DURATION - MIN_DURATION + 1)) + MIN_DURATION;
  }, []);

  // --- Effect for Splash Screen Timer and Fade-out ---
  useEffect(() => {
    // 1. Timer to start the fade-out animation
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, randomDuration);

    // 2. Timer to fully unmount the splash screen after the CSS transition completes
    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, randomDuration + FADE_OUT_TIME); 

    // Cleanup: Clear timers on unmount to prevent memory leaks or state updates on unmounted component
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [randomDuration]); // Depend on randomDuration to ensure timers are set correctly

  // -----------------------------------------------------
  // 1. CONDITIONAL RENDER: LOADING OVERLAY
  // -----------------------------------------------------
  if (showSplash) {
    return (
      <div 
        className={`
          fixed inset-0 
          bg-teal-200 dark:bg-teal-300
          z-50 
          flex flex-col items-center justify-center 
          transition-opacity duration-500 ease-in-out /* Fade-out CSS */
          ${fadeOut ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <div className="text-white text-3xl font-extrabold flex flex-col items-center">
          
          {/* ProMed Health Plus Branding */}
          <h1 className="text-5xl font-bold mb-8 drop-shadow-lg">ProMed Health <span className="text-teal-500">Plus</span></h1>
          
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
          
          <span className="tracking-wider text-xl">Building Your Dashboard...</span>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // 2. MAIN DASHBOARD CONTENT
  // -----------------------------------------------------
  return (
    <div className="flex-1 bg-white dark:bg-gray-900">
      <div className="px-4 sm:px-6 ml-11 font-bold">
        <button
          onClick={() => setOpenModal(true)}
          className="
            bg-red-500 text-white 
            py-1.5 px-3 md:py-2 md:px-4 lg:py-3 lg:px-6 
            rounded-full shadow-lg 
            hover:bg-red-400 
            transition duration-300 
            flex items-center text-xs
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
        </div>
        <div className="h-full">
          <Documents />
        </div>
        <div className="h-full">
          <OrderManagement activationFilter={activationFilter}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
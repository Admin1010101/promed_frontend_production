import React, { useState, useEffect, useContext } from "react";
import Joyride, { STATUS, ACTIONS, EVENTS } from 'react-joyride';
import { AuthContext } from "../../utils/context/auth"; // ✅ ADDED IMPORT

const DashboardTour = () => {
  const { user, completeTour } = useContext(AuthContext);
  const [run, setRun] = useState(false);

  // Tour steps configuration
  const steps = [
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-teal-600 mb-2">
            Welcome to ProMed Health Plus! 🎉
          </h2>
          <p className="text-gray-700">
            Let's take a quick tour to help you get started with your dashboard.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="chat-button"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-teal-600 mb-2">
            Chat With Your Rep
          </h3>
          <p className="text-gray-700">
            Need help? Click here to contact your sales representative directly.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="patients-section"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-teal-600 mb-2">
            Patient Management
          </h3>
          <p className="text-gray-700">
            Add, edit, and manage all your patients here. You can also submit IVR forms for insurance verification.
          </p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="documents-section"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-teal-600 mb-2">
            Documents
          </h3>
          <p className="text-gray-700">
            Upload and manage important documents like prescriptions and medical records.
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="orders-section"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-teal-600 mb-2">
            Order Management
          </h3>
          <p className="text-gray-700">
            Create new orders and track order history for your patients.
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="profile-menu"]',
      content: (
        <div>
          <h3 className="text-lg font-bold text-teal-600 mb-2">
            Your Profile
          </h3>
          <p className="text-gray-700">
            Access your account settings, update your profile, and manage preferences here.
          </p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-teal-600 mb-2">
            You're All Set! 🚀
          </h2>
          <p className="text-gray-700">
            You can always restart this tour from your profile settings if needed.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  useEffect(() => {
    // Only run tour if user hasn't completed it
    if (user && !user.has_completed_tour) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleJoyrideCallback = async (data) => {
    const { status, type, action } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    // Tour completed or skipped
    if (finishedStatuses.includes(status)) {
      setRun(false);
      
      // Mark tour as completed in backend
      const result = await completeTour();
      if (result.success) {
        console.log('✅ Tour marked as completed');
      }
    }

    // User closed the tour
    if (action === ACTIONS.CLOSE || type === EVENTS.TOUR_END) {
      setRun(false);
      await completeTour();
    }
  };

  // Custom styles for the tour
  const styles = {
    options: {
      arrowColor: '#fff',
      backgroundColor: '#fff',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      primaryColor: '#14b8a6', // Teal color
      textColor: '#333',
      width: 400,
      zIndex: 10000,
    },
    tooltip: {
      borderRadius: '12px',
      padding: '20px',
    },
    tooltipContent: {
      padding: '10px 0',
    },
    buttonNext: {
      backgroundColor: '#14b8a6',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
    },
    buttonBack: {
      color: '#6b7280',
      marginRight: '10px',
    },
    buttonSkip: {
      color: '#6b7280',
    },
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      disableScrolling={false}
      callback={handleJoyrideCallback}
      styles={styles}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
};

export default DashboardTour;
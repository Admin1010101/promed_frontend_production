import React, { useContext, useState } from "react";
import { AuthContext } from "../../utils/context/auth";
import { FaRegEdit, FaRedo } from "react-icons/fa";
import { IoMailOutline, IoLocationOutline, IoCallOutline, IoCalendarOutline, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import axiosAuth from "../../utils/axios";
import ProviderProfileEdit from "./ProviderProfileEdit";
import { Modal, Box } from "@mui/material";
import toast from "react-hot-toast";

const ProviderProfileCard = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(user); 
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isResettingTour, setIsResettingTour] = useState(false); // ✅ NEW STATE

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async (updatedData) => {
    setSaving(true);
    setError(null);
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.put("/provider/profile/", updatedData);
      setProfile(response.data); 
      setIsEditing(false);
      toast.success('Profile edit is complete.');
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.detail || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ NEW FUNCTION: Restart Dashboard Tour
  const handleRestartTour = async () => {
    try {
      setIsResettingTour(true);
      
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.put("/provider/reset-tour/");
      
      if (response.data.success) {
        toast.success("Tour will restart when you return to the dashboard!", {
          duration: 2000,
          icon: "🎉"
        });
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard/";
        }, 1500);
      }
    } catch (error) {
      console.error("Error resetting tour:", error);
      toast.error("Failed to reset tour. Please try again.");
      setIsResettingTour(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-gray-400 dark:text-gray-600">
        Loading User Data...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-red-500">
        Profile not found.
      </div>
    );
  }
  
  const profileCreatedDate = profile.date_created ? new Date(profile.date_created).toLocaleDateString() : "N/A";
  
  const formatUSPhoneNumber = (number) => {
    if (!number || typeof number !== "string") return "N/A";
    const cleanNumber = number.replace(/\D/g, "");
    if (cleanNumber.length === 10) {
      return `(${cleanNumber.substring(0, 3)}) ${cleanNumber.substring(3, 6)}-${cleanNumber.substring(6, 10)}`;
    }
    if (cleanNumber.startsWith('1') && cleanNumber.length === 11) {
        return `+1 (${cleanNumber.substring(1, 4)}) ${cleanNumber.substring(4, 7)}-${cleanNumber.substring(7, 11)}`;
    }
    return number;
  };

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center text-sm mb-4">
      <Icon className="text-teal-400 mr-3 text-xl" />
      <span className="font-semibold text-gray-400 dark:text-gray-400 w-1/3 min-w-[150px]">
        {label}
      </span>
      <span className="text-white dark:text-gray-200 font-medium truncate">
        {value || "Not specified"}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Profile Card Container */}
      <div className="
        bg-gray-800/80 backdrop-blur-xl 
        shadow-2xl shadow-gray-900/50 
        rounded-2xl overflow-hidden 
        w-full max-w-2xl lg:max-w-3xl 
        mx-auto transition-all duration-500 
        border border-gray-700/50
      ">
        <div className="relative flex flex-col items-center p-8 sm:p-12">
          
          {/* Profile Image and Header */}
          <div className="relative">
             <img
                src={
                    profile.image && profile.image.startsWith("http")
                        ? profile.image
                        : profile.image 
                          ? `${process.env.REACT_APP_MEDIA_URL || ''}${profile.image}` 
                          : "https://promedheatlhdatastorage.blob.core.windows.net/static/images/default_user.jpg"
                }
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-teal-500 shadow-xl object-cover object-top transition-transform duration-500 hover:scale-105"
            />
            
            <button
                onClick={handleEdit}
                className="absolute bottom-0 right-0 p-3 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg transition-colors transform hover:scale-110"
                title="Edit Profile"
            >
                <FaRegEdit className="text-lg" />
            </button>
          </div>
          
          <h1 className="mt-6 text-3xl font-extrabold text-white">
            {profile.full_name || profile.user?.full_name || "New Provider"}
          </h1>
          <p className="text-md text-teal-400 font-medium mt-1">
            {profile.user?.email || "No Email"}
          </p>

          {/* Details Section */}
          <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <h2 className="col-span-full text-xl font-bold text-teal-400 mb-4 border-b border-gray-700 pb-2">
                Contact & Location
            </h2>
            
            <DetailItem 
                icon={IoLocationOutline} 
                label="Location" 
                value={`${profile.city || 'N/A'}, ${profile.country || 'N/A'}`} 
            />
            <DetailItem 
                icon={IoCallOutline} 
                label="Facility Phone" 
                value={formatUSPhoneNumber(profile.facility_phone_number)} 
            />
            <DetailItem 
                icon={IoMailOutline} 
                label="Primary Email" 
                value={profile.user?.email} 
            />
            <DetailItem 
                icon={IoCalendarOutline} 
                label="Date Joined" 
                value={profileCreatedDate} 
            />

            <h2 className="col-span-full text-xl font-bold text-teal-400 mt-6 mb-4 border-b border-gray-700 pb-2">
                Facility Details
            </h2>
            <DetailItem 
                icon={FaRegEdit} 
                label="Role" 
                value={profile.role} 
            />
            <DetailItem 
                icon={FaRegEdit} 
                label="Facility" 
                value={profile.facility} 
            />

            {/* ✅ NEW SECTION: Dashboard Tour */}
            <h2 className="col-span-full text-xl font-bold text-teal-400 mt-6 mb-4 border-b border-gray-700 pb-2">
                Dashboard Tour
            </h2>
            
            <div className="col-span-full">
              <div className="
                bg-gray-700/30 
                backdrop-blur-sm 
                rounded-xl 
                p-6 
                border border-gray-600/50
                transition-all duration-300
                hover:bg-gray-700/40
              ">
                <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-bold text-white">
                        Interactive Dashboard Tutorial
                      </h3>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">
                      Need a refresher on how to use the dashboard features?
                      Restart the guided tour to learn about patient management,
                      document uploads, and order tracking.
                    </p>
                    
                    <div className="flex items-center text-sm">
                      {user?.has_completed_tour ? (
                        <>
                          <IoCheckmarkCircle className="text-green-400 mr-2 text-lg" />
                          <span className="text-green-400 font-medium">
                            Tour completed
                          </span>
                        </>
                      ) : (
                        <>
                          <IoCloseCircle className="text-yellow-400 mr-2 text-lg" />
                          <span className="text-yellow-400 font-medium">
                            Tour not yet completed
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRestartTour}
                    disabled={isResettingTour}
                    className={`
                      px-6 py-3 
                      bg-gradient-to-r from-teal-500 to-teal-600 
                      hover:from-teal-600 hover:to-teal-700
                      text-white font-semibold rounded-xl 
                      shadow-lg hover:shadow-xl
                      transform hover:scale-105
                      transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      disabled:transform-none
                      flex items-center space-x-2
                      whitespace-nowrap
                    `}
                  >
                    {isResettingTour ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Restarting...</span>
                      </>
                    ) : (
                      <>
                        <FaRedo className="text-sm" />
                        <span>Restart Tour</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Modal for Editing */}
      <Modal open={isEditing} onClose={handleCancelEdit}>
        <Box 
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: '90%', sm: 600 },
            p: 0, 
            outline: 0, 
            bgcolor: 'transparent', 
            border: 'none',
          }}
        >
          <ProviderProfileEdit
            profile={profile}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            isLoading={saving}
            error={error}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default ProviderProfileCard;
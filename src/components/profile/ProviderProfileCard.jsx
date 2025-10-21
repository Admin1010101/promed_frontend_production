import React, { useContext, useState } from "react";
import { AuthContext } from "../../utils/context/auth";
import { FaRegEdit } from "react-icons/fa";
import { IoMailOutline, IoLocationOutline, IoCallOutline, IoCalendarOutline } from "react-icons/io5"; // Added icons
import axiosAuth from "../../utils/axios";
import ProviderProfileEdit from "./ProviderProfileEdit";
import { Modal, Box } from "@mui/material";
import toast from "react-hot-toast";

// Removed the 'style' object as we will use Tailwind classes and a central position.

const ProviderProfileCard = () => {
  const { user } = useContext(AuthContext);
  // Initialize with user data from context
  const [profile, setProfile] = useState(user); 
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
      // Update the local state with the new profile data
      setProfile(response.data); 
      setIsEditing(false);
      toast.success('Profile edit is complete.');
    } catch (err) {
      console.error("Failed to update profile:", err);
      // Check for specific error messages from the API if possible
      setError(err.response?.data?.detail || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
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
    // Handle E.164 format from PhoneNumberField
    if (cleanNumber.startsWith('1') && cleanNumber.length === 11) {
        return `+1 (${cleanNumber.substring(1, 4)}) ${cleanNumber.substring(4, 7)}-${cleanNumber.substring(7, 11)}`;
    }
    return number;
  };

  // Helper component for cleaner data display
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
      
      {/* Profile Card Container - Dark Glassmorphism Style */}
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
                          : "https://promedheatlhdatastorage.blob.core.windows.net/static/images/default_user.jpg" // Fallback to a fixed default
                }
                alt="Profile"
                className="w-36 h-36 rounded-full border-4 border-teal-500 shadow-xl object-cover object-top transition-transform duration-500 hover:scale-105"
            />
            
            {/* Edit Button overlay */}
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
            width: { xs: '90%', sm: 600 }, // Responsive width
            // We only need basic positioning here, the internal component handles the rest of the look
            p: 0, 
            outline: 0, 
            // Ensures the Box itself doesn't apply conflicting styles
            bgcolor: 'transparent', 
            border: 'none',
          }}
        >
          {/* ProviderProfileEdit already has the dark, animated look */}
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
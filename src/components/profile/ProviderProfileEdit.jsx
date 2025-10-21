import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment, 
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { 
    IoPersonOutline, 
    IoLocationOutline, 
    IoBusinessOutline, // ⬅️ CORRECTED ICON IMPORT
    IoCallOutline, 
    IoBriefcaseOutline 
} from "react-icons/io5"; 

// Map field names to their corresponding icons
const fieldIcons = {
  full_name: IoPersonOutline,
  city: IoLocationOutline,
  country: IoLocationOutline,
  role: IoBriefcaseOutline,
  facility: IoBusinessOutline, // ⬅️ CORRECTED ICON USAGE
  facility_phone_number: IoCallOutline,
};

const ProviderProfileEdit = ({
  profile,
  onSave,
  onCancel,
  isLoading,
  error,
}) => {
  const [formData, setFormData] = useState({
    full_name: "",
    city: "",
    country: "",
    role: "",
    facility: "",
    facility_phone_number: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        city: profile.city || "",
        country: profile.country || "",
        role: profile.role || "",
        facility: profile.facility || "",
        facility_phone_number: profile.facility_phone_number || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const boxVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={boxVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-900/90 backdrop-blur-lg p-8 sm:p-10 w-full max-w-xl mx-auto rounded-2xl shadow-2xl border border-gray-700/50"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: "100%", color: "white" }} 
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-8 border-b border-gray-700 pb-4">
          <Typography 
            variant="h4" 
            className="text-white font-bold"
            sx={{ 
                color: 'white', 
                fontWeight: 700 
            }}
          >
            Edit Profile Details
          </Typography>
          <IconButton 
            onClick={onCancel} 
            className="text-gray-400 hover:text-teal-400 transition-colors"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Error Message */}
        {error && (
          <Typography 
            color="error" 
            variant="body2" 
            className="bg-red-900/30 border border-red-700 rounded-lg p-3 mb-4 text-red-300"
          >
            {error}
          </Typography>
        )}

        {/* Form Fields Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
          {[
            { label: "Full Name", name: "full_name", required: true },
            { label: "Role", name: "role", required: false },
            { label: "Facility", name: "facility", required: true },
            { label: "Facility Phone", name: "facility_phone_number", required: false, type: 'tel' },
            { label: "City", name: "city", required: false },
            { label: "Country", name: "country", required: false },
          ].map(({ label, name, required, type = 'text' }) => {
            const IconComponent = fieldIcons[name];
            return (
              <TextField
                key={name}
                fullWidth
                label={label}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: 'transparent !important', 
                  },
                  "& .MuiInputLabel-root": {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                  "& .Mui-focused .MuiInputLabel-root": {
                    color: '#2DD4BF', // Tailwind Teal-400
                  },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconComponent className="text-gray-400" size={20} />
                        </InputAdornment>
                    ),
                }}
              />
            );
          })}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end", gap: 3 }}>
          <Button 
            onClick={onCancel} 
            variant="outlined" 
            className="text-gray-400 border-gray-700 hover:bg-gray-700 transition-all duration-300 rounded-xl"
            sx={{
                py: 1.5,
                px: 3,
                textTransform: 'none',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                }
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            className="py-1.5 px-6 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-300 disabled:opacity-50"
            sx={{
                textTransform: 'none',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                '&:hover': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                }
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProviderProfileEdit;
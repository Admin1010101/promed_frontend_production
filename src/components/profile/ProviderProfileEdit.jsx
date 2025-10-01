import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();

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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        bgcolor: theme.palette.mode === "dark" ? "grey.900" : "background.paper",
        color: theme.palette.text.primary,
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" gutterBottom color="text.primary">
          Edit Profile
        </Typography>
        <IconButton onClick={onCancel} sx={{ color: theme.palette.text.primary }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      {[
        { label: "Full Name", name: "full_name" },
        { label: "City", name: "city" },
        { label: "Country", name: "country" },
        { label: "Role", name: "role" },
        { label: "Facility", name: "facility" },
        { label: "Facility Phone Number", name: "facility_phone_number" },
      ].map(({ label, name }) => (
        <TextField
          key={name}
          fullWidth
          label={label}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          sx={{
            "& .MuiInputBase-root": {
              backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.background.paper,
              color: theme.palette.text.primary,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[400],
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.mode === "dark" ? theme.palette.grey[500] : theme.palette.primary.main,
            },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
            "& .MuiInputLabel-root": {
              color: theme.palette.text.secondary,
            },
          }}
        />
      ))}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={onCancel} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Save Changes"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ProviderProfileEdit;
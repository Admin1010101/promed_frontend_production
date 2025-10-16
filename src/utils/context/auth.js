import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import axiosAuth from "../axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (accessToken && storedUser) {
      try {
        const decodedToken = jwtDecode(accessToken);
        const parsedUser = JSON.parse(storedUser);
        const userWithRole = { ...parsedUser, role: decodedToken.role };
        setUser(userWithRole);
        localStorage.setItem("user", JSON.stringify(userWithRole));
      } catch (error) {
        console.error("Failed to decode token or parse user on reload:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const verifyToken = async (token) => {
    const axiosInstance = axiosAuth();
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/provider/profile/`  // Already has trailing slash ✓
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error verifying token:", error);
      return {
        success: false,
        error: error.response?.data || "Token verification failed",
      };
    }
  };

  const sendVerificationToken = async (method = "sms") => {
    const axiosInstance = axiosAuth();
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/send-code/`, {
        method,
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error sending verification token:", error);
      return {
        success: false,
        error: error.response?.data || "Failed to send verification token",
      };
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/provider/register/`,  // Already has trailing slash ✓
        formData
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Registration error:", error.response);
      return {
        success: false,
        error: error.response?.data || "Registration failed",
      };
    }
  };

  const login = async (email, password, method = "sms") => {
    try {
      console.log("=== LOGIN DEBUG ===");
      console.log("API URL:", `${API_BASE_URL}/provider/token/`);
      console.log("Email:", email);
      console.log("Password length:", password?.length);
      console.log("Method:", method);
      
      const response = await axios.post(
        `${API_BASE_URL}/provider/token/`,  // Already has trailing slash ✓
        {
          email: email.trim(),
          password: password,
          method: method,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response received:", response.status);
      console.log("Response data:", response.data);

      const { access, refresh, user: userData } = response.data;
      
      if (!access || !refresh) {
        console.error("Missing tokens in response:", response.data);
        return {
          success: false,
          error: "Invalid response from server - missing tokens",
        };
      }

      const decodedToken = jwtDecode(access);
      const userWithRole = { ...userData, role: decodedToken.role };

      if (response.data.mfa_required) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("session_id", response.data.session_id);
        localStorage.setItem("user", JSON.stringify(userWithRole));
        setUser(userWithRole);
        console.log("MFA required, redirecting to MFA page");
        return {
          mfa_required: true,
          session_id: response.data.session_id,
          detail: response.data.detail,
        };
      }

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(userWithRole));
      setUser(userWithRole);
      console.log("Login successful without MFA");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        url: error.config?.url,
        requestData: error.config?.data,
      });

      let errorMessage = "Login failed";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'object') {
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey])) {
            errorMessage = errorData[firstKey][0];
          } else if (firstKey) {
            errorMessage = errorData[firstKey];
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

const verifyCode = async (code, method = "sms") => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const session_id = localStorage.getItem("session_id");
      
      // The headers here should probably include the access token, as it was saved during login
      const response = await axios.post(
        `${API_BASE_URL}/verify-code/`,
        { code, session_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use the temporary token for verification
          },
        }
      );
      
      // 1. Get user data saved during login
      const userData = JSON.parse(localStorage.getItem("user"));
      const decodedToken = jwtDecode(accessToken);
      
      // 2. Build the final stable user object
      const userWithRole = {
        ...userData,
        // Assuming your backend sets a flag or you know they are verified now
        verified: true, 
        role: decodedToken.role,
      };
      
      // 3. Set Final State & Clean Up Temp Data
      localStorage.setItem("user", JSON.stringify(userWithRole));
      localStorage.removeItem("session_id"); // <-- CRITICAL: Clean up temp data
      setUser(userWithRole); // <-- This triggers the AppWrapper to render Dashboard

      return { success: true };
    } catch (error) {
      // ... (error handling)
    }
  };

  const getPatients = async () => {
    try {
      const axiosInstance = axiosAuth();
      const res = await axiosInstance.get(`${API_BASE_URL}/patient/patients/`);  // ADDED SLASH
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      return { success: false, error: error.response?.data || error };
    }
  };

  const postPatient = async (patientData) => {
    try {
      const axiosInstance = axiosAuth();
      const res = await axiosInstance.post(
        `${API_BASE_URL}/patient/patients/`,  // Already has trailing slash ✓
        patientData
      );
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Failed to add patient:", error);
      return {
        success: false,
        error: error.response?.data || {},
        message:
          error.response?.data?.detail ||
          error.message ||
          "Failed to add patient",
      };
    }
  };

  const updatePatient = async (id, patientData) => {
    try {
      const axiosInstance = axiosAuth();
      const res = await axiosInstance.put(
        `${API_BASE_URL}/patient/patients/${id}/`,  // ADDED SLASH
        patientData
      );
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Failed to update patient:", error);
      return {
        success: false,
        error: error.response?.data || error,
        message:
          error.response?.data?.detail ||
          error.message ||
          "Failed to update patient",
      };
    }
  };

  const deletePatient = async (patientId) => {
    try {
      const axiosInstance = axiosAuth();
      const res = await axiosInstance.delete(
        `${API_BASE_URL}/patient/patients/${patientId}/`  // ADDED SLASH
      );
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Failed to delete patient:", error);
      return {
        success: false,
        error:
          error.response?.data || error.message || "Failed to delete patient",
      };
    }
  };

  const getSalesRepDashboardData = async () => {
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.get(
        `${API_BASE_URL}/sales-rep/dashboard/`  // Already has trailing slash ✓
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      return {
        success: false,
        error: error.response?.data || "Failed to fetch dashboard data",
      };
    }
  };

  const uploadDocumentAndEmail = async (
    documentType,
    files,
    recipientEmail
  ) => {
    try {
      const axiosInstance = axiosAuth();
      const formData = new FormData();
      formData.append("document_type", documentType);
      formData.append("recipient_email", recipientEmail);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await axiosInstance.post(
        `${API_BASE_URL}/onboarding/documents/upload/`,  // Already has trailing slash ✓
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Failed to upload documents:", error);
      return {
        success: false,
        error: error.response?.data || "Failed to upload documents",
      };
    }
  };

  const getProviderForms = async () => {
    try {
      const axiosInstance = axiosAuth();
      const res = await axiosInstance.get(`${API_BASE_URL}/onboarding/forms/`);  // ADDED SLASH
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Failed to fetch provider forms:", error);
      return { success: false, error: error.response?.data || error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        getPatients,
        postPatient,
        setUser,
        register,
        sendVerificationToken,
        login,
        verifyCode,
        logout,
        verifyToken,
        updatePatient,
        deletePatient,
        getSalesRepDashboardData,
        uploadDocumentAndEmail,
        getProviderForms,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
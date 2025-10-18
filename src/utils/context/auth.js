import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import axiosAuth from "../axios"; 
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMfaPending, setIsMfaPending] = useState(false); 

  // --- Helper Functions ---

  const decodeAndSetUser = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const userDetails = {
        id: decodedToken.user_id,
        email: decodedToken.email,
        role: decodedToken.role,
      };
      setUser(userDetails);
      return userDetails;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const fetchUserData = async (token) => {
    try {
        const decodedToken = jwtDecode(token);
        
        const axiosInstance = axiosAuth(); 
        const response = await axiosInstance.get('/provider/profile/');
        
        const userDetails = {
            ...response.data, 
            role: decodedToken.role,
            id: decodedToken.user_id,
        };
        
        setUser(userDetails);
        return userDetails;
    } catch (error) {
        console.error("Failed to fetch user data or decode token:", error);
        throw error;
    }
  };

  const register = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/provider/register/`, formData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Registration error:", error.response);
      return {
        success: false,
        error: error.response?.data || "Registration failed",
      };
    }
  };

  const logout = () => {
    console.log("🚪 Logging out - clearing all tokens");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("session_id");
    setUser(null);
    setIsMfaPending(false);
  };

  // --- Initial Load Effect ---
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const session_id = localStorage.getItem("session_id"); 
    
    console.log("🔍 Initial Load Check:");
    console.log("  - Access Token exists:", !!accessToken);
    console.log("  - Session ID exists:", !!session_id);
    
    if (accessToken && !session_id) {
        console.log("✅ Valid session found, fetching user data");
        fetchUserData(accessToken)
            .catch((error) => {
                console.error("❌ Failed to fetch user data on load:", error);
                logout();
            })
            .finally(() => setLoading(false));
            
    } else if (session_id) {
        console.log("⏳ MFA session detected, waiting for code verification");
        setIsMfaPending(true); 
        setLoading(false);
    } else {
        console.log("ℹ️ No active session found");
        setLoading(false);
    }
  }, []);

  // --- API Functions ---

  const login = async (email, password, method = "sms") => {
    try {
      console.log("🔐 Login attempt for:", email);
      
      const response = await axios.post(
        `${API_BASE_URL}/provider/token/`,
        { email: email.trim(), password, method }
      );

      const { access, refresh, mfa_required, session_id } = response.data;

      if (!access || !refresh) {
        console.error("❌ Invalid response: missing tokens");
        return { success: false, error: "Invalid response: missing tokens." };
      }

      if (mfa_required) {
        console.log("🔒 MFA required, storing temporary tokens");
        localStorage.setItem("accessToken", access); 
        localStorage.setItem("session_id", session_id); 
        
        setIsMfaPending(true); 
        
        return { 
          mfa_required: true, 
          session_id, 
          detail: response.data.detail 
        };
      }

      console.log("✅ Login successful, storing tokens");
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      setIsMfaPending(false); 
      fetchUserData(access); 

      return { success: true };
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      
      let errorMessage = "Login failed. Please check your credentials and try again.";
      
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
        }
      }

      setIsMfaPending(false); 
      return { success: false, error: errorMessage };
    }
  };

  const verifyCode = async (code, method = "sms") => {
    try {
      const session_id = localStorage.getItem("session_id");
      const accessToken = localStorage.getItem("accessToken");
      
      console.log("🔍 MFA Verification:");
      console.log("  - Session ID exists:", !!session_id);
      console.log("  - Access Token exists:", !!accessToken);
      
      if (!session_id) {
        console.error("❌ No active MFA session found");
        return { success: false, error: "No active MFA session found" };
      }
      
      if (!accessToken) {
        console.error("❌ No access token found");
        return { success: false, error: "No access token found" };
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/verify-code/`,
        { code, session_id },
        { 
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      const { refresh: finalRefreshToken, access: newAccessToken } = response.data;

      if (finalRefreshToken) {
        localStorage.setItem("refreshToken", finalRefreshToken);
        console.log("✅ Refresh token saved");
      }
      
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        console.log("✅ Access token updated");
      }
      
      localStorage.removeItem("session_id");
      console.log("✅ Session ID removed");
      
      setIsMfaPending(false); 
      
      await fetchUserData(newAccessToken || localStorage.getItem("accessToken"));

      return { success: true };
    } catch (error) {
      console.error("❌ MFA verification error:", error.response?.data || error.message);
      logout(); 
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.detail || "MFA verification failed" 
      };
    }
  };

  // --- Patient Management Functions ---
  const getPatients = async () => {
    console.log("=== getPatients API Call ===");
    console.log("User:", user);
    console.log("Access Token exists:", !!localStorage.getItem("accessToken"));
    
    try {
      const axiosInstance = axiosAuth();
      console.log("Sending GET request to: /patients/");
      
      const response = await axiosInstance.get('/patients/');
      
      console.log("✅ Response Status:", response.status);
      console.log("✅ Response Data:", response.data);
      console.log("✅ Is Array:", Array.isArray(response.data));
      console.log("✅ Data Length:", response.data?.length);
      
      if (!Array.isArray(response.data)) {
        console.error("❌ Response data is not an array");
        return { 
          success: false, 
          error: "Invalid response format from server" 
        };
      }
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error("=== getPatients ERROR ===");
      console.error("Full Error:", error);
      console.error("Response Status:", error.response?.status);
      console.error("Response Data:", error.response?.data);
      console.error("Response Headers:", error.response?.headers);
      console.error("Request Config:", error.config);
      
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status 
      };
    }
  };

  const postPatient = async (patientData) => {
    console.log("=== postPatient API Call ===");
    console.log("🔍 Patient Data:", patientData);
    
    const accessToken = localStorage.getItem("accessToken");
    const sessionId = localStorage.getItem("session_id");
    
    console.log("🔍 Auth State:");
    console.log("  - Access Token exists:", !!accessToken);
    console.log("  - Session ID exists:", !!sessionId);
    console.log("  - User exists:", !!user);
    console.log("  - Is MFA Pending:", isMfaPending);
    
    // Check if user is in MFA pending state
    if (sessionId || isMfaPending) {
      console.error("❌ Cannot create patient: MFA verification pending");
      return { 
        success: false, 
        error: "Please complete MFA verification before creating patients" 
      };
    }
    
    // Check if access token exists
    if (!accessToken) {
      console.error("❌ Cannot create patient: No access token found");
      return { 
        success: false, 
        error: "Authentication required. Please log in again." 
      };
    }
    
    try {
      const axiosInstance = axiosAuth();
      console.log("✅ Axios instance created");
      console.log("🚀 Sending POST request to: /patients/");
      
      const response = await axiosInstance.post('/patients/', patientData);
      
      console.log("✅ Patient created successfully!");
      console.log("✅ Response:", response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error("=== postPatient ERROR ===");
      console.error("❌ Full Error:", error);
      console.error("❌ Response Status:", error.response?.status);
      console.error("❌ Response Data:", error.response?.data);
      console.error("❌ Response Headers:", error.response?.headers);
      console.error("❌ Request Config:", error.config);
      
      // If 401, might need to re-login
      if (error.response?.status === 401) {
        console.error("🚨 401 Unauthorized - Token might be invalid or expired");
        console.error("🚨 Consider logging out and logging back in");
      }
      
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status
      };
    }
  };

  const updatePatient = async (patientId, patientData) => {
    console.log("=== updatePatient API Call ===");
    console.log("🔍 Patient ID:", patientId);
    console.log("🔍 Patient Data:", patientData);
    
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.put(`/patients/${patientId}/`, patientData);
      
      console.log("✅ Patient updated successfully!");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Failed to update patient:", error);
      console.error("❌ Response:", error.response?.data);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const deletePatient = async (patientId) => {
    console.log("=== deletePatient API Call ===");
    console.log("🔍 Patient ID:", patientId);
    
    try {
      const axiosInstance = axiosAuth();
      await axiosInstance.delete(`/patients/${patientId}/`);
      
      console.log("✅ Patient deleted successfully!");
      return { success: true };
    } catch (error) {
      console.error("❌ Failed to delete patient:", error);
      console.error("❌ Response:", error.response?.data);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  // --- Document Upload Function ---
  const uploadDocumentAndEmail = async (documentType, files) => {
    console.log("=== uploadDocumentAndEmail API Call ===");
    console.log("🔍 Document Type:", documentType);
    console.log("🔍 Files Count:", files.length);
    
    try {
      const axiosInstance = axiosAuth();
      
      // Create FormData to send files
      const formData = new FormData();
      formData.append('document_type', documentType);
      
      // Append all files
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axiosInstance.post(
        '/onboarding_ops/documents/upload/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("✅ Documents uploaded successfully!");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Failed to upload documents:", error);
      console.error("❌ Response:", error.response?.data);
      return { 
        success: false, 
        error: error.response?.data || error.message 
      };
    }
  };

  console.log("=== AUTH STATE ===");
  console.log("Access Token:", localStorage.getItem("accessToken"));
  console.log("Refresh Token:", localStorage.getItem("refreshToken"));
  console.log("Session ID:", localStorage.getItem("session_id"));

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isMfaPending,
        register,
        logout,
        login,
        verifyCode,
        getPatients,
        postPatient,
        updatePatient,
        deletePatient,
        uploadDocumentAndEmail,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
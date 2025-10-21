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
    localStorage.removeItem("mfa_method"); // ✅ Clear MFA method too
    setUser(null);
    setIsMfaPending(false);
  };

  // ✅ NEW: Clear MFA state completely
  const clearMfaState = () => {
    console.log("🧹 Clearing MFA state");
    localStorage.removeItem("session_id");
    localStorage.removeItem("mfa_method");
    setIsMfaPending(false);
  };

  // --- Initial Load Effect ---
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const session_id = localStorage.getItem("session_id");
    
    console.log("🔍 Initial Load Check:");
    console.log("  - Access Token exists:", !!accessToken);
    console.log("  - Refresh Token exists:", !!refreshToken);
    console.log("  - Session ID exists:", !!session_id);
    
    // ✅ FIX: Only show MFA if we have session_id AND no refresh token
    if (session_id && !refreshToken) {
        console.log("⏳ MFA session detected, waiting for code verification");
        setIsMfaPending(true);
        setLoading(false);
    } else if (accessToken && refreshToken) {
        console.log("✅ Valid session found, fetching user data");
        fetchUserData(accessToken)
            .catch((error) => {
                console.error("❌ Failed to fetch user data on load:", error);
                logout();
            })
            .finally(() => setLoading(false));
    } else {
        console.log("ℹ️ No active session found");
        // ✅ FIX: Clear any stale MFA state
        if (session_id) {
          clearMfaState();
        }
        setLoading(false);
    }
  }, []);

  // --- API Functions ---

  const login = async (email, password, method = "sms") => {
    try {
      console.log("🔐 Login attempt for:", email, "Method:", method);
      
      const response = await axios.post(
        `${API_BASE_URL}/provider/token/`,
        { email: email.trim(), password, method }
      );

      const { access, refresh, mfa_required, session_id } = response.data;

      if (!access) {
        console.error("❌ Invalid response: missing access token");
        return { success: false, error: "Invalid response: missing tokens." };
      }

      if (mfa_required) {
        console.log("🔒 MFA required, storing temporary tokens");
        localStorage.setItem("accessToken", access);
        localStorage.setItem("session_id", session_id);
        localStorage.setItem("mfa_method", method); // ✅ Store method for reference
        
        setIsMfaPending(true);
        
        return { 
          mfa_required: true, 
          session_id, 
          detail: response.data.detail 
        };
      }

      // ✅ FIX: If no MFA required, ensure we have refresh token
      if (!refresh) {
        console.error("❌ No refresh token provided");
        return { success: false, error: "Invalid response: missing refresh token." };
      }

      console.log("✅ Login successful, storing tokens");
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      clearMfaState(); // ✅ Clear any MFA state
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

      clearMfaState(); // ✅ Clear MFA state on error
      return { success: false, error: errorMessage };
    }
  };

  const verifyCode = async (code, method = "sms") => {
    try {
      const session_id = localStorage.getItem("session_id");
      const accessToken = localStorage.getItem("accessToken");
      const storedMethod = localStorage.getItem("mfa_method") || method;
      
      console.log("🔍 MFA Verification:");
      console.log("  - Session ID exists:", !!session_id);
      console.log("  - Access Token exists:", !!accessToken);
      console.log("  - Method:", storedMethod);
      console.log("  - Code:", code);
      
      if (!session_id) {
        console.error("❌ No active MFA session found");
        clearMfaState();
        return { success: false, error: "No active MFA session found. Please log in again." };
      }
      
      if (!accessToken) {
        console.error("❌ No access token found");
        clearMfaState();
        return { success: false, error: "No access token found. Please log in again." };
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

      if (!finalRefreshToken || !newAccessToken) {
        console.error("❌ Missing tokens in verification response");
        clearMfaState();
        return { success: false, error: "Verification failed. Please try again." };
      }

      // ✅ Save both tokens
      localStorage.setItem("refreshToken", finalRefreshToken);
      localStorage.setItem("accessToken", newAccessToken);
      console.log("✅ Tokens saved successfully");
      
      // ✅ Clear MFA state
      clearMfaState();
      
      await fetchUserData(newAccessToken);

      return { success: true };
    } catch (error) {
      console.error("❌ MFA verification error:", error.response?.data || error.message);
      
      // ✅ FIX: Don't logout, just clear MFA state and let user try again
      clearMfaState();
      
      let errorMessage = "Invalid verification code. Please try again.";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  // --- Patient Management Functions ---
  const getPatients = async () => {
    console.log("=== getPatients API Call ===");
    
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.get('/patients/');
      
      if (!Array.isArray(response.data)) {
        console.error("❌ Response data is not an array");
        return { 
          success: false, 
          error: "Invalid response format from server" 
        };
      }
      
      return { success: true, data: response.data };
      
    } catch (error) {
      console.error("=== getPatients ERROR ===", error);
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status 
      };
    }
  };

  const postPatient = async (patientData) => {
    const sessionId = localStorage.getItem("session_id");
    
    // Check if user is in MFA pending state
    if (sessionId || isMfaPending) {
      return { 
        success: false, 
        error: "Please complete MFA verification before creating patients" 
      };
    }
    
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.post('/patients/', patientData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("❌ Failed to create patient:", error);
      return { 
        success: false, 
        error: error.response?.data || error.message,
        status: error.response?.status
      };
    }
  };

  const updatePatient = async (patientId, patientData) => {
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.put(`/patients/${patientId}/`, patientData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const deletePatient = async (patientId) => {
    try {
      const axiosInstance = axiosAuth();
      await axiosInstance.delete(`/patients/${patientId}/`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const uploadDocumentAndEmail = async (documentType, files) => {
    try {
      const axiosInstance = axiosAuth();
      
      const formData = new FormData();
      formData.append('document_type', documentType);
      
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

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || error.message 
      };
    }
  };

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
        clearMfaState, // ✅ Export this for manual clearing if needed
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
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

  // Decodes the token and sets basic user details (used internally)
  const decodeAndSetUser = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const userDetails = {
        id: decodedToken.user_id,
        email: decodedToken.email,
        role: decodedToken.role,
      };
      // We set partial user details here just to get the role/ID, 
      // but the full profile is fetched by fetchUserData.
      // This is safe because fetchUserData is called immediately after a successful action.
      setUser(userDetails);
      return userDetails;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  // Fetches detailed user profile data after token verification/login
  const fetchUserData = async (token) => {
    try {
        const decodedToken = jwtDecode(token);
        
        const axiosInstance = axiosAuth(); 
        const response = await axiosInstance.get(`${API_BASE_URL}/provider/profile/`);
        
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

  const logout = () => {
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
    
    if (accessToken && !session_id) {
        // Only fetch user data if we have an access token and NO pending MFA session
        fetchUserData(accessToken)
            .catch(() => logout())
            .finally(() => setLoading(false));
            
    } else if (session_id) {
        setIsMfaPending(true); 
        setLoading(false);
    } else {
        setLoading(false);
    }
  }, []);

  // --- API Functions ---

  const login = async (email, password, method = "sms") => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/provider/token/`,
        { email: email.trim(), password, method }
      );

      const { access, refresh, mfa_required, session_id } = response.data;

      if (!access || !refresh) {
        return { success: false, error: "Invalid response: missing tokens." };
      }

      if (mfa_required) {
        // MFA REQUIRED: Store temp access token and session_id
        localStorage.setItem("accessToken", access); 
        localStorage.setItem("session_id", session_id); 
        
        setIsMfaPending(true); 
        
        return { 
          mfa_required: true, 
          session_id, 
          detail: response.data.detail 
        };
      }

      // SUCCESS (No MFA): Save final state and tokens
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      setIsMfaPending(false); 
      fetchUserData(access); 

      return { success: true };
    } catch (error) {
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
      
      if (!session_id) {
        return { success: false, error: "No active MFA session found" };
      }
      
      if (!accessToken) {
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
      
      // ✅ FIX: Get both tokens from the response
      const { refresh: finalRefreshToken, access: newAccessToken } = response.data;

      // ✅ FIX: Update both tokens in localStorage
      if (finalRefreshToken) {
        localStorage.setItem("refreshToken", finalRefreshToken);
      }
      
      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
      }
      
      // Clean up session_id
      localStorage.removeItem("session_id"); 
      
      setIsMfaPending(false); 
      
      // ✅ FIX: Fetch user data with the new access token
      await fetchUserData(newAccessToken || localStorage.getItem("accessToken"));

      return { success: true };
    } catch (error) {
      console.error("MFA verification error:", error);
      logout(); 
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.detail || "MFA verification failed" 
      };
    }
  };


  // --- Patient Management Functions ---
  const getPatients = async () => {
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.get(`${API_BASE_URL}/provider/patients/`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const postPatient = async (patientData) => {
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.post(`${API_BASE_URL}/provider/patients/`, patientData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Failed to create patient:", error);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const updatePatient = async (patientId, patientData) => {
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.put(`${API_BASE_URL}/provider/patients/${patientId}/`, patientData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Failed to update patient:", error);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const deletePatient = async (patientId) => {
    try {
      const axiosInstance = axiosAuth();
      await axiosInstance.delete(`${API_BASE_URL}/provider/patients/${patientId}/`);
      return { success: true };
    } catch (error) {
      console.error("Failed to delete patient:", error);
      return { success: false, error: error.response?.data || error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isMfaPending,
        logout,
        login,
        verifyCode,
        getPatients,
        postPatient,
        updatePatient,
        deletePatient,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
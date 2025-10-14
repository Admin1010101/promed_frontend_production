import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "./constants";
import axiosAuth from "./axios";
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
        // Combine the stored user data with the role from the decoded token
        const userWithRole = { ...parsedUser, role: decodedToken.role };
        setUser(userWithRole);
        localStorage.setItem("user", JSON.stringify(userWithRole));
      } catch (error) {
        console.error("Failed to decode token or parse user on reload:", error);
        logout();
      }
    }
    setLoading(false); // Mark loading as complete after the checks
  }, []);

  const verifyToken = async (token) => {
    const axiosInstance = axiosAuth();
    try {
      const response = await axiosInstance.get(
        `${API_BASE_URL}/provider/profile/`
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
  
  // Adjusted `register` function to accept a single object as an argument.
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

  const login = async (email, password, method = "sms") => {

    try {
      const response = await axios.post(`${API_BASE_URL}/provider/token/`, {
        email,
        password,
        method,
      });
      console.log('response from login: ', login)
      
      const { access, refresh, user: userData } = response.data;
      const decodedToken = jwtDecode(access);
      const userWithRole = { ...userData, role: decodedToken.role };

      if (response.data.mfa_required) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("session_id", response.data.session_id);
        localStorage.setItem("user", JSON.stringify(userWithRole));
        setUser(userWithRole);
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
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  const verifyCode = async (code, method = "sms") => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const session_id = localStorage.getItem("session_id");
      const response = await axios.post(
        `${API_BASE_URL}/verify-code/`,
        { code, session_id, method },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const userData = JSON.parse(localStorage.getItem("user"));
      const decodedToken = jwtDecode(accessToken);
      const userWithRole = {
        ...userData,
        verified: true,
        role: decodedToken.role,
      };
      localStorage.setItem("user", JSON.stringify(userWithRole));
      setUser(userWithRole);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Verification failed",
      };
    }
  };
  
  // All other functions remain the same...
  const getPatients = async () => {
    try {
      const axiosInstance = axiosAuth();
      const res = await axiosInstance.get(`${API_BASE_URL}/patient/patients/`);
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
        `${API_BASE_URL}/patient/patients/`,
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
        `${API_BASE_URL}/patient/patients/${id}/`,
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
        `${API_BASE_URL}/patient/patients/${patientId}/`
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
        `${API_BASE_URL}/sales-rep/dashboard/`
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

      // Append each file to the FormData object
      files.forEach((file) => {
        formData.append("files", file); // Use 'files' as the field name
      });

      const res = await axiosInstance.post(
        `${API_BASE_URL}/onboarding/documents/upload/`,
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
      const res = await axiosInstance.get(`${API_BASE_URL}/onboarding/forms/`);
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
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import axiosAuth from "../axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // --- State Initialization ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMfaPending, setIsMfaPending] = useState(false);
  // 🔑 State for BAA enforcement (the high-priority lock)
  const [isBAARequired, setIsBAARequired] = useState(false);

  // --- Helper Functions ---

  const fetchUserData = async (token) => {
    try {
      const decodedToken = jwtDecode(token);

      const axiosInstance = axiosAuth();
      const response = await axiosInstance.get("/provider/profile/");

      const userDetails = {
        ...response.data.user,
        ...response.data,
        role: decodedToken.role,
        id: decodedToken.user_id,
        // Ensure BAA status is updated in the state
        has_signed_baa: response.data.user.has_signed_baa,
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
      const response = await axios.post(
        `${API_BASE_URL}/provider/register/`,
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

  const logout = () => {
    console.log("🚪 Logging out - clearing all tokens");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("session_id");
    localStorage.removeItem("mfa_method");
    setUser(null);
    setIsMfaPending(false);
    setIsBAARequired(false); // Clear BAA state
  };

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

    // Check if user was previously redirected to BAA page and has a temp token
    const baaRequiredStatus =
      sessionStorage.getItem("isBAARequired") === "true";

    // Priority 1: Check for MFA pending session
    if (session_id && !refreshToken) {
      setIsMfaPending(true);
      setLoading(false);
      // Priority 2: Check for BAA pending session
    } else if (baaRequiredStatus && accessToken && !refreshToken) {
      setIsBAARequired(true);
      setLoading(false);
      // Priority 3: Full session check
    } else if (accessToken && refreshToken) {
      fetchUserData(accessToken)
        .catch((error) => {
          console.error("❌ Failed to fetch user data on load:", error);
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      // No session
      if (session_id) clearMfaState();
      if (baaRequiredStatus) sessionStorage.removeItem("isBAARequired");
      setLoading(false);
    }
  }, []);

  // --- Core Auth API Functions ---

  const login = async (email, password, method = "sms") => {
    try {
      const response = await axios.post(`${API_BASE_URL}/provider/token/`, {
        email: email.trim(),
        password,
        method,
      });

      const { access, refresh, mfa_required, session_id } = response.data;

      // 1. Handle successful login with MFA requirement
      if (mfa_required) {
        localStorage.setItem("accessToken", access);
        localStorage.setItem("session_id", session_id);
        localStorage.setItem("mfa_method", method);
        setIsMfaPending(true);
        return { mfa_required: true, session_id, detail: response.data.detail };
      }

      // 2. Handle successful login (no BAA/MFA required)
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      clearMfaState();
      await fetchUserData(access);
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;

      // 🔑 Handle BAA Required (403 FORBIDDEN response) - Starts BAA Flow
      if (error.response?.status === 403 && errorData?.baa_required) {
        toast.error("Mandatory BAA agreement required.");

        localStorage.setItem("accessToken", errorData.access); // Temporary token
        sessionStorage.setItem("isBAARequired", "true");

        setUser(errorData.user);
        setIsBAARequired(true);
        clearMfaState();

        return { baa_required: true, user: errorData.user };
      }
      // --- Standard Error Parsing ---
      let errorMessage =
        "Login failed. Please check your credentials and try again.";
      // ... (Error parsing logic) ...

      clearMfaState();
      return { success: false, error: errorMessage };
    }
  };

  // 🚀 BAA SIGNING: Clears BAA lock and starts MFA session
  const signBAA = async (baaFormData) => {
    try {
      const axiosInstance = axiosAuth(); // Uses the temporary BAA access token
      const response = await axiosInstance.put(
        `${API_BASE_URL}/provider/sign-baa/`,
        baaFormData
      );

      const { access, session_id, mfa_required, detail } = response.data;

      if (!mfa_required || !session_id) {
        throw new Error("BAA signed, but the server failed to initiate MFA.");
      }

      toast.success("BAA signed! Verification code sent.");

      // 1. Clear BAA lock state
      setIsBAARequired(false);
      sessionStorage.removeItem("isBAARequired");

      // 2. Set MFA state for router to redirect to /mfa
      localStorage.setItem("accessToken", access);
      localStorage.setItem("session_id", session_id);
      localStorage.setItem("mfa_method", response.data.method || "email"); // ✅ Changed from "sms" to "email"
      setIsMfaPending(true);

      return { success: true, mfa_required: true, detail };
    } catch (error) {
      console.error(
        "❌ Failed to sign BAA:",
        error.response?.data || error.message
      );
      toast.error("Failed to sign BAA. Please log in again.");

      // Clear all session state if the token failed during submission
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }

      return {
        success: false,
        error: error.response?.data || "Failed to sign BAA",
      };
    }
  };

  const verifyCode = async (code, method = "sms") => {
    try {
      const session_id = localStorage.getItem("session_id");
      const accessToken = localStorage.getItem("accessToken");

      if (!session_id || !accessToken) {
        console.error("❌ No active MFA session found");
        clearMfaState();
        return {
          success: false,
          error: "No active MFA session found. Please log in again.",
        };
      }

      const response = await axios.post(
        `${API_BASE_URL}/verify-code/`,
        { code, session_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { refresh: finalRefreshToken, access: newAccessToken } =
        response.data;

      if (!finalRefreshToken || !newAccessToken) {
        console.error("❌ Missing tokens in verification response");
        clearMfaState();
        return {
          success: false,
          error: "Verification failed. Please try again.",
        };
      }

      // Final tokens stored, authentication complete
      localStorage.setItem("refreshToken", finalRefreshToken);
      localStorage.setItem("accessToken", newAccessToken);

      clearMfaState();

      // ✅ CRITICAL FIX: Don't proceed if user data fetch fails
      try {
        await fetchUserData(newAccessToken);
      } catch (fetchError) {
        console.error("❌ Failed to fetch user data after MFA:", fetchError);
        // ❌ Remove the "continue anyway" logic
        logout(); // Clear everything
        return {
          success: false,
          error: "Failed to load user data. Please log in again.",
        };
      }

      return { success: true };
    } catch (error) {
      console.error(
        "❌ MFA verification error:",
        error.response?.data || error.message
      );

      let errorMessage = "Invalid verification code. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        return {
          success: false,
          error: "Session expired. Please log in again.",
        };
      }

      return { success: false, error: errorMessage };
    }
  };

  // --- Patient/Document API Functions ---

  const getPatients = async () => {
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.get("/patients/");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const postPatient = async (patientData) => {
    if (isMfaPending || isBAARequired) {
      return { success: false, error: "Access pending mandatory steps." };
    }
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.post("/patients/", patientData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  };

  const updatePatient = async (patientId, patientData) => {
    try {
      const axiosInstance = axiosAuth();
      const response = await axiosInstance.put(
        `/patients/${patientId}/`,
        patientData
      );
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
      formData.append("document_type", documentType);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosInstance.post(
        "/onboarding_ops/documents/upload/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  };

  // --- Provider Return ---

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isMfaPending,
        isBAARequired, // Key state for router guard
        register,
        logout,
        login,
        verifyCode,
        signBAA, // Key function for optimal flow
        clearMfaState,
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

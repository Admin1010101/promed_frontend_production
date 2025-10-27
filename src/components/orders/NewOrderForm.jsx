import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
} from "@mui/material";
import { AuthContext } from "../../utils/context/auth";
import { useFilter } from "../../utils/context/FilterContext";
import OrderItem from "./OrderItem";
import OrderSummary from "./OrderSummary";
import toast from "react-hot-toast";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const parseVariantSize = (sizeStr) => {
  if (!sizeStr) return 0;
  try {
    const match = sizeStr.match(
      /(\d+(?:\.\d+)?)\s*[x×X]\s*(\d+(?:\.\d+)?)\s*(mm|cm)?/i
    );
    if (!match) return 0;

    let length = parseFloat(match[1]);
    let width = parseFloat(match[2]);
    const unit = match[3]?.toLowerCase() || "cm";

    if (isNaN(length) || isNaN(width)) return 0;

    if (unit === "mm") {
      length = length / 10;
      width = width / 10;
    }

    return length * width;
  } catch (error) {
    console.error("Error parsing size:", sizeStr, error);
    return 0;
  }
};

const ConfirmationModal = ({ open, onClose, onConfirm }) => (
  <Modal open={open} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: 400,
        borderRadius: "16px",
        boxShadow: 24,
        p: 4,
      }}
      className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-colors duration-300"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Confirm Order Submission
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm">
        Are you certain you want to submit this order? Once submitted, the order
        is sent to the fulfillment team for immediate processing.
      </p>
      <div className="flex justify-end space-x-3">
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "gray",
            borderColor: "gray",
            fontSize: "12px",
            fontWeight: 500,
            "&:hover": {
              borderColor: "gray.dark",
            },
            ".dark &": {
              color: "#9ca3af",
              borderColor: "#4b5563",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: "#008080",
            fontSize: "12px",
            "&:hover": {
              bgcolor: "#66CDAA",
            },
          }}
        >
          Yes, Submit Order
        </Button>
      </div>
    </Box>
  </Modal>
);

const NewOrderForm = ({ open, onClose, patient }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const { user, logout } = useContext(AuthContext);
  const { triggerOrderRefresh } = useFilter();
  const [itemsData, setItemsData] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    providerName: "",
    facilityName: "",
    providerPhoneNumber: "",
    providerAddress: "",
    patientName: "",
    patientDob: "",
    patientPhoneNumber: "",
    patientAddress: "",
    patientCountry: "United States",
    deliveryDate: null,
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const safeFormatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch (e) {
      console.error("Date format error:", e, dateStr);
      return "";
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Authentication token not found.");

      const apiUrl =
        "https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1/products/";

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(`Failed to fetch products. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format from server");
      }

      setItemsData(data);
    } catch (err) {
      console.error("❌ Product fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleItemVariantChange = (productId, variantsArray) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: Array.isArray(variantsArray) ? variantsArray : [],
    }));
  };

  const calculateTotalArea = () => {
    let total = 0;
    Object.entries(selectedVariants).forEach(([productId, variants]) => {
      if (!Array.isArray(variants)) return;
      const item = itemsData.find((i) => i.id === parseInt(productId));
      if (!item) return;

      variants.forEach(({ variantId, quantity }) => {
        const variant = item.variants.find((v) => v.id === parseInt(variantId));
        if (variant && quantity > 0) {
          const area = parseVariantSize(variant.size);
          total += area * quantity;
        }
      });
    });
    return total;
  };

  const total = Object.entries(selectedVariants).reduce(
    (sum, [productId, variants]) => {
      if (!Array.isArray(variants)) return sum;
      const item = itemsData.find((i) => i.id === parseInt(productId));
      if (!item) return sum;
      for (const { variantId, quantity } of variants) {
        const variant = item.variants.find((v) => v.id === parseInt(variantId));
        if (variant && quantity > 0) {
          sum += variant.price * quantity;
        }
      }
      return sum;
    },
    0
  );

  const woundLength = parseFloat(patient?.wound_size_length) || 0;
  const woundWidth = parseFloat(patient?.wound_size_width) || 0;
  const woundArea = woundLength * woundWidth;
  const maxAllowedArea = woundArea * 1.2;
  const currentTotalArea = calculateTotalArea();

  const handlePlaceOrderClick = () => {
    const orderItems = [];
    Object.entries(selectedVariants).forEach(([productId, variants]) => {
      variants.forEach(({ variantId, quantity }) => {
        if (quantity > 0) {
          orderItems.push({
            product: parseInt(productId),
            variant: parseInt(variantId),
            quantity,
          });
        }
      });
    });

    if (orderItems.length === 0 || total <= 0) {
      toast.error("Please select at least one item and variant with quantity.");
      return;
    }

    if (currentTotalArea > maxAllowedArea) {
      toast.error(
        `Total area (${currentTotalArea.toFixed(
          1
        )} cm²) exceeds maximum allowed (${maxAllowedArea.toFixed(1)} cm²)`
      );
      return;
    }

    setOpenConfirmModal(true);
  };

  const handleFinalOrderSubmission = async () => {
    setOpenConfirmModal(false);
    setLoading(true);

    const orderItems = [];
    Object.entries(selectedVariants).forEach(([productId, variants]) => {
      variants.forEach(({ variantId, quantity }) => {
        if (quantity > 0) {
          orderItems.push({
            product: parseInt(productId),
            variant: parseInt(variantId),
            quantity,
          });
        }
      });
    });

    let deliveryDateStr = null;
    if (
      formData.deliveryDate instanceof Date &&
      !isNaN(formData.deliveryDate)
    ) {
      deliveryDateStr = formData.deliveryDate.toISOString().split("T")[0];
    }

    const orderPayload = {
      provider: user.id,
      patient: patient.id,
      total_price: parseFloat(total.toFixed(2)),
      facility_name: formData.facilityName,
      phone_number: formData.providerPhoneNumber,
      street: formData.providerAddress,
      city: patient.city,
      zip_code: patient.zip_code,
      country: formData.patientCountry,
      items: orderItems,
      delivery_date: deliveryDateStr,
      order_verified: true,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        "https://promedhealth-frontdoor-h4c4bkcxfkduezec.z02.azurefd.net/api/v1/orders/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(orderPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || errorData.error || "Failed to place order."
        );
      }

      const responseData = await response.json();
      console.log("✅ Order created successfully:", responseData);

      triggerOrderRefresh();

      toast.success("Order confirmed and submitted successfully!");
      
      onClose();
      setStep(1);
      setSelectedVariants({});
      
    } catch (err) {
      console.error("❌ Order submission error:", err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user && patient) {
      setFormData({
        providerName: user?.full_name || "",
        facilityName: user?.facility || "",
        providerPhoneNumber: user?.phone_number || "",
        providerAddress: user?.street || "",
        patientName: `${patient?.first_name || ""} ${
          patient?.last_name || ""
        }`.trim(),
        patientDob: safeFormatDate(patient?.date_of_birth),
        patientPhoneNumber: patient?.phone_number || "",
        patientAddress: [
          patient?.address,
          patient?.city,
          patient?.state,
          patient?.zip_code,
        ]
          .filter(Boolean)
          .join(", "),
        patientCountry: patient?.country || "United States",
        deliveryDate: null,
      });

      fetchProducts();
    }
  }, [open, user, patient]);

  const commonInputSx = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#d1d5db" },
      "&:hover fieldset": { borderColor: "primary.main" },
      "&.Mui-focused fieldset": { borderColor: "primary.main" },
    },
    "& .MuiInputLabel-root": { color: "#6b7280" },
    ".dark & .MuiOutlinedInput-root fieldset": { borderColor: "#4b5563" },
  };

  const commonMenuItemSx = {
    backgroundColor: "white",
    color: "black",
    "&:hover": { backgroundColor: "#f3f4f6" },
    ".dark &": {
      backgroundColor: "#374151",
      color: "#e5e7eb",
      "&:hover": { backgroundColor: "#4b5563" },
    },
    "&.Mui-selected": { backgroundColor: "#e5e7eb" },
    ".dark &.Mui-selected": { backgroundColor: "#4b5563" },
  };

  const renderStepContent = () => {
    if (loading && step === 3) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress sx={{ color: "primary.main" }} />
        </Box>
      );
    }
    if (error && step === 3) {
      return (
        <div className="p-4 text-red-500 dark:text-red-400 text-center">
          {error}
        </div>
      );
    }

    return (
      <Box
        sx={{
          "& .MuiTextField-root, & .MuiSelect-root, & .MuiInputBase-root": {
            "& .MuiInputLabel-root": { color: "#6b7280" },
            ".dark & .MuiInputBase-input, .dark & .MuiSelect-select": {
              backgroundColor: "#1f2937",
              color: "#e5e7eb",
            },
            ".dark & .MuiInputLabel-root": { color: "#9ca3af" },
            "&.MuiSelect-root": {
              backgroundColor: "white",
              ".dark &": { backgroundColor: "#1f2937" },
            },
          },
          "& .MuiSvgIcon-root": { color: "#6b7280" },
          ".dark & .MuiSvgIcon-root": { color: "#9ca3af" },
        }}
      >
        {step === 1 && (
          <div className="p-4 space-y-4">
            <TextField
              fullWidth
              label="Provider Name"
              name="providerName"
              value={formData.providerName}
              onChange={handleFormChange}
              sx={commonInputSx}
              required
            />
            <TextField
              fullWidth
              label="Facility Name"
              name="facilityName"
              value={formData.facilityName}
              onChange={handleFormChange}
              sx={commonInputSx}
              required
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="providerPhoneNumber"
              value={formData.providerPhoneNumber}
              onChange={handleFormChange}
              sx={commonInputSx}
              required
            />
            <TextField
              fullWidth
              label="Delivery Address"
              name="providerAddress"
              value={formData.providerAddress}
              onChange={handleFormChange}
              sx={commonInputSx}
              required
            />
          </div>
        )}
        {step === 2 && (
          <div className="p-4 space-y-4">
            <TextField
              fullWidth
              label="Patient Name"
              name="patientName"
              value={formData.patientName}
              onChange={handleFormChange}
              sx={commonInputSx}
            />
            <TextField
              fullWidth
              label="Date of Birth"
              name="patientDob"
              type="text"
              value={formData.patientDob}
              onChange={handleFormChange}
              sx={commonInputSx}
              placeholder="YYYY-MM-DD"
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="patientPhoneNumber"
              value={formData.patientPhoneNumber}
              onChange={handleFormChange}
              sx={commonInputSx}
            />
            <TextField
              fullWidth
              label="Address"
              name="patientAddress"
              value={formData.patientAddress}
              onChange={handleFormChange}
              sx={commonInputSx}
            />
            <Select
              fullWidth
              name="patientCountry"
              value={formData.patientCountry}
              onChange={handleFormChange}
              sx={commonInputSx}
              MenuProps={{
                PaperProps: {
                  className: "bg-white dark:bg-gray-700",
                },
              }}
            >
              <MenuItem value="United States" sx={commonMenuItemSx}>
                United States
              </MenuItem>
            </Select>
          </div>
        )}
        {step === 3 && (
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Order Items
            </h3>

            {woundArea > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between mb-1">
                    <span>Wound Size:</span>
                    <span className="font-semibold">
                      {woundArea.toFixed(1)} cm²
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Max Allowed (120%):</span>
                    <span className="font-semibold">
                      {maxAllowedArea.toFixed(1)} cm²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currently Selected:</span>
                    <span
                      className={`font-semibold ${
                        currentTotalArea > maxAllowedArea
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {currentTotalArea.toFixed(1)} cm²
                    </span>
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      currentTotalArea > maxAllowedArea
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (currentTotalArea / maxAllowedArea) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                {currentTotalArea > maxAllowedArea && (
                  <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                    ⚠️ You have exceeded the maximum allowed area. Please reduce
                    your selection.
                  </div>
                )}
              </div>
            )}

            {itemsData.length > 0 ? (
              itemsData.map((item) => (
                <OrderItem
                  key={item.id}
                  item={item}
                  selectedVariants={selectedVariants[item.id] || []}
                  onVariantChange={(variants) =>
                    handleItemVariantChange(item.id, variants)
                  }
                  currentTotalArea={currentTotalArea}
                  maxAllowedArea={maxAllowedArea}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No available products found.
              </p>
            )}

            <div className="mt-4">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Requested Delivery Date"
                  value={formData.deliveryDate}
                  onChange={(newValue) => {
                    setFormData((prev) => ({
                      ...prev,
                      deliveryDate: newValue,
                    }));
                  }}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      sx: commonInputSx,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <OrderSummary
              selectedVariants={selectedVariants}
              itemsData={itemsData}
              orderDate={
                formData.deliveryDate instanceof Date
                  ? formData.deliveryDate.toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
        )}
      </Box>
    );
  };

  const hasSelectedItems = Object.values(selectedVariants).some((variants) =>
    variants.some(({ quantity }) => quantity > 0)
  );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            maxHeight: "90vh",
            borderRadius: "16px",
            boxShadow: 24,
            overflow: "hidden",
          }}
          className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 transition-colors duration-300"
        >
          <Box
            sx={{
              maxHeight: "90vh",
              overflowY: "auto",
              p: 4,
            }}
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-0 right-0 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition"
              >
                ✕
              </button>
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center mb-2">
                New Order
              </h2>
              <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                Complete the steps to place a new order.
              </p>
              {renderStepContent()}
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={() => setStep((prev) => prev - 1)}
                  disabled={step === 1 || loading}
                  className="px-3 py-2 rounded bg-gray-100 disabled:opacity-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  Back
                </button>
                {step < totalSteps ? (
                  <button
                    onClick={() => setStep((prev) => prev + 1)}
                    className="px-3 py-2 rounded bg-teal-600 text-white"
                    disabled={loading}
                  >
                    Next
                  </button>
                ) : (
                  <Button
                    onClick={handlePlaceOrderClick}
                    variant="contained"
                    className="bg-teal-600 text-white font-bold"
                    disabled={
                      !hasSelectedItems ||
                      loading ||
                      currentTotalArea > maxAllowedArea
                    }
                    sx={{
                      "&.Mui-disabled": {
                        bgcolor: "grey.500",
                        color: "grey.300",
                        cursor: "not-allowed",
                      },
                      "&:not(.Mui-disabled)": {
                        bgcolor: "#008080",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#66CDAA",
                        },
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Box>
        </Box>
      </Modal>

      <ConfirmationModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={handleFinalOrderSubmission}
      />
    </>
  );
};

export default NewOrderForm;
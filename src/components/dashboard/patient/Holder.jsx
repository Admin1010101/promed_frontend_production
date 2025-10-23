const NewOrderForm = ({ open, onClose, patient }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const { user, logout } = useContext(AuthContext);
  const { triggerOrderRefresh } = useFilter(); // ← ADD THIS LINE
  const [itemsData, setItemsData] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // ... rest of your code ...

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

      console.log("📡 Order submission response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Order submission failed:", errorData);
        throw new Error(
          errorData.detail || errorData.error || "Failed to place order."
        );
      }

      const responseData = await response.json();
      console.log("✅ Order created successfully:", responseData);

      // ✅ TRIGGER ORDER HISTORY REFRESH
      triggerOrderRefresh();

      toast.success("Order confirmed and submitted successfully!");
      
      // Reset form and close
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

  // DELETE THIS ENTIRE FUNCTION - it's not being used:
  /*
  const handleSubmitOrder = async () => {
    // ... DELETE ALL OF THIS ...
  };
  */

  // ... rest of your code continues ...
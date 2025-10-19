// OrderItem.js
import { useEffect, useState } from "react";


function getAreaFromSize(sizeStr) {
  if (!sizeStr) return 0;
  try {
    // Parse: "2 x 2", "2x2", "2 × 2", "20 x 20 mm", "2 x 2 cm"
    const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*[x×X]\s*(\d+(?:\.\d+)?)\s*(mm|cm)?/i);
    if (!match) {
      console.warn("⚠️ Could not parse size:", sizeStr);
      return 0;
    }
    
    let length = parseFloat(match[1]);
    let width = parseFloat(match[2]);
    const unit = match[3]?.toLowerCase() || 'cm'; // Default to cm
    
    if (isNaN(length) || isNaN(width)) {
      console.warn("⚠️ Invalid numbers in size:", sizeStr);
      return 0;
    }
    
    // Convert mm to cm (1cm = 10mm)
    if (unit === 'mm') {
      length = length / 10;
      width = width / 10;
    }
    
    return length * width; // Return area in cm²
  } catch (error) {
    console.error("❌ Error parsing size:", sizeStr, error);
    return 0;
  }
}

// ✅ Component starts here - all variables used inside must be parameters or state
const OrderItem = ({ item, selectedVariants = [], onVariantChange, currentTotalArea, maxAllowedArea }) => {
  const [localSelections, setLocalSelections] = useState(
    selectedVariants.length > 0 ? selectedVariants : [{ variantId: "", quantity: 0 }]
  );

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      setLocalSelections(
        selectedVariants.length > 0 ? selectedVariants : [{ variantId: "", quantity: 0 }]
      );
    } catch (error) {
      console.error("❌ Error in OrderItem useEffect:", error);
      setHasError(true);
    }
  }, [selectedVariants]);

  const handleLocalChange = (updatedSelections) => {
    try {
      setLocalSelections(updatedSelections);
      onVariantChange(updatedSelections);
    } catch (error) {
      console.error("❌ Error in handleLocalChange:", error);
      setHasError(true);
    }
  };

  const handleVariantChange = (index, value) => {
    try {
      const updated = [...localSelections];
      updated[index].variantId = value;
      updated[index].quantity = 0;
      handleLocalChange(updated);
    } catch (error) {
      console.error("❌ Error in handleVariantChange:", error);
      setHasError(true);
    }
  };

  const handleQuantityChange = (index, value) => {
    try {
      const updated = [...localSelections];
      updated[index].quantity = parseInt(value) || 0;
      handleLocalChange(updated);
    } catch (error) {
      console.error("❌ Error in handleQuantityChange:", error);
      setHasError(true);
    }
  };

  const addVariantRow = () => {
    try {
      const updated = [...localSelections, { variantId: "", quantity: 0 }];
      handleLocalChange(updated);
    } catch (error) {
      console.error("❌ Error in addVariantRow:", error);
      setHasError(true);
    }
  };

  const removeVariantRow = (index) => {
    try {
      const updated = localSelections.filter((_, i) => i !== index);
      handleLocalChange(updated);
    } catch (error) {
      console.error("❌ Error in removeVariantRow:", error);
      setHasError(true);
    }
  };

  const getVariantById = (id) => {
    try {
      if (!item?.variants) return null;
      return item.variants.find((v) => String(v.id) === String(id));
    } catch (error) {
      console.error("❌ Error in getVariantById:", error);
      return null;
    }
  };

  if (hasError) {
    return (
      <div className="mb-6 p-4 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400 text-sm">
          Error loading product: {item?.name || "Unknown"}
        </p>
      </div>
    );
  }

  if (!item || !item.variants || !Array.isArray(item.variants)) {
    console.error("❌ Invalid item data:", item);
    return (
      <div className="mb-6 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20">
        <p className="text-yellow-600 dark:text-yellow-400 text-sm">
          Invalid product data
        </p>
      </div>
    );
  }

  try {
    const thisProductArea = localSelections.reduce((sum, v) => {
      try {
        const variant = getVariantById(v.variantId);
        const area = getAreaFromSize(variant?.size);
        return sum + (area * (v.quantity || 0));
      } catch (error) {
        console.error("❌ Error calculating area:", error);
        return sum;
      }
    }, 0);

    const canAddMore = currentTotalArea < maxAllowedArea;
    const selectedVariantIds = localSelections.map((entry) => entry.variantId);

    return (
      <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
              {item.name || "Unnamed Product"}
            </h3>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  item.is_available 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {item.is_available ? "✓ Available" : "✗ Unavailable"}
              </span>
              {thisProductArea > 0 && (
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
                  {thisProductArea.toFixed(1)} cm² selected
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {localSelections.map((entry, index) => {
            try {
              const variant = getVariantById(entry.variantId);
              const thisRowArea = getAreaFromSize(variant?.size) * (entry.quantity || 0);
              const remainingGlobalArea = maxAllowedArea - (currentTotalArea - thisRowArea);
              
              const variantArea = getAreaFromSize(variant?.size);
              let maxQty = 0;
              if (variantArea > 0) {
                maxQty = Math.floor(remainingGlobalArea / variantArea);
              }
              
              const disableRow = remainingGlobalArea <= 0 && thisRowArea === 0;
              const usedIds = selectedVariantIds.filter((id, i) => i !== index);

              return (
                <div 
                  key={index} 
                  className="flex gap-2 items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex-1 flex gap-2 items-center">
                    <select
                      className="flex-1 border rounded-lg px-3 py-2.5 bg-white text-gray-900 border-gray-300 
                        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
                        focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all"
                      value={entry.variantId}
                      onChange={(e) => handleVariantChange(index, e.target.value)}
                      disabled={disableRow}
                    >
                      <option value="">Select Size</option>
                      {item.variants
                        .filter((variant) => !usedIds.includes(String(variant.id)))
                        .map((variant) => (
                          <option key={variant.id} value={variant.id}>
                            {variant.size || "Unknown Size"}
                          </option>
                        ))}
                    </select>

                    <select
                      className="w-24 border rounded-lg px-3 py-2.5 bg-white text-gray-900 border-gray-300 
                        dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600
                        focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all font-medium"
                      value={entry.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      disabled={!entry.variantId || disableRow}
                    >
                      {[...Array(Math.max(maxQty + 1, 1)).keys()].map((qty) => (
                        <option key={qty} value={qty}>
                          Qty: {qty}
                        </option>
                      ))}
                    </select>

                    {thisRowArea > 0 && (
                      <span className="text-xs font-medium text-teal-600 dark:text-teal-400 whitespace-nowrap bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded">
                        {thisRowArea.toFixed(1)} cm²
                      </span>
                    )}
                  </div>

                  {localSelections.length > 1 && (
                    <button
                      onClick={() => removeVariantRow(index)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 
                        text-lg px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Remove variant"
                      title="Remove selection"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            } catch (error) {
              console.error("❌ Error rendering variant row:", error);
              return (
                <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded text-red-600 dark:text-red-400 text-sm">
                  Error loading variant
                </div>
              );
            }
          })}
        </div>

        <button
          onClick={addVariantRow}
          disabled={!canAddMore}
          className={`mt-3 text-sm font-medium px-4 py-2 rounded-lg transition-all ${
            canAddMore 
              ? "text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 border border-teal-300 dark:border-teal-700" 
              : "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50 border border-gray-300 dark:border-gray-700"
          }`}
        >
          {canAddMore ? "+ Add Another Size" : "Maximum area reached"}
        </button>
      </div>
    );
  } catch (error) {
    console.error("❌ Error rendering OrderItem:", error);
    return (
      <div className="mb-6 p-4 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400 text-sm">
          Error rendering product: {item?.name || "Unknown"}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {error.message}
        </p>
      </div>
    );
  }
};

export default OrderItem;
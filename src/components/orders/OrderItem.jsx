// OrderItem.js
import { useEffect, useState } from "react";
import default_item from "../../assets/images/default_item.png";

// Helper to extract area from a size string like "2 x 2" → returns 4
function getAreaFromSize(sizeStr) {
  if (!sizeStr) return 0;
  const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i);
  if (!match) return 0;
  const length = parseFloat(match[1]);
  const width = parseFloat(match[2]);
  return length * width;
}

const OrderItem = ({ item, selectedVariants = [], onVariantChange, currentTotalArea, maxAllowedArea }) => {
  const [localSelections, setLocalSelections] = useState(
    selectedVariants.length > 0 ? selectedVariants : [{ variantId: "", quantity: 0 }]
  );

  useEffect(() => {
    setLocalSelections(
      selectedVariants.length > 0 ? selectedVariants : [{ variantId: "", quantity: 0 }]
    );
  }, [selectedVariants]);

  const handleLocalChange = (updatedSelections) => {
    setLocalSelections(updatedSelections);
    onVariantChange(updatedSelections);
  };

  const handleVariantChange = (index, value) => {
    const updated = [...localSelections];
    updated[index].variantId = value;
    updated[index].quantity = 0;
    handleLocalChange(updated);
  };

  const handleQuantityChange = (index, value) => {
    const updated = [...localSelections];
    updated[index].quantity = parseInt(value);
    handleLocalChange(updated);
  };

  const addVariantRow = () => {
    const updated = [...localSelections, { variantId: "", quantity: 0 }];
    handleLocalChange(updated);
  };

  const removeVariantRow = (index) => {
    const updated = localSelections.filter((_, i) => i !== index);
    handleLocalChange(updated);
  };

  // Get variant object by id
  const getVariantById = (id) => item.variants.find((v) => String(v.id) === String(id));

  // Calculate this product's selected area
  const thisProductArea = localSelections.reduce((sum, v) => {
    const variant = getVariantById(v.variantId);
    const area = getAreaFromSize(variant?.size);
    return sum + (area * (v.quantity || 0));
  }, 0);

  // Check if we can add more across ALL products
  const canAddMore = currentTotalArea < maxAllowedArea;

  // For duplicate size prevention
  const selectedVariantIds = localSelections.map((entry) => entry.variantId);

  return (
    <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      {/* Product Header */}
      <div className="flex items-center mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        {/* <img
          src={item.image || default_item}
          alt={item.name}
          className="w-20 h-20 rounded-lg border-2 object-cover mr-4 border-gray-200 dark:border-gray-600 shadow-sm"
        /> */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
            {item.name}
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

      {/* Variant Selection Rows */}
      <div className="space-y-3">
        {localSelections.map((entry, index) => {
          const variant = getVariantById(entry.variantId);
          const thisRowArea = getAreaFromSize(variant?.size) * (entry.quantity || 0);
          const remainingGlobalArea = maxAllowedArea - (currentTotalArea - thisRowArea);
          
          const variantArea = getAreaFromSize(variant?.size);
          let maxQty = 0;
          if (variantArea > 0) {
            maxQty = Math.floor(remainingGlobalArea / variantArea);
          }
          
          const disableRow = remainingGlobalArea <= 0 && thisRowArea === 0;

          // Prevent duplicate variant selection
          const usedIds = selectedVariantIds.filter((id, i) => i !== index);

          return (
            <div 
              key={index} 
              className="flex gap-2 items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex-1 flex gap-2 items-center">
                {/* Size Select */}
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
                        {variant.size}
                      </option>
                    ))}
                </select>

                {/* Quantity Select */}
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
                  {[...Array(maxQty + 1).keys()].map((qty) => (
                    <option key={qty} value={qty}>
                      Qty: {qty}
                    </option>
                  ))}
                </select>

                {/* Area Display */}
                {thisRowArea > 0 && (
                  <span className="text-xs font-medium text-teal-600 dark:text-teal-400 whitespace-nowrap bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded">
                    {thisRowArea.toFixed(1)} cm²
                  </span>
                )}
              </div>

              {/* Remove Button */}
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
        })}
      </div>

      {/* Add Another Button */}
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
};

export default OrderItem;
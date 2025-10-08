import { useEffect, useState } from "react";
import default_item from "../../assets/images/default_item.png";

// Helper to extract area from a size string. 
// This takes a string like "2 x 2 " and returns 4 for the size.
function getAreaFromSize(sizeStr) {
  if (!sizeStr) return 0;
  const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i);
  if (!match) return 0;
  const length = parseFloat(match[1]);
  const width = parseFloat(match[2]);
  return length * width;
}

const OrderItem = ({ item, selectedVariants = [], onVariantChange }) => {
  console.log("OrderItem Rendered with item:", item, "selectedVariants:", selectedVariants);
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
    updated[index].quantity = 0; // Reset quantity if variant changes
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

  console.log("Max allowed area calculation for item:", item);
  // Max size logic of the area allowed
  const maxAllowed = Math.floor((item.woundSize || 0) * 1.2);

  // Helper to get variant object by id
  const getVariantById = (id) => item.variants.find((v) => String(v.id) === String(id));

  // Calculate total selected area
  const totalSelected = localSelections.reduce((sum, v) => {
    const variant = getVariantById(v.variantId);
    const area = getAreaFromSize(variant?.size);
    return sum + (area * (v.quantity || 0));
  }, 0);

  const canAddMore = totalSelected < maxAllowed;

  // For duplicate size prevention
  const selectedVariantIds = localSelections.map((entry) => entry.variantId);

  return (
    <div className="border-b py-4 space-y-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <img
          src={item.image || default_item}
          alt={item.name}
          className="w-16 h-16 rounded border object-cover mr-4 border-gray-200 dark:border-gray-700"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
          <span
            className={`text-sm font-medium ${
              item.is_available ? "text-teal-600" : "text-red-500"
            }`}
          >
            {item.is_available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {localSelections.map((entry, index) => {
        const variant = getVariantById(entry.variantId);
        const thisRowArea = getAreaFromSize(variant?.size) * (entry.quantity || 0);
        const otherRowsArea = totalSelected - thisRowArea;
        const maxForThisRowArea = Math.max(0, maxAllowed - otherRowsArea);
        const variantArea = getAreaFromSize(variant?.size);
        let maxQty = 0;
        if (variantArea > 0) {
          maxQty = Math.floor(maxForThisRowArea / variantArea);
        }
        const disableRow = totalSelected >= maxAllowed && thisRowArea === 0;

        // Prevent duplicate variant selection
        const usedIds = selectedVariantIds.filter((id, i) => i !== index);

        return (
          <div key={index} className="flex gap-2 items-center">
            <select
              className="border rounded px-2 py-1 w-full bg-white text-black border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={entry.variantId}
              onChange={(e) => handleVariantChange(index, e.target.value)}
              disabled={disableRow}
            >
              <option className="bg-white text-black dark:bg-gray-700 dark:text-gray-200" value="">Select Size</option>
              {item.variants
                .filter((variant) => !usedIds.includes(String(variant.id)))
                .map((variant) => (
                  <option className="bg-white text-black dark:bg-gray-700 dark:text-gray-200" key={variant.id} value={variant.id}>
                    {variant.size} 
                  </option>
                ))}
            </select>

            <select
              className="border rounded px-2 py-1 w-24 bg-white text-black border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              value={entry.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              disabled={!entry.variantId || disableRow}
            >
              {[...Array(maxQty + 1).keys()].map((qty) => (
                <option className="bg-white text-black dark:bg-gray-700 dark:text-gray-200" key={qty} value={qty}>
                  {qty}
                </option>
              ))}
            </select>

            {localSelections.length > 1 && (
              <button
                onClick={() => removeVariantRow(index)}
                className="text-red-500 text-lg px-2"
                aria-label="Remove variant"
              >
                ✕
              </button>
            )}
          </div>
        );
      })}

      <button
        onClick={addVariantRow}
        className={`text-sm mt-2 ${canAddMore ? "text-teal-500 dark:text-teal-400" : "text-gray-400 cursor-not-allowed"}`}
        disabled={!canAddMore}
      >
        + Add Another Selection
      </button>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Max allowed area for this product: <span className="font-semibold">{maxAllowed}</span>.&nbsp;
        Currently selected area: <span className="font-semibold">{totalSelected}</span>
      </div>
      {!canAddMore && (
        <div className="text-xs text-red-500 dark:text-red-400 mt-1">
          You have reached the maximum allowed area for this product.
        </div>
      )}
    </div>
  );
};

export default OrderItem;
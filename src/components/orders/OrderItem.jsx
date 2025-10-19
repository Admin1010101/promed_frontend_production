import { useEffect, useState } from "react";
import default_item from "../../assets/images/default_item.png";

// Helper to extract area from size string like "2 x 3"
function getAreaFromSize(sizeStr) {
  if (!sizeStr) return 0;
  const match = sizeStr.match(/(\d+(?:\.\d+)?)\s*[x×X]\s*(\d+(?:\.\d+)?)/i);
  if (!match) return 0;
  const [_, l, w] = match;
  const length = parseFloat(l);
  const width = parseFloat(w);
  return isNaN(length) || isNaN(width) ? 0 : length * width;
}

const OrderItem = ({
  item,
  selectedVariants = [],
  onVariantChange,
  currentTotalArea,
  maxAllowedArea
}) => {
  const [selections, setSelections] = useState(
    selectedVariants.length > 0
      ? selectedVariants
      : [{ variantId: "", quantity: 0 }]
  );

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      setSelections(
        selectedVariants.length > 0
          ? selectedVariants
          : [{ variantId: "", quantity: 0 }]
      );
    } catch (error) {
      console.error("Error setting selectedVariants:", error);
      setHasError(true);
    }
  }, [selectedVariants]);

  const updateSelections = (updated) => {
    setSelections(updated);
    onVariantChange?.(updated);
  };

  const handleVariantChange = (index, variantId) => {
    const updated = [...selections];
    updated[index] = { variantId, quantity: 0 };
    updateSelections(updated);
  };

  const handleQuantityChange = (index, quantity) => {
    const updated = [...selections];
    updated[index].quantity = parseInt(quantity) || 0;
    updateSelections(updated);
  };

  const addVariantRow = () => {
    updateSelections([...selections, { variantId: "", quantity: 0 }]);
  };

  const removeVariantRow = (index) => {
    const updated = selections.filter((_, i) => i !== index);
    updateSelections(updated);
  };

  const getVariantById = (id) =>
    item?.variants?.find((v) => String(v.id) === String(id)) || null;

  if (hasError) {
    return (
      <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-4 rounded border border-red-200 dark:border-red-700 mb-4">
        Error loading product: {item?.name || "Unknown"}
      </div>
    );
  }

  if (!item?.variants || !Array.isArray(item.variants)) {
    return (
      <div className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 p-4 rounded border border-yellow-200 dark:border-yellow-700 mb-4">
        Invalid product data
      </div>
    );
  }

  // Total area for this product
  const thisProductArea = selections.reduce((sum, sel) => {
    const variant = getVariantById(sel.variantId);
    const area = getAreaFromSize(variant?.size);
    return sum + (area * (sel.quantity || 0));
  }, 0);

  const canAddMore = currentTotalArea < maxAllowedArea;

  const selectedIds = selections.map((s) => String(s.variantId));

  return (
    <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      {/* Product Header */}
      <div className="mb-4 border-b pb-2 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {item.name || "Unnamed Product"}
          </h3>
          <div className="flex gap-2 mt-1">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                item.is_available
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {item.is_available ? "✓ Available" : "✗ Unavailable"}
            </span>
            {thisProductArea > 0 && (
              <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                {thisProductArea.toFixed(1)} cm² selected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Variant Rows */}
      <div className="space-y-3">
        {selections.map((sel, index) => {
          const variant = getVariantById(sel.variantId);
          const thisRowArea = getAreaFromSize(variant?.size) * sel.quantity;

          const remainingArea =
            maxAllowedArea - (currentTotalArea - thisRowArea);

          const variantArea = getAreaFromSize(variant?.size);
          const maxQty =
            variantArea > 0 ? Math.floor(remainingArea / variantArea) : 0;

          const disableRow = remainingArea <= 0 && thisRowArea === 0;

          const usedIds = selectedIds.filter((id, i) => i !== index);

          return (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded border border-gray-200 dark:border-gray-700"
            >
              {/* Size select */}
              <select
                className="flex-1 px-3 py-2 rounded border text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={sel.variantId}
                onChange={(e) =>
                  handleVariantChange(index, e.target.value || "")
                }
                disabled={disableRow}
              >
                <option value="">Select Sizes</option>
                {item.variants
                  .filter((v) => !usedIds.includes(String(v.id)))
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.size || "Unknown"}
                    </option>
                  ))}
              </select>

              {/* Quantity select */}
              <select
                className="w-24 px-3 py-2 rounded border text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                value={sel.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                disabled={!sel.variantId || disableRow}
              >
                {[...Array(Math.max(maxQty + 1, 1)).keys()].map((qty) => (
                  <option key={qty} value={qty}>
                    Qty: {qty}
                  </option>
                ))}
              </select>

              {/* Area */}
              {thisRowArea > 0 && (
                <span className="text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded">
                  {thisRowArea.toFixed(1)} cm²
                </span>
              )}

              {/* Remove button */}
              {selections.length > 1 && (
                <button
                  onClick={() => removeVariantRow(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-lg px-2"
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Row */}
      <button
        onClick={addVariantRow}
        disabled={!canAddMore}
        className={`mt-4 px-4 py-2 rounded text-sm font-medium border transition ${
          canAddMore
            ? "text-teal-600 dark:text-teal-400 border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20"
            : "text-gray-400 border-gray-300 dark:border-gray-700 opacity-50 cursor-not-allowed"
        }`}
      >
        {canAddMore ? "+ Add Another Size" : "Maximum area reached"}
      </button>
    </div>
  );
};

export default OrderItem;

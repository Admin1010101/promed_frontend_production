import React from "react";

const OrderSummary = ({ selectedVariants = {}, itemsData = [], orderDate }) => {
  const renderSummaryItems = () => {
    return Object.entries(selectedVariants).map(([productId, variants]) => {
      const product = itemsData.find((item) => item.id === parseInt(productId));
      if (!product) return null;

      return (
        <div key={productId} className="mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100">{product.name}</h4>
          <ul className="ml-4 list-disc text-gray-700 dark:text-gray-300 text-sm">
            {variants
              .filter(({ quantity }) => quantity > 0)
              .map(({ variantId, quantity }, index) => {
                const variant = product.variants.find(
                  (v) => v.id === parseInt(variantId)
                );
                if (!variant) return null;

                return (
                  <li key={index}>
                    {variant.size} – Qty: {quantity}
                  </li>
                );
              })}
          </ul>
        </div>
      );
    });
  };

  return (
    <div className="mt-6 p-4 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Order By Date: <span className="text-sm font-light text-gray-800 dark:text-gray-200 ml-2">{orderDate}</span>
      </h3>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Order Summary
      </h3>
      {Object.keys(selectedVariants).length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No items selected.</p>
      ) : (
        renderSummaryItems()
      )}
    </div>
  );
};

export default OrderSummary;
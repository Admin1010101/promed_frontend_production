import React, { useState } from "react";
import OrderHistory from "./OrderHistory";

const OrderManagement = ({ activationFilter }) => {
  return (
    <div className="max-w-xl mx-auto mt-9 p-6 bg-white rounded-lg dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold">Order Management</h2>
      </div>
      <OrderHistory activationFilter={activationFilter} />
    </div>
  );
};

export default OrderManagement;
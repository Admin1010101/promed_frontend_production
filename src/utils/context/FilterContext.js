import React, { createContext, useState, useContext } from 'react';

// Create the context
export const FilterContext = createContext({
  activationFilter: 'Activated', // Default value
  setActivationFilter: () => {},
});

// Create the provider component
export const FilterProvider = ({ children }) => {
  const [activationFilter, setActivationFilter] = useState("Activated");

  const value = {
    activationFilter,
    setActivationFilter,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook for easier consumption
export const useFilter = () => {
    return useContext(FilterContext);
};
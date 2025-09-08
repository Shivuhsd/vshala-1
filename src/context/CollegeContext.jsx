import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context
const CollegeContext = createContext();

// 2. Create the provider
export const CollegeProvider = ({ children }) => {
  const [collegeType, setCollegeType] = useState(null);

  // Load from localStorage on first load
  useEffect(() => {
    const storedType = localStorage.getItem("collegeType");
    if (storedType) {
      setCollegeType(storedType);
    }
  }, []);

  // Update both state and localStorage
  const updateCollegeType = (type) => {
    localStorage.setItem("collegeType", type);
    setCollegeType(type);
  };

  return (
    <CollegeContext.Provider value={{ collegeType, updateCollegeType }}>
      {children}
    </CollegeContext.Provider>
  );
};

// 3. Custom hook to use the context
export const useCollege = () => useContext(CollegeContext);

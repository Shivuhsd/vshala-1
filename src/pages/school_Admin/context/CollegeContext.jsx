// src/context/CollegeContext.jsx
import React, { createContext, useContext, useState } from "react";

const CollegeContext = createContext();

export const CollegeProvider = ({ children }) => {
  const [collegeType, setCollegeType] = useState("");

  const updateCollegeType = (type) => setCollegeType(type);

  return (
    <CollegeContext.Provider value={{ collegeType, updateCollegeType }}>
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => useContext(CollegeContext);

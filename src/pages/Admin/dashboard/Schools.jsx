import React, { useState } from "react";
import SchoolList from "./partials/SchoolList";
import SchoolForm from "./partials/SchoolForm";

const Schools = () => {
  const [mode, setMode] = useState("list"); // "list" or "form"
  const [editData, setEditData] = useState(null); // Holds school data if editing

  const handleAddNew = () => {
    setEditData(null);
    setMode("form");
  };

  const handleEdit = (school) => {
    setEditData(school);
    setMode("form");
  };

  const handleViewAll = () => {
    setEditData(null);
    setMode("list");
  };

  return (
    <div className="space-y-6">
      {mode === "list" && (
        <SchoolList
          onAddNew={handleAddNew}
          onEdit={handleEdit}
        />
      )}
      {mode === "form" && (
        <SchoolForm
          editData={editData}
          onCancel={handleViewAll}
        />
      )}
    </div>
  );
};

export default Schools;

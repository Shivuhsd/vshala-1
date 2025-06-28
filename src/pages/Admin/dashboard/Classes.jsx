import React, { useState } from "react";
import ClassList from "./partials/ClassList";
import ClassForm from "./partials/ClassForm";

const Classes = () => {
  const [mode, setMode] = useState("list"); // "list" or "form"
  const [editData, setEditData] = useState(null);

  const handleAddNew = () => {
    setEditData(null);
    setMode("form");
  };

  const handleEdit = (classItem) => {
    setEditData(classItem);
    setMode("form");
  };

  const handleCancel = () => {
    setEditData(null);
    setMode("list");
  };

  return (
    <div className="space-y-6">
      {mode === "list" && (
        <ClassList onAddNew={handleAddNew} onEdit={handleEdit} />
      )}
      {mode === "form" && (
        <ClassForm editData={editData} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default Classes;

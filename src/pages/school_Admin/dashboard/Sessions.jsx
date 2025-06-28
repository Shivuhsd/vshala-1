import React, { useState } from "react";
import SessionForm from "./partials/SessionForm";
import SessionList from "./partials/SessionList";

const Sessions = () => {
  const [mode, setMode] = useState("list"); // "list" | "form"
  const [editData, setEditData] = useState(null); // session being edited

  const handleAddNew = () => {
    setEditData(null);
    setMode("form");
  };

  const handleEdit = (session) => {
    setEditData(session);
    setMode("form");
  };

  const handleCancel = () => {
    setEditData(null);
    setMode("list");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {mode === "list"
            ? "All Academic Sessions"
            : editData
            ? "Edit Session"
            : "Add New Session"}
        </h2>
      </div>

      {mode === "list" && (
        <SessionList onAddNew={handleAddNew} onEdit={handleEdit} />
      )}

      {mode === "form" && (
        <SessionForm editData={editData} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default Sessions;

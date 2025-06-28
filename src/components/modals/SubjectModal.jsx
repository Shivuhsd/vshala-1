import React, { useState, useEffect } from "react";

const SubjectModal = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    label: "",
    subject_type: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        label: initialData.label || "",
        subject_type: initialData.subject_type || "",
        id: initialData.id || null,
      });
    } else {
      setFormData({ label: "", subject_type: "", id: null });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.label || !formData.subject_type) return;
    onSave(formData);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
        open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4 z-10"
      >
        <h2 className="text-lg font-bold text-[#6B21A8]">
          {formData.id ? "Edit Subject" : "Add Subject"}
        </h2>

        <input
          name="label"
          value={formData.label}
          onChange={handleChange}
          placeholder="Subject Name"
          className="w-full border px-4 py-2 rounded"
        />

        <select
          name="subject_type"
          value={formData.subject_type}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Subject Type</option>
          <option value="Theoretical">Theoretical</option>
          <option value="Practical">Practical</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#6B21A8] text-white rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectModal;

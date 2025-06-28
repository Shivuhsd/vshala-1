import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClassForm = ({ editData = null, onCancel }) => {
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) setFormData({ name: editData.label });
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Class Name is required.");
      return;
    }

    setLoading(true);

    try {
      const payload = { label: formData.name };

      if (editData) {
        await axiosInstance.put(`/admin/v1/class/${editData.id}/`, payload);
        toast.success("Class updated successfully!");
      } else {
        await axiosInstance.post("/admin/v1/classes/", payload);
        toast.success("Class added successfully!");
      }

      setTimeout(() => {
        setLoading(false);
        onCancel(); // Navigate back to list
      }, 1500);
    } catch (error) {
      setLoading(false);
      const message =
        error.response?.data?.detail || "Failed to save class. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md space-y-8">
      <ToastContainer />
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {editData ? "Edit Class" : "Add New Class"}
        </h2>
        <button
          onClick={onCancel}
          className="text-sm text-purple-700 hover:underline"
        >
          View All
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Class Name *
          </label>
          <input
            type="text"
            name="name"
            placeholder='e.g. "12th", "BCA 2nd Year"'
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md font-medium transition ${
              loading
                ? "bg-purple-400 cursor-not-allowed text-white"
                : "bg-purple-700 hover:bg-purple-800 text-white"
            }`}
          >
            {loading
              ? editData
                ? "Updating..."
                : "Adding..."
              : editData
              ? "Update Class"
              : "Add New Class"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;

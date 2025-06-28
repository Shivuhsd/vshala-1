import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SessionForm = ({ editData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    label: "",
    start_date: "",
    end_date: "",
    tenant: localStorage.getItem("school_id"),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        label: editData.label || "",
        start_date: editData.start_date || "",
        end_date: editData.end_date || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { label, start_date, end_date } = formData;

    if (!label || !start_date || !end_date) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      if (editData) {
        await axiosInstance.put(`/admin/v1/session/${editData.id}/`, formData);
        toast.success("Session updated successfully");
      } else {
        await axiosInstance.post("/admin/v1/sessions/", formData);
        toast.success("New session created successfully");
      }

      setTimeout(() => {
        setLoading(false);
        onCancel();
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.detail || "Failed to save session");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md space-y-8">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {editData ? "Edit Session" : "Add New Session"}
        </h2>
        <button
          onClick={onCancel}
          className="text-sm text-purple-700 hover:underline"
        >
          View All
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Session Label */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Session *
          </label>
          <input
            type="text"
            name="label"
            placeholder="e.g. 2024–2025 Academic Year"
            value={formData.label}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Start Date *
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              End Date *
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md font-medium transition ${
              loading
                ? "bg-purple-400 text-white cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800 text-white"
            }`}
          >
            {loading
              ? editData
                ? "Updating..."
                : "Adding..."
              : editData
              ? "Update Session"
              : "Add New Session"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm;

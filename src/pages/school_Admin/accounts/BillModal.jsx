import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { useSchool } from "../context/SchoolContext";

const BillModal = ({ onClose, selectedBill }) => {
  const { selectedSchool, selectedSession } = useSchool();
  const [form, setForm] = useState({
    number: selectedBill?.number || "",
    name: selectedBill?.name || "",
    bill_type: selectedBill?.bill_type || "govt",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.number || !form.name) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      ...form,
      created_by: 4,
      tenant: selectedSchool?.id,
      session: selectedSession?.id,
    };

    try {
      setLoading(true);
      await axiosInstance.post("/schools/v1/bills/", payload);
      toast.success("Bill created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <FiX size={18} />
        </button>
        <h2 className="text-xl font-bold mb-6 text-[#6B21A8]">
          {selectedBill ? "Edit Bill" : "Add New Bill"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill Number
            </label>
            <input
              type="text"
              name="number"
              value={form.number}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B21A8]"
              placeholder="e.g., BILL-2025-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B21A8]"
              placeholder="e.g., Office Electricity Bill"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill Type
            </label>
            <select
              name="bill_type"
              value={form.bill_type}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B21A8]"
            >
              <option value="govt">Govt</option>
              <option value="pvt">Private</option>
              <option value="trust">Trust</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#6B21A8] hover:bg-[#9333EA] text-white py-2 rounded-md font-medium"
          >
            {loading
              ? "Saving..."
              : selectedBill
              ? "Update Bill"
              : "Create Bill"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BillModal;

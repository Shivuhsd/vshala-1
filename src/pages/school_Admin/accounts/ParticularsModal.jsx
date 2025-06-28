// school_Admin/pages/accounts/ParticularsModal.jsx

import React, { useState } from "react";
import { FiX, FiTrash2 } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

const ParticularsModal = ({ bill, onClose }) => {
  const [particulars, setParticulars] = useState(
    bill.particulars?.length > 0 ? bill.particulars : []
  );
  const [newParticular, setNewParticular] = useState({ label: "", price: "" });
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (!newParticular.label || !newParticular.price) {
      toast.warning("Please fill both fields");
      return;
    }
    setParticulars([...particulars, newParticular]);
    setNewParticular({ label: "", price: "" });
  };

  const handleDelete = (index) => {
    const updated = [...particulars];
    updated.splice(index, 1);
    setParticulars(updated);
  };

  const totalAmount = particulars.reduce(
    (sum, p) => sum + parseFloat(p.price || 0),
    0
  );

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        bill_id: bill.id,
        particulars,
      };
      await axiosInstance.post(`/api/schools/v1/bills/particulars/`, payload);
      toast.success("Particulars saved!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save particulars");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <FiX size={18} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#6B21A8]">
          Bill Particulars
        </h2>

        {/* Existing Particulars */}
        <div className="space-y-2 max-h-52 overflow-y-auto mb-4">
          {particulars.length === 0 && (
            <p className="text-sm text-gray-400">No particulars added yet.</p>
          )}
          {particulars.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-3 py-2 border rounded"
            >
              <span className="font-medium text-gray-700">{p.label}</span>
              <div className="flex items-center gap-4">
                <span className="text-green-700 font-semibold">
                  ₹ {p.price}
                </span>
                <button
                  onClick={() => handleDelete(i)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add new Particular */}
        <div className="grid grid-cols-12 gap-4 mb-4">
          <input
            type="text"
            className="col-span-7 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#6B21A8]"
            placeholder="Particular label"
            value={newParticular.label}
            onChange={(e) =>
              setNewParticular({ ...newParticular, label: e.target.value })
            }
          />
          <input
            type="number"
            className="col-span-3 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#6B21A8]"
            placeholder="Price ₹"
            value={newParticular.price}
            onChange={(e) =>
              setNewParticular({ ...newParticular, price: e.target.value })
            }
          />
          <button
            type="button"
            onClick={handleAdd}
            className="col-span-2 bg-[#6B21A8] hover:bg-[#9333EA] text-white rounded-md px-3 text-sm"
          >
            Add
          </button>
        </div>

        {/* Total and Save */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Total Amount:{" "}
            <span className="font-bold text-green-700">
              ₹ {totalAmount.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-5 py-2 rounded-md text-sm"
          >
            {loading ? "Saving..." : "Save Particulars"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticularsModal;

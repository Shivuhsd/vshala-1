import React, { useState } from "react";
import { FiX, FiTrash2, FiEdit2, FiSave } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

const ParticularsModal = ({ bill, onClose }) => {
  const [particulars, setParticulars] = useState(bill.particulars || []);
  const [editIndex, setEditIndex] = useState(null);
  const [editParticular, setEditParticular] = useState({ label: "", price: "" });
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [newParticular, setNewParticular] = useState({ name: "", price: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleDelete = async (id, index) => {
    try {
      setLoadingIndex(index);
      await axiosInstance.delete(`/schools/v1/bills/particulars/?id=${id}`);
      const updated = particulars.filter((p) => p.id !== id);
      setParticulars(updated);
      toast.success("Particular deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete particular");
    } finally {
      setLoadingIndex(null);
    }
  };

  const handleEdit = (index) => {
  setEditIndex(index);
  setEditParticular({ ...particulars[index] }); // Copy correct data
};

const handleSaveEdit = async () => {
  const particularToUpdate = particulars[editIndex];
  try {
    setLoadingIndex(editIndex);
    const response = await axiosInstance.put(
      `/schools/v1/bills/particulars/?id=${particularToUpdate.id}`,
      {
        name: editParticular.name,
        price: editParticular.price,
      }
    );
    const updated = [...particulars];
    updated[editIndex] = response.data;
    setParticulars(updated);
    setEditIndex(null);
    toast.success("Particular updated");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update particular");
  } finally {
    setLoadingIndex(null);
  }
};
  const totalAmount = particulars.reduce(
    (sum, p) => sum + parseFloat(p.price || 0),
    0
  );

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
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {particulars.length === 0 ? (
            <p className="text-sm text-gray-400">No particulars added yet.</p>
          ) : (
            particulars.map((p, i) => (
              <div
                key={p.id}
                className="flex justify-between items-center px-3 py-2 border rounded"
              >
                {editIndex === i ? (
                  <>
                    <div className="flex-1 flex gap-2">
                      <input
  type="text"
  className="px-2 py-1 border rounded w-1/2"
  value={editParticular.name}
  onChange={(e) =>
    setEditParticular({ ...editParticular, name: e.target.value })
  }
/>
<input
  type="number"
  className="px-2 py-1 border rounded w-1/3"
  value={editParticular.price}
  onChange={(e) =>
    setEditParticular({ ...editParticular, price: e.target.value })
  }
/>

                    </div>
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-600 hover:text-green-800 ml-2"
                      disabled={loadingIndex === i}
                    >
                      <FiSave />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-700">{p.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-green-700 font-semibold">
                        ₹ {p.price}
                      </span>
                      <button
                        onClick={() => handleEdit(i)}
                        className="text-gray-500 hover:text-blue-600"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, i)}
                        className="text-gray-500 hover:text-red-500"
                        disabled={loadingIndex === i}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add New Particular */}
<div className="border rounded p-3 mt-4">
  <h4 className="text-sm font-semibold text-gray-700 mb-2">Add New Particular</h4>
  <div className="flex gap-2 items-center">
    <input
      type="text"
      className="px-2 py-1 border rounded w-1/2"
      placeholder="Particular name"
      value={newParticular.name}
      onChange={(e) =>
        setNewParticular({ ...newParticular, name: e.target.value })
      }
    />
    <input
      type="number"
      className="px-2 py-1 border rounded w-1/3"
      placeholder="Price"
      value={newParticular.price}
      onChange={(e) =>
        setNewParticular({ ...newParticular, price: e.target.value })
      }
    />
    <button
      onClick={async () => {
        if (!newParticular.name || !newParticular.price) {
          toast.warn("Please enter both name and price");
          return;
        }
        try {
          setIsAdding(true);
          const response = await axiosInstance.post(
            `/schools/v1/bills/particulars/`,
            {
              bill: bill.id,
              name: newParticular.name,
              price: newParticular.price,
            }
          );
          setParticulars((prev) => [...prev, response.data]);
          setNewParticular({ name: "", price: "" });
          toast.success("Particular added");
        } catch (err) {
          console.error(err);
          toast.error("Failed to add particular");
        } finally {
          setIsAdding(false);
        }
      }}
      className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
      disabled={isAdding}
    >
      Add
    </button>
  </div>
</div>


        {/* Total */}
        <div className="flex justify-end mt-6">
          <div className="text-sm text-gray-600">
            Total Amount:{" "}
            <span className="font-bold text-green-700">
              ₹ {totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticularsModal;

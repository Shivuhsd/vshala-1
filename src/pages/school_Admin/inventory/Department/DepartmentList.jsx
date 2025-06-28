import React, { useState, useMemo } from "react";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const FeeManagement = () => {
  const [feeList, setFeeList] = useState([
    {
      id: 1,
      name: "Tuition Fee",
      amount: "15000",
      due_date: "2025-07-15",
      description: "Quarterly tuition fee",
    },
    {
      id: 2,
      name: "Library Fee",
      amount: "2000",
      due_date: "2025-08-01",
      description: "Annual library charges",
    },
    {
      id: 3,
      name: "Sports Fee",
      amount: "1000",
      due_date: "2025-07-10",
      description: "For annual sports activities",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeeId, setEditingFeeId] = useState(null);
  const [feeName, setFeeName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const handleAddEdit = () => {
    if (!feeName || !amount || !dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    const newEntry = {
      id: editingFeeId || Date.now(),
      name: feeName,
      amount,
      due_date: dueDate,
      description,
    };

    if (editingFeeId) {
      setFeeList((prev) =>
        prev.map((f) => (f.id === editingFeeId ? newEntry : f))
      );
      toast.success("Fee updated");
    } else {
      setFeeList((prev) => [newEntry, ...prev]);
      toast.success("Fee added");
    }

    closeModal();
  };

  const handleEdit = (fee) => {
    setFeeName(fee.name);
    setAmount(fee.amount);
    setDueDate(fee.due_date);
    setDescription(fee.description);
    setEditingFeeId(fee.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFeeName("");
    setAmount("");
    setDueDate("");
    setDescription("");
    setEditingFeeId(null);
    setIsModalOpen(false);
  };

  const filteredFees = useMemo(() => {
    return feeList.filter((fee) =>
      fee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [feeList, searchTerm]);

  const totalPages =
    pageSize === "all" ? 1 : Math.ceil(filteredFees.length / pageSize);
  const paginatedFees =
    pageSize === "all"
      ? filteredFees
      : filteredFees.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-[#6B21A8]">Fee Management</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search fee..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            <FiPlusCircle />
            Add Fee
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div className="flex gap-2 items-center">
          Show
          <select
            value={pageSize}
            onChange={(e) => {
              const val = e.target.value;
              setPageSize(val === "all" ? "all" : parseInt(val));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="all">All</option>
          </select>
          entries
        </div>
        <div className="text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="bg-white shadow rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="min-w-full text-sm text-[#334155]">
          <thead className="bg-[#F1F5F9] text-left">
            <tr className="uppercase text-xs text-gray-600 tracking-wide">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFees.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No fee records found.
                </td>
              </tr>
            ) : (
              paginatedFees.map((fee) => (
                <tr key={fee.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{fee.name}</td>
                  <td className="px-4 py-2">₹{fee.amount}</td>
                  <td className="px-4 py-2">{fee.due_date}</td>
                  <td className="px-4 py-2">
                    {fee.description || (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(fee)}
                      className="text-[#6B21A8] hover:underline flex items-center gap-1 text-sm"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageSize !== "all" && totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 text-sm mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Fee Modal"
        className="max-w-md w-full mx-auto mt-20 bg-white rounded-xl p-6 shadow-lg border border-[#E2E8F0]"
        overlayClassName="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-start justify-center z-50"
      >
        <h2 className="text-xl font-semibold text-[#334155] mb-4">
          {editingFeeId ? "Edit Fee" : "Add New Fee"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Fee Name <span className="text-red-500">*</span>
            </label>
            <input
              value={feeName}
              onChange={(e) => setFeeName(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded px-3 py-2 text-sm"
              placeholder="e.g. Tuition Fee"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded px-3 py-2 text-sm"
              placeholder="e.g. 15000"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional"
              className="w-full border border-[#E2E8F0] rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={closeModal}
              className="text-sm text-gray-600 border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEdit}
              className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
            >
              <FiPlusCircle />
              {editingFeeId ? "Save Changes" : "Add Fee"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeeManagement;

import React, { useEffect, useState, useMemo } from "react";
import { FiPlusCircle, FiEdit2 } from "react-icons/fi";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../../services/axiosInstance";
import { useSchool } from "../../../school_Admin/context/SchoolContext";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const ItemList = () => {
  const { selectedSchool } = useSchool();
  const schoolId = selectedSchool?.id;

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!schoolId) return;
    axiosInstance
      .get(`/inventory/v1/categories/?school_id=${schoolId}`)
      .then((res) => setCategories(res.data || []))
      .catch((err) =>
        toast.error(err.response?.data?.message || "Failed to fetch categories")
      );
  }, [schoolId]);

  const fetchItems = () => {
    axiosInstance
      .get(`/inventory/v1/items/?school_id=${schoolId}`)
      .then((res) => setItems(res.data || []))
      .catch((err) =>
        toast.error(err.response?.data?.message || "Failed to fetch items")
      );
  };

  useEffect(() => {
    if (schoolId) fetchItems();
  }, [schoolId]);

  const openModal = (item = null) => {
    if (item) {
      setItemName(item.item_name);
      setItemDescription(item.description);
      setUnit(item.unit);
      setMinQuantity(item.min_quantity);
      setCategoryId(item.category);
      setEditingItemId(item.id);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setItemName("");
    setItemDescription("");
    setUnit("");
    setMinQuantity("");
    setCategoryId("");
    setEditingItemId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!itemName || !categoryId || !unit || isNaN(minQuantity)) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    const payload = {
      item_name: itemName,
      description: itemDescription,
      unit,
      min_quantity: Number(minQuantity),
      category: categoryId,
      school: schoolId,
    };

    try {
      if (editingItemId) {
        await axiosInstance.put(
          `/inventory/v1/items/${editingItemId}/`,
          payload
        );
        toast.success("Item updated successfully");
      } else {
        await axiosInstance.post(`/inventory/v1/items/`, payload);
        toast.success("Item added successfully");
      }
      closeModal();
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving item");
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const totalPages =
    pageSize === "all" ? 1 : Math.ceil(filteredItems.length / pageSize);

  const paginatedItems =
    pageSize === "all"
      ? filteredItems
      : filteredItems.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

  return (
    <div className="space-y-8">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#6B21A8]">Manage Items</h1>
        <button
          onClick={() => openModal()}
          className="bg-[#6B21A8] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#7e22ce]"
        >
          <FiPlusCircle />
          Add Item
        </button>
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <input
          type="text"
          placeholder="Search items..."
          className="border px-3 py-2 rounded w-64"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="flex items-center gap-2">
          Show
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(
                e.target.value === "all" ? "all" : parseInt(e.target.value)
              );
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
          entries
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Unit</th>
              <th className="px-4 py-3">Min Qty</th>
              <th className="px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No items found.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.item_name}</td>
                  <td className="px-4 py-2">
                    {categories.find((c) => c.id === item.category)
                      ?.category_name || "—"}
                  </td>
                  <td className="px-4 py-2">{item.unit}</td>
                  <td className="px-4 py-2">{item.min_quantity}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openModal(item)}
                      className="text-[#6B21A8] flex items-center gap-1 text-sm hover:underline"
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

      {/* Pagination */}
      {pageSize !== "all" && totalPages > 1 && (
        <div className="flex justify-end gap-3 mt-2 text-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="max-w-lg w-full bg-white rounded-xl p-6 shadow-lg border"
        overlayClassName="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
      >
        <h2 className="text-xl font-bold mb-4">
          {editingItemId ? "Edit Item" : "Add New Item"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="e.g. Lab Microscope"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Brief details (optional)"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. pcs, box, litres"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm mb-1">Min Quantity</label>
              <input
                type="number"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="e.g. 10"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={closeModal}
              className="border px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#6B21A8] text-white px-4 py-2 rounded text-sm"
            >
              {editingItemId ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItemList;

import React, { useState, useEffect, useMemo } from "react";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import axiosInstance from "../../../../services/axiosInstance";
import { useSchool } from "../../../school_Admin/context/SchoolContext";

Modal.setAppElement("#root");

const CategoryList = () => {
  const { selectedSchool } = useSchool();
  const schoolId = selectedSchool?.id;

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (schoolId) {
      fetchCategories();
    }
  }, [schoolId]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(
        `inventory/v1/categories/?school_id=${schoolId}`
      );
      setCategories(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = {
      category_name: categoryName.trim(),
      description: description.trim(),
      school: schoolId,
    };

    setLoading(true);
    try {
      if (editingCategoryId) {
        await axiosInstance.put(
          `inventory/v1/category/${editingCategoryId}/`,
          payload
        );
        toast.success("Category updated");
      } else {
        await axiosInstance.post("inventory/v1/categories/", payload);
        toast.success("Category added");
      }

      fetchCategories();
      resetForm();
    } catch (err) {
      toast.error("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setCategoryName(cat.category_name);
    setDescription(cat.description);
    setEditingCategoryId(cat.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setCategoryName("");
    setDescription("");
    setEditingCategoryId(null);
    setShowForm(false);
    setLoading(false);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const totalPages =
    pageSize === "all" ? 1 : Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories =
    pageSize === "all"
      ? filteredCategories
      : filteredCategories.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

  if (!schoolId) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Please select a school to manage categories.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header + Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <h1 className="text-2xl font-bold text-[#6B21A8]">Manage Categories</h1>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            onClick={() => {
              setShowForm(true);
              setEditingCategoryId(null);
              setCategoryName("");
              setDescription("");
            }}
            className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            <FiPlusCircle />
            Add Category
          </button>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-2 text-sm">
        <div className="flex items-center gap-2">
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
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
          entries
        </div>
        <div className="text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="min-w-full text-sm text-[#334155]">
          <thead className="bg-[#F1F5F9] text-left">
            <tr className="uppercase text-xs tracking-wide text-gray-600">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.length === 0 ? (
              <tr>
                <td className="px-4 py-3 text-center text-gray-500" colSpan={3}>
                  No categories found.
                </td>
              </tr>
            ) : (
              paginatedCategories.map((cat) => (
                <tr key={cat.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{cat.category_name}</td>
                  <td className="px-4 py-2">{cat.description || "—"}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(cat)}
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

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={showForm}
        onRequestClose={resetForm}
        contentLabel="Add Category"
        className="max-w-md w-full mx-auto mt-20 bg-white rounded-xl p-6 shadow-lg border border-[#E2E8F0]"
        overlayClassName="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-start justify-center z-50"
      >
        <h2 className="text-xl font-semibold text-[#334155] mb-4">
          {editingCategoryId ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
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
              placeholder="Enter description (optional)"
              className="w-full border border-[#E2E8F0] rounded px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              onClick={resetForm}
              className="text-sm text-gray-600 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !categoryName.trim()}
              className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <FiPlusCircle />
              {loading
                ? editingCategoryId
                  ? "Saving..."
                  : "Adding..."
                : editingCategoryId
                ? "Save Changes"
                : "Add Category"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;

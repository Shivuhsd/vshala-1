import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../../../services/axiosInstance";
import { useSchool } from "../../../school_Admin/context/SchoolContext.jsx";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const DepartmentList = () => {
  const { selectedSchool } = useSchool();
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchDepartments = async () => {
    if (!selectedSchool?.id) return;
    try {
      const res = await axiosInstance.get(
        `inventory/v1/departments/?school_id=${selectedSchool.id}`
      );
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load departments.");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [selectedSchool]);

  const openModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setName(dept.name);
      setDescription(dept.description || "");
    } else {
      setEditingDept(null);
      setName("");
      setDescription("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingDept(null);
    setName("");
    setDescription("");
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Department name is required.");
      return;
    }

    const payload = {
      name,
      description,
      school: selectedSchool.id,
    };

    try {
      if (editingDept) {
        await axiosInstance.put(
          `inventory/v1/department/${editingDept.id}/`,
          payload
        );
        toast.success("Department updated.");
      } else {
        await axiosInstance.post(`inventory/v1/departments/`, payload);
        toast.success("Department created.");
      }
      closeModal();
      fetchDepartments();
    } catch (err) {
      console.error(err);
      toast.error("Error saving department.");
    }
  };

  const filteredDepartments = useMemo(() => {
    return departments.filter((d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const totalPages =
    pageSize === "all" ? 1 : Math.ceil(filteredDepartments.length / pageSize);

  const paginatedDepartments =
    pageSize === "all"
      ? filteredDepartments
      : filteredDepartments.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-[#6B21A8]">Department List</h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search department..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={() => openModal()}
            className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
          >
            <FiPlusCircle />
            Add Department
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
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDepartments.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No departments found.
                </td>
              </tr>
            ) : (
              paginatedDepartments.map((dept) => (
                <tr key={dept.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{dept.name}</td>
                  <td className="px-4 py-2">
                    {dept.description || (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openModal(dept)}
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
        contentLabel="Department Modal"
        className="max-w-md w-full mx-auto mt-20 bg-white rounded-xl p-6 shadow-lg border border-[#E2E8F0]"
        overlayClassName="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-start justify-center z-50"
      >
        <h2 className="text-xl font-semibold text-[#334155] mb-4">
          {editingDept ? "Edit Department" : "Add New Department"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Department Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded px-3 py-2 text-sm"
              placeholder="e.g. Computer Science"
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
              onClick={handleSubmit}
              className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
            >
              <FiPlusCircle />
              {editingDept ? "Save Changes" : "Add Department"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentList;

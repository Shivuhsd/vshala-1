import React, { useState, useEffect, useMemo } from "react";
import { FiPlusCircle, FiEdit2 } from "react-icons/fi";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../../services/axiosInstance";
import { useSchool } from "../../../school_Admin/context/SchoolContext";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const SupplierList = () => {
  const { selectedSchool } = useSchool();
  const schoolId = selectedSchool?.id;

  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    supplier_name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    tax_id: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const resetForm = () => {
    setForm({
      supplier_name: "",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      tax_id: "",
    });
    setEditingId(null);
  };

  const openModal = (supplier = null) => {
    if (supplier) {
      setForm({ ...supplier });
      setEditingId(supplier.id);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (
      !form.supplier_name ||
      !form.contact_person ||
      !form.email ||
      !form.phone
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = { ...form, school: schoolId };

    try {
      if (editingId) {
        await axiosInstance.put(
          `/inventory/v1/supplier/${editingId}/`,
          payload
        );
        toast.success("Supplier updated successfully");
      } else {
        await axiosInstance.post("/inventory/v1/suppliers/", payload);
        toast.success("Supplier added successfully");
      }
      closeModal();
      fetchSuppliers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save supplier");
    }
  };

  const fetchSuppliers = () => {
    axiosInstance
      .get(`/inventory/v1/suppliers/?school_id=${schoolId}`)
      .then((res) => setSuppliers(res.data || []))
      .catch(() => toast.error("Failed to fetch suppliers"));
  };

  useEffect(() => {
    if (schoolId) fetchSuppliers();
  }, [schoolId]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) =>
      s.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const totalPages =
    pageSize === "all" ? 1 : Math.ceil(filteredSuppliers.length / pageSize);
  const paginatedSuppliers =
    pageSize === "all"
      ? filteredSuppliers
      : filteredSuppliers.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

  return (
    <div className="space-y-8">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#6B21A8]">Manage Suppliers</h1>
        <button
          onClick={() => openModal()}
          className="bg-[#6B21A8] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FiPlusCircle />
          Add Supplier
        </button>
      </div>

      <div className="flex justify-between items-center mb-2 text-sm">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-64"
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
            className="border px-2 py-1 rounded"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
          entries
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Contact Person</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSuppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              paginatedSuppliers.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{s.supplier_name}</td>
                  <td className="px-4 py-2">{s.contact_person}</td>
                  <td className="px-4 py-2">{s.phone}</td>
                  <td className="px-4 py-2">{s.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openModal(s)}
                      className="text-[#6B21A8] flex items-center gap-1 text-sm"
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
          {editingId ? "Edit Supplier" : "Add New Supplier"}
        </h2>
        <div className="space-y-4">
          {[
            { label: "Supplier Name", name: "supplier_name" },
            { label: "Contact Person", name: "contact_person" },
            { label: "Email", name: "email", type: "email" },
            { label: "Phone", name: "phone" },
            { label: "Address", name: "address" },
            { label: "Tax ID", name: "tax_id" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          ))}

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
              {editingId ? "Save Changes" : "Add Supplier"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupplierList;

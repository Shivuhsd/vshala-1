import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import "react-toastify/dist/ReactToastify.css";

// Permission options with internal codes
const ALL_PERMISSIONS = [
  { label: "School Management", value: "school_admin" },
  { label: "Library Management", value: "library_admin" },
];

const AddRole = ({ editData }) => {
  const navigate = useNavigate();
  const { selectedSchool } = useSchool();

  const [formData, setFormData] = useState({ name: "", permissions: [] });
  const [initializing, setInitializing] = useState(!!editData);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        permissions: Array.isArray(editData.permissions)
          ? editData.permissions
          : [],
      });
    }
    setInitializing(false);
  }, [editData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePermission = (permValue) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permValue)
        ? prev.permissions.filter((p) => p !== permValue)
        : [...prev.permissions, permValue],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Role name is required.");
      return;
    }

    if (!selectedSchool?.id) {
      toast.error("School context is missing.");
      return;
    }

    const payload = {
      role_name: formData.name,
      permission_code: formData.permissions,
      school_id: selectedSchool.id,
    };

    try {
      if (editData) {
        await axiosInstance.put(`accounts/v1/roles/${editData.id}/`, payload);
        toast.success("Role updated successfully.");
      } else {
        await axiosInstance.post("accounts/v1/roles/", payload);
        toast.success("Role created successfully.");
      }
      navigate("/school-admin/roles");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit role.");
    }
  };

  if (initializing) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading role details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 bg-white shadow rounded-lg">
      <ToastContainer />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#4C1D95]">
          {editData ? "Edit Role" : "Add New Role"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter role name"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Permissions
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded p-4">
            {ALL_PERMISSIONS.map((perm, idx) => (
              <label key={idx} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(perm.value)}
                  onChange={() => togglePermission(perm.value)}
                  className="accent-[#6B21A8]"
                />
                {perm.label}
              </label>
            ))}
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-[#6B21A8] hover:bg-[#7E22CE] text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            {editData ? "Update Role" : "Create Role"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRole;

// src/pages/school_Admin/admin/EditStaffForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";

const PERMISSIONS = [
  "Manage Inquiries",
  "Manage Admissions",
  "Manage Students",
  "Delete Students",
  "Add/Remove Admins",
  "Manage Roles",
  "Add/Remove Staff",
  "Student Promotion",
  "Transfer Student",
  "Manage Certificates",
  "Manage Classes & Sections",
  "Delete Class Sections",
  "Manage Subjects",
  "Manage Timetable",
  "View Timetable",
  "Manage Student Attendance",
  "Manage Staff Attendance",
  "Manage Student Leaves",
  "Manage Staff Leaves",
  "Manage Study Materials",
  "Manage Homework",
  "Manage Live Classes",
  "Manage Library",
  "Manage Transport",
  "Manage Noticeboard",
  "Manage Events",
  "Manage Exams",
  "Manage Expenses",
  "Manage Income",
  "Manage Invoices",
  "Delete Invoices",
  "Delete Payments",
  "View Stats - Payments",
  "View Stats - Amount By Fees Structure",
  "View Stats - Expense",
  "View Stats - Income",
  "Manage Fee Types",
  "Send Notifications",
  "Manage Settings",
  "Manage Logs",
];

const EditStaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedSchool, selectedSession } = useSchool();

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axiosInstance.get(`/schools/v1/staff/${id}/`);
        const data = res.data;

        setFormData({
          ...data,
          login_option: data.username ? "existing_user" : "disallow",
          permissions: data.permissions || [],
        });
      } catch (err) {
        toast.error("Failed to load staff details.");
        console.error(err);
      }
    };

    fetchStaff();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (perm) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(perm);
      const updated = exists
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm];
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Name is required.");
    if (!/^\d{10}$/.test(formData.phone))
      return toast.error("Phone must be 10 digits.");

    const payload = {
      ...formData,
      tenant: selectedSchool?.id,
      session: selectedSession?.id,
      from_front: true,
    };

    try {
      await axiosInstance.put(`/schools/v1/staff/${id}/`, payload);
      toast.success("Staff updated successfully.");
    } catch (err) {
      toast.error("Failed to update staff.");
      console.error(err);
    }
  };

  if (!formData)
    return <div className="p-6 text-center">Loading staff details...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 bg-white rounded-xl shadow">
      <ToastContainer />

      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-[#6B21A8]"
          >
            <FiArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-[#6B21A8]">Edit Staff</h2>
        </div>
      </div>

      {/* Sections — same as AddStaffForm, but using formData state */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name *"
            className="border rounded px-3 py-2 text-sm"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">Select Gender *</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone *"
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded px-3 py-2 text-sm"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Full Address"
            className="border rounded px-3 py-2 text-sm col-span-full"
          />
        </div>
      </section>

      {/* Joining Details */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Joining Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            name="join_date"
            value={formData.join_date}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role *"
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary"
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Designation"
            className="border rounded px-3 py-2 text-sm"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Note / Description"
            className="border rounded px-3 py-2 text-sm col-span-full"
          />
        </div>
      </section>

      {/* Class Teacher */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Class Teacher
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="class"
            value={formData.class}
            onChange={handleChange}
            placeholder="Select Class"
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="Select Section"
            className="border rounded px-3 py-2 text-sm"
          />
        </div>
      </section>

      {/* Bus In-charge */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Bus In-charge
        </h3>
        <div className="flex gap-6 text-sm">
          <label className="flex gap-2 items-center">
            <input
              type="radio"
              name="is_bus_incharge"
              value="yes"
              checked={formData.is_bus_incharge === "yes"}
              onChange={handleChange}
            />
            Yes
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="radio"
              name="is_bus_incharge"
              value="no"
              checked={formData.is_bus_incharge === "no"}
              onChange={handleChange}
            />
            No
          </label>
        </div>
      </section>

      {/* Permissions */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Permissions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto border rounded-md p-4">
          {PERMISSIONS.map((perm, idx) => (
            <label key={idx} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.permissions.includes(perm)}
                onChange={() => togglePermission(perm)}
                className="accent-[#6B21A8]"
              />
              {perm}
            </label>
          ))}
        </div>
      </section>

      {/* Login Details */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Login Details
        </h3>
        <div className="flex gap-6 text-sm mb-4">
          <label>
            <input
              type="radio"
              name="login_option"
              value="disallow"
              checked={formData.login_option === "disallow"}
              onChange={handleChange}
            />{" "}
            Disallow
          </label>
          <label>
            <input
              type="radio"
              name="login_option"
              value="existing_user"
              checked={formData.login_option === "existing_user"}
              onChange={handleChange}
            />{" "}
            Existing User
          </label>
          <label>
            <input
              type="radio"
              name="login_option"
              value="new_user"
              checked={formData.login_option === "new_user"}
              onChange={handleChange}
            />{" "}
            New User
          </label>
        </div>
        {(formData.login_option === "existing_user" ||
          formData.login_option === "new_user") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              placeholder="Username"
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="login_email"
              value={formData.login_email || ""}
              onChange={handleChange}
              placeholder="Login Email"
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
        )}
      </section>

      {/* Status */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Status</h3>
        <div className="flex gap-6 text-sm">
          <label>
            <input
              type="radio"
              name="is_active"
              value="true"
              checked={formData.is_active === true}
              onChange={() => setFormData((p) => ({ ...p, is_active: true }))}
            />{" "}
            Active
          </label>
          <label>
            <input
              type="radio"
              name="is_active"
              value="false"
              checked={formData.is_active === false}
              onChange={() => setFormData((p) => ({ ...p, is_active: false }))}
            />{" "}
            Inactive
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="text-right pt-6">
        <button
          onClick={handleSubmit}
          className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-6 py-2 rounded-md text-sm font-medium"
        >
          Update Staff
        </button>
      </div>
    </div>
  );
};

export default EditStaffForm;

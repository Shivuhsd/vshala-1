import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SchoolForm = ({ editData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    is_active: true,
    enrollmentPrefix: "",
    enrollmentBase: "",
    enrollmentPadding: "",
    admissionPrefix: "",
    admissionBase: "",
    admissionPadding: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.label || "",
        phone: editData.phone_number || "",
        email: editData.email || "",
        address: editData.address || "",
        is_active: editData.is_active ?? true,
        enrollmentPrefix: editData.enrollment_prefix || "",
        enrollmentBase: editData.enrollment_base || "",
        enrollmentPadding: editData.enrollment_padding || "",
        admissionPrefix: editData.admission_prefix || "",
        admissionBase: editData.admission_base || "",
        admissionPadding: editData.admission_padding || "",
      });
    }
  }, [editData]);

  const getEnrollmentPreview = () => {
    const { enrollmentPrefix, enrollmentBase, enrollmentPadding } = formData;
    return `${enrollmentPrefix}${String(enrollmentBase || "").padStart(
      parseInt(enrollmentPadding || 0),
      "0"
    )}`;
  };

  const getAdmissionPreview = () => {
    const { admissionPrefix, admissionBase, admissionPadding } = formData;
    return `${admissionPrefix}${String(admissionBase || "").padStart(
      parseInt(admissionPadding || 0),
      "0"
    )}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("School Name is required");
      return;
    }

    setLoading(true);

    const payload = {
      label: formData.name,
      phone_number: formData.phone,
      email: formData.email,
      address: formData.address,
      is_active: formData.is_active,
      enrollment_prefix: formData.enrollmentPrefix,
      enrollment_base: parseInt(formData.enrollmentBase || 0),
      enrollment_padding: parseInt(formData.enrollmentPadding || 0),
      admission_prefix: formData.admissionPrefix,
      admission_base: parseInt(formData.admissionBase || 0),
      admission_padding: parseInt(formData.admissionPadding || 0),
      last_enrollment_count: 0,
      last_invoice_count: 0,
      last_payment_count: 0,
      last_admission_count: 0,
      last_certificate_count: 0,
    };

    try {
      if (editData) {
        await axiosInstance.put(`admin/v1/school/${editData.id}/`, payload);
        toast.success("School updated successfully!");
      } else {
        await axiosInstance.post("admin/v1/schools/", payload);
        toast.success("New school added successfully!");
      }

      setTimeout(() => {
        setLoading(false);
        onCancel();
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error("❌ Backend Error:", error.response?.data);
      const message =
        error.response?.data?.detail ||
        "Something went wrong while saving school data.";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {editData ? "Edit School" : "Add New School"}
        </h2>
        <button
          onClick={onCancel}
          className="text-sm text-purple-700 hover:underline"
        >
          View All
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">School Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 mt-1 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 mt-1 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 mt-1 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 mt-1 text-sm"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium block mb-2">Status</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="is_active"
                value="true"
                checked={formData.is_active === true || formData.is_active === "true"}
                onChange={() => setFormData((prev) => ({ ...prev, is_active: true }))}
              />
              Active
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="is_active"
                value="false"
                checked={formData.is_active === false || formData.is_active === "false"}
                onChange={() => setFormData((prev) => ({ ...prev, is_active: false }))}
              />
              Inactive
            </label>
          </div>
        </div>

        {/* Enrollment Details */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Enrollment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="enrollmentPrefix"
              value={formData.enrollmentPrefix || ""}
              onChange={handleChange}
              placeholder="Prefix"
              className="border rounded-md px-4 py-2 text-sm"
            />
            <input
              type="number"
              name="enrollmentBase"
              value={formData.enrollmentBase || ""}
              onChange={handleChange}
              placeholder="Base"
              className="border rounded-md px-4 py-2 text-sm"
            />
            <input
              type="number"
              name="enrollmentPadding"
              value={formData.enrollmentPadding || ""}
              onChange={handleChange}
              placeholder="Padding"
              className="border rounded-md px-4 py-2 text-sm"
            />
            <input
              type="text"
              disabled
              value={getEnrollmentPreview()}
              className="border rounded-md px-4 py-2 text-sm bg-gray-100"
              placeholder="Preview"
            />
          </div>
        </div>

        {/* Admission Details */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Admission Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="admissionPrefix"
              value={formData.admissionPrefix || ""}
              onChange={handleChange}
              placeholder="Prefix"
              className="border rounded-md px-4 py-2 text-sm"
            />
            <input
              type="number"
              name="admissionBase"
              value={formData.admissionBase || ""}
              onChange={handleChange}
              placeholder="Base"
              className="border rounded-md px-4 py-2 text-sm"
            />
            <input
              type="number"
              name="admissionPadding"
              value={formData.admissionPadding || ""}
              onChange={handleChange}
              placeholder="Padding"
              className="border rounded-md px-4 py-2 text-sm"
            />
            <input
              type="text"
              disabled
              value={getAdmissionPreview()}
              className="border rounded-md px-4 py-2 text-sm bg-gray-100"
              placeholder="Preview"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md font-medium transition ${
              loading
                ? "bg-purple-400 cursor-not-allowed text-white"
                : "bg-purple-700 hover:bg-purple-800 text-white"
            }`}
          >
            {loading
              ? editData
                ? "Updating..."
                : "Adding..."
              : editData
              ? "Update School"
              : "Add New School"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchoolForm;

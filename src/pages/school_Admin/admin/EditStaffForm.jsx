// src/pages/school_Admin/admin/EditStaffForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";

const EditStaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedSchool, selectedSession } = useSchool();

  const [formData, setFormData] = useState(null);
const [classOptions, setClassOptions] = useState([]); // list of classes
const [sectionOptions, setSectionOptions] = useState([]); // sections of selected class

useEffect(() => {
  const fetchClassSections = async () => {
    try {
      const res = await axiosInstance.get(
        `/schools/v1/schools/classes/links/?school_id=${selectedSchool?.id}&session_id=${selectedSession?.id}`
      );

      const classes = res.data.results || [];
      setClassOptions(classes);

      // Preload sections if staff already has class_s
      const selectedClass = classes.find(c => c.class_id === formData?.class_s);
      setSectionOptions(selectedClass?.sections || []);
    } catch (err) {
      console.error("Failed to fetch classes/sections", err);
    }
  };

  if (selectedSchool) fetchClassSections();
}, [selectedSchool, selectedSession, formData?.class_s]);



const [roles, setRoles] = useState([]);

useEffect(() => {
  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get("/accounts/v1/roles/"); // adjust URL
      setRoles(res.data.roles || []);
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  fetchRoles();
}, []);





  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axiosInstance.get(`/schools/v1/staff/${id}/`);
        const data = res.data;

        setFormData({
          name: data.name || "",
          gender: data.gender || "",
          dob: data.dob || "",
          phone_number: data.phone_number || "",
          email: data.email || "",
          address: data.address || "",
          joining_date: data.joining_date || "",
          role: data.role || "",
          salary: data.salary || "",
          designation: data.designation || "",
          description: data.note || "",
          class_s: data.class_s || "",
          section: data.section || "",
          bus_in_charge: data.bus_in_charge ? "yes" : "no",
          login_option: data.username ? "existing_user" : "disallow",
          username: data.username || "",
          login_email: data.login_email || "",
          password: "",
          is_active: data.is_active ?? true,
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
    if (name === "phone_number" && !/^\d{0,10}$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return toast.error("Name is required.");
    if (!/^\d{10}$/.test(formData.phone_number))
      return toast.error("Phone must be 10 digits.");

    const payload = {
      name: formData.name,
      gender: formData.gender,
      dob: formData.dob,
      phone_number: formData.phone_number,
      email: formData.email,
      address: formData.address,
      joining_date: formData.joining_date,
      role: formData.role,
      salary: formData.salary,
      designation: formData.designation,
      note: formData.description,
      class_s: formData.class_s,
      section: formData.section,
      bus_in_charge: formData.bus_in_charge === "yes",
      username: formData.username || null,
      login_email: formData.login_email || null,
      password: formData.password || null,
      is_active: formData.is_active,
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

      {/* Personal Details */}
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
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone *"
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
            name="joining_date"
            value={formData.joining_date}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          />
         <select
  name="role"
  value={formData.role}
  onChange={handleChange}
  className="border rounded px-3 py-2 text-sm"
>
  <option value="">Select Role</option>
  {roles.map((r) => (
    <option key={r.id} value={r.id}>
      {r.name}
    </option>
  ))}
</select>

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

<section>
  <h3 className="text-lg font-semibold text-gray-700 mb-4">
    Class Teacher
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* Class Dropdown */}
    <select
      name="class_s"
      value={formData.class_s}
      onChange={(e) => {
        const selectedClassId = e.target.value;
        const selectedClass = classOptions.find(c => c.class_id === selectedClassId);
        setFormData(prev => ({
          ...prev,
          class_s: selectedClassId,
          section: "", // reset section
        }));
        setSectionOptions(selectedClass?.sections || []);
      }}
      className="border rounded px-3 py-2 text-sm"
    >
      <option value="">Select Class</option>
      {classOptions.map(cls => (
        <option key={cls.class_id} value={cls.class_id}>
          {cls.class_label}
        </option>
      ))}
    </select>

    {/* Section Dropdown */}
    <select
      name="section"
      value={formData.section}
      onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
      className="border rounded px-3 py-2 text-sm"
      disabled={!formData.class_s} // only if class is selected
    >
      <option value="">Select Section</option>
      {sectionOptions.map(sec => (
        <option key={sec.id} value={sec.id}>
          {sec.label}
        </option>
      ))}
    </select>
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
              name="bus_in_charge"
              value="yes"
              checked={formData.bus_in_charge === "yes"}
              onChange={handleChange}
            />
            Yes
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="radio"
              name="bus_in_charge"
              value="no"
              checked={formData.bus_in_charge === "no"}
              onChange={handleChange}
            />
            No
          </label>
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
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="login_email"
              value={formData.login_email}
              onChange={handleChange}
              placeholder="Login Email"
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              name="password"
              value={formData.password}
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
              onChange={() =>
                setFormData((p) => ({ ...p, is_active: true }))
              }
            />{" "}
            Active
          </label>
          <label>
            <input
              type="radio"
              name="is_active"
              value="false"
              checked={formData.is_active === false}
              onChange={() =>
                setFormData((p) => ({ ...p, is_active: false }))
              }
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

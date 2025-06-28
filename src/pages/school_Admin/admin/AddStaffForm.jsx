import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";

const PERMISSIONS = ["Manage Inquiries", "Manage Admissions"];

const AddStaffForm = () => {
  const navigate = useNavigate();
  const { selectedSchool, selectedSession } = useSchool();
  const { staffId } = useParams(); // edit mode support

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    join_date: "",
    role: "",
    salary: "",
    designation: "",
    note: "",
    class: "",
    section: "",
    is_bus_incharge: "no",
    login_option: "disallow",
    username: "",
    login_email: "",
    password: "",
    is_active: true,
  });

  const [permissions, setPermissions] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    const fetchClassAndSections = async () => {
      if (!selectedSchool?.id || !selectedSession?.id) return;
      try {
        const res = await axiosInstance.get(
          `/schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
        );
        setClassOptions(res.data?.results || []);
      } catch (err) {
        toast.error("Failed to load class/section options");
      }
    };

    fetchClassAndSections();
  }, [selectedSchool?.id, selectedSession?.id]);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!selectedSchool?.id) return;
      try {
        const res = await axiosInstance.get(
          `accounts/v1/roles?school_id=${selectedSchool.id}`
        );
        const data = res.data.roles;
        const roles = Array.isArray(data) ? data : data?.roles || [];
        setRoleOptions(roles);
      } catch (err) {
        toast.error("Failed to load roles");
      }
    };

    fetchRoles();
  }, [selectedSchool?.id]);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      if (!staffId) return;
      try {
        const res = await axiosInstance.get(`schools/v1/staffs/${staffId}/`);
        const data = res.data;
        setFormData({
          name: data.name || "",
          gender: data.gender || "",
          dob: data.dob || "",
          phone: data.phone_number || "",
          email: data.email || "",
          address: data.address || "",
          join_date: data.joining_date || "",
          role: data.role || "",
          salary: data.salary || "",
          designation: data.designation || "",
          note: data.note || "",
          class: data.class_s || "",
          section: data.section || "",
          is_bus_incharge: data.bus_in_charge ? "yes" : "no",
          login_option: data.username ? "new_user" : "disallow",
          username: data.username || "",
          login_email: data.login_email || "",
          password: "",
          is_active: data.is_active,
        });

        if (data.profile_photo) setPhotoPreview(data.profile_photo);
        setPermissions(data.permissions || []);
        const foundClass = classOptions.find((c) => c.id === data.class_s);
        setSectionOptions(foundClass?.sections || []);
      } catch (err) {
        toast.error("Failed to load staff details");
      }
    };

    fetchStaffDetails();
  }, [staffId, classOptions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePermission = (perm) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      toast.error("Only JPG, PNG, or JPEG images allowed.");
      return;
    }
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Name is required.");
    if (!/^\d{10}$/.test(formData.phone))
      return toast.error("Phone must be 10 digits.");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("gender", formData.gender);
    payload.append("dob", formData.dob);
    payload.append("address", formData.address);
    payload.append("phone_number", formData.phone);
    payload.append("joining_date", formData.join_date);
    payload.append("role", formData.role);
    payload.append("salary", formData.salary);
    payload.append("designation", formData.designation);
    payload.append("note", formData.note);
    payload.append("bus_in_charge", formData.is_bus_incharge === "yes");
    payload.append("is_active", formData.is_active);
    payload.append("tenant", selectedSchool?.id);
    payload.append("session", selectedSession?.id);
    payload.append("from_front", true);

    if (formData.class) payload.append("class_s", formData.class);
    if (formData.section) payload.append("section", formData.section);
    if (formData.login_option === "new_user") {
      payload.append("user_login_option", true);
      payload.append("username", formData.username);
      payload.append("login_email", formData.login_email);
      payload.append("password", formData.password);
    }
    permissions.forEach((perm) => payload.append("permissions", perm));
    if (profilePhoto) payload.append("profile_photo", profilePhoto);

    try {
      const url = staffId
        ? `schools/v1/staffs/${staffId}/`
        : "schools/v1/staffs/";
      const method = staffId ? "put" : "post";

      await axiosInstance[method](url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Staff ${staffId ? "updated" : "added"} successfully.`);
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${staffId ? "update" : "add"} staff.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 bg-white rounded-xl shadow">
      <ToastContainer />
      <div className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-[#6B21A8]"
          >
            <FiArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-[#6B21A8]">
            {staffId ? "Edit Staff" : "Add New Staff"}
          </h2>
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

      {/* Profile Photo */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Upload Profile Photo
        </h3>
        <div
          className="border-dashed border-2 border-gray-300 rounded-lg p-4 flex items-center justify-center flex-col cursor-pointer hover:border-purple-600 transition"
          onClick={() => document.getElementById("profilePhotoInput").click()}
        >
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full border"
            />
          ) : (
            <>
              <span className="text-gray-500 text-sm">
                Click to upload profile photo
              </span>
              <span className="text-xs text-gray-400">
                Only JPG, JPEG or PNG allowed
              </span>
            </>
          )}
        </div>
        <input
          type="file"
          name="profile_photo"
          id="profilePhotoInput"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
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
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">Select Role *</option>
            {roleOptions.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
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
            name="note"
            value={formData.note}
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
          <select
            name="class"
            value={formData.class}
            onChange={(e) => {
              const selected = e.target.value;
              const found = classOptions.find((c) => c.id === selected);
              setFormData((p) => ({ ...p, class: selected, section: "" }));
              setSectionOptions(found?.sections || []);
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">Select Class</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_label}
              </option>
            ))}
          </select>

          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="">Select Section</option>
            {sectionOptions.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.label}
              </option>
            ))}
          </select>
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
                checked={permissions.includes(perm)}
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
              value="new_user"
              checked={formData.login_option === "new_user"}
              onChange={handleChange}
            />{" "}
            New User
          </label>
        </div>
        {formData.login_option === "new_user" && (
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
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
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

      {/* Replace last submit button */}
      <div className="text-right pt-6">
        <button
          onClick={handleSubmit}
          className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-6 py-2 rounded-md text-sm font-medium"
        >
          {staffId ? "Update Staff" : "Submit Staff"}
        </button>
      </div>
    </div>
  );
};

export default AddStaffForm;

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext.jsx";
import "react-toastify/dist/ReactToastify.css";

const AddAdmissionForm = () => {
  const { selectedSchool, selectedSession } = useSchool();

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    admission_date: "",
    roll_number: "",
    class: "",
    section: "",
    group: "",
    religion: "",
    caste: "",
    blood_group: "",
    address: "",
    city: "",
    state: "",
    country: "",
    id_number: "",
    note: "",
    phone: "",
    email: "",
    father_name: "",
    father_phone: "",
    father_occupation: "",
    mother_name: "",
    mother_phone: "",
    mother_occupation: "",
    user_login_option: "disallow_login",
    parent_login_option: "disallow_login",
    username: "",
    login_email: "",
    password: "",
    parent_user_id: "",
    parent_username: "",
    parent_email: "",
    parent_password: "",
    is_active: true,
  });

  const [files, setFiles] = useState({
    photo: null,
    id_proof: null,
    parent_id_proof: null,
    parent_signature: null,
  });

  const [fileNames, setFileNames] = useState({});
  const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

  // ✅ New: Class, Section, Group and Subjects
  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  useEffect(() => {
    if (selectedSchool?.id && selectedSession?.id) {
 const fetchClasses = async () => {
  try {
    const res = await axiosInstance.get(
      `/schools/v1/schools/classes/links/?tenant=${selectedSchool.id}&session=${selectedSession.id}`
    );
    setClassOptions(res.data.results || []); // ✅ Correct the structure here
  } catch (err) {
    console.error("Failed to fetch classes", err);
    setClassOptions([]); // fallback to empty array
  }
};

      fetchClasses();
    }
  }, [selectedSchool?.id, selectedSession?.id]);

  useEffect(() => {
    if (formData.class) {
      const fetchGroups = async () => {
        try {
          const res = await axiosInstance.get(
            `/schools/v1/class/subject/group/?class_id=${formData.class}`
          );
          setGroupOptions(res.data?.subject_groups || []);
        } catch (err) {
          console.error("Failed to fetch subject groups", err);
        }
      };

      const selectedClass = classOptions.find((cls) => cls.id === formData.class);
      setSectionOptions(selectedClass?.sections || []);
      fetchGroups();
    }
  }, [formData.class]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["name", "father_name", "mother_name"].includes(name) && /\d/.test(value)) return;
    if (["phone", "father_phone", "mother_phone"].includes(name) && !/^\d{0,10}$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    const file = inputFiles[0];

    if (file && !allowedFileTypes.includes(file.type)) {
      toast.error("Only PDF and image files (jpg, png) are allowed.");
      return;
    }

    setFiles((prev) => ({ ...prev, [name]: file }));
    setFileNames((prev) => ({ ...prev, [name]: file?.name }));
  };

  const renderFileInput = (label, name) => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="file"
        name={name}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf"
        title="Upload JPG, PNG or PDF only"
        className="border px-4 py-2 rounded"
      />
      {fileNames[name] && (
        <span className="text-xs text-green-600 mt-1">Selected: {fileNames[name]}</span>
      )}
    </div>
  );

const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!/^\d{10}$/.test(formData.phone)) return "Phone must be exactly 10 digits.";
    if (!formData.roll_number.trim()) return "Roll number is required.";
    if (!formData.class) return "Class is required.";
    if (!formData.section) return "Section is required.";
    if (!formData.group) return "Group is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return toast.error(error);

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") payload.append(key, value);
    });

    payload.append("tenant", selectedSchool?.id);
    payload.append("session", selectedSession?.id);
    payload.append("from_front", true);
    payload.append("gdpr_agreed", true);

    Object.entries(files).forEach(([key, file]) => {
      if (file) payload.append(key, file);
    });

    try {
      await axiosInstance.post("/schools/v1/students/", payload);
      toast.success("Student admission submitted successfully.");
    } catch (error) {
      toast.error("Submission failed.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow space-y-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-[#6B21A8]">Add New Admission</h2>

      {/* Personal Details */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Student Name *" className="border px-4 py-2 rounded" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="border px-4 py-2 rounded">
            <option value="">Select Gender *</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="border px-4 py-2 rounded" />
          <input name="religion" value={formData.religion} onChange={handleChange} placeholder="Religion" className="border px-4 py-2 rounded" />
          <input name="caste" value={formData.caste} onChange={handleChange} placeholder="Caste" className="border px-4 py-2 rounded" />
          <input name="blood_group" value={formData.blood_group} onChange={handleChange} placeholder="Blood Group" className="border px-4 py-2 rounded" />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number (10 digits) *" className="border px-4 py-2 rounded" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="border px-4 py-2 rounded" />
          <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Full Address" className="border px-4 py-2 rounded col-span-3" />
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="border px-4 py-2 rounded" />
          <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="border px-4 py-2 rounded" />
          <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="border px-4 py-2 rounded" />
          <input name="id_number" value={formData.id_number} onChange={handleChange} placeholder="ID Number / UID" className="border px-4 py-2 rounded" />
          {renderFileInput("Upload ID Proof (PDF or Image)", "id_proof")}
        </div>
      </section>

      {/* Admission Details */}
      <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Admission Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="date" name="admission_date" value={formData.admission_date} onChange={handleChange} className="border px-4 py-2 rounded" />
          <input name="roll_number" value={formData.roll_number} onChange={handleChange} placeholder="Roll Number *" className="border px-4 py-2 rounded" />

          <select name="class" value={formData.class} onChange={handleChange} className="border px-4 py-2 rounded">
            <option value="">Select Class *</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.label}</option>
            ))}
          </select>

          <select name="section" value={formData.section} onChange={handleChange} className="border px-4 py-2 rounded">
            <option value="">Select Section *</option>
            {sectionOptions.map((sec) => (
              <option key={sec.id} value={sec.label}>{sec.label}</option>
            ))}
          </select>

          <select
            name="group"
            value={formData.group}
            onChange={(e) => {
              handleChange(e);
              const group = groupOptions.find((g) => g.id === e.target.value);
              setSelectedSubjects(group?.subjects || []);
            }}
            className="border px-4 py-2 rounded"
          >
            <option value="">Select Group *</option>
            {groupOptions.map((grp) => (
              <option key={grp.id} value={grp.id}>{grp.label} ({grp.code})</option>
            ))}
          </select>

          {renderFileInput("Upload Student Photo (PDF or Image)", "photo")}
        </div>

        {selectedSubjects.length > 0 && (
          <div className="mt-4 text-sm text-gray-700">
            <h4 className="font-medium mb-2">Subjects in Selected Group:</h4>
            <ul className="list-disc list-inside space-y-1">
              {selectedSubjects.map((subj) => (
                <li key={subj.id}>
                  {subj.label} – <span className="text-gray-600">{subj.subject_code}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
            <section>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Parent Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="father_name" value={formData.father_name} onChange={handleChange} placeholder="Father Name" className="border px-4 py-2 rounded" />
          <input name="father_phone" value={formData.father_phone} onChange={handleChange} placeholder="Father Phone" className="border px-4 py-2 rounded" />
          <input name="father_occupation" value={formData.father_occupation} onChange={handleChange} placeholder="Father Occupation" className="border px-4 py-2 rounded" />
          <input name="mother_name" value={formData.mother_name} onChange={handleChange} placeholder="Mother Name" className="border px-4 py-2 rounded" />
          <input name="mother_phone" value={formData.mother_phone} onChange={handleChange} placeholder="Mother Phone" className="border px-4 py-2 rounded" />
          <input name="mother_occupation" value={formData.mother_occupation} onChange={handleChange} placeholder="Mother Occupation" className="border px-4 py-2 rounded" />
          {renderFileInput("Upload Parent Signature (PDF or Image)", "parent_signature")}
        </div>
      </section>

{/* Student Login */}
 <section>
<h3 className="text-lg font-semibold text-gray-700 mb-4">Student Login</h3>
   <div className="flex flex-wrap gap-4 text-sm mb-4">
     {["disallow_login", "existing_user", "new_user"].map((option) => (
      <label key={option} className="flex items-center gap-2">
        <input
          type="radio"
          name="user_login_option"
          value={option}
          checked={formData.user_login_option === option}
          onChange={handleChange}
        />
        {option.replace("_", " ")}
      </label>
    ))}
  </div>

  {formData.user_login_option === "existing_user" && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Student Username"
        className="border px-4 py-2 rounded"
      />
    </div>
  )}

  {formData.user_login_option === "new_user" && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Student Username"
        className="border px-4 py-2 rounded"
      />
      <input
        name="login_email"
        value={formData.login_email}
        onChange={handleChange}
        placeholder="Student Email"
        className="border px-4 py-2 rounded"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Student Password"
        className="border px-4 py-2 rounded"
      />
    </div>
  )}
</section>

{/* Parent Login */}
<section>
  <h3 className="text-lg font-semibold text-gray-700 mb-4">Parent Login</h3>
  <div className="flex flex-wrap gap-4 text-sm mb-4">
    {["disallow_login", "existing_user", "new_user"].map((option) => (
      <label key={option} className="flex items-center gap-2">
        <input
          type="radio"
          name="parent_login_option"
          value={option}
          checked={formData.parent_login_option === option}
          onChange={handleChange}
        />
        {option.replace("_", " ")}
      </label>
    ))}
  </div>

  {formData.parent_login_option === "existing_user" && (
    <input
      name="parent_user_id"
      value={formData.parent_user_id}
      onChange={handleChange}
      placeholder="Parent Username"
      className="border px-4 py-2 rounded w-full md:w-1/2"
    />
  )}

  {formData.parent_login_option === "new_user" && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        name="parent_username"
        value={formData.parent_username || ""}
        onChange={handleChange}
        placeholder="Parent Username"
        className="border px-4 py-2 rounded"
      />
      <input
        name="parent_email"
        value={formData.parent_email || ""}
        onChange={handleChange}
        placeholder="Parent Email"
        className="border px-4 py-2 rounded"
      />
      <input
        type="password"
        name="parent_password"
        value={formData.parent_password || ""}
        onChange={handleChange}
        placeholder="Parent Password"
        className="border px-4 py-2 rounded"
      />
    </div>
  )}
</section>


      {/* Status and Notes */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select name="is_active" value={formData.is_active ? "true" : "false"} onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.value === "true" }))} className="border px-4 py-2 rounded">
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <input name="note" value={formData.note} onChange={handleChange} placeholder="Notes (optional)" className="border px-4 py-2 rounded" />
      </section>

      {/* Submit Button */}
      <div className="pt-6">
        <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-[#6B21A8] hover:bg-[#9333EA] text-white rounded-md font-medium">
          Submit Admission
        </button>
      </div>
    </div>
  );
};

export default AddAdmissionForm;

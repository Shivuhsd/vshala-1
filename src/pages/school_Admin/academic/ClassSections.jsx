import React, { useState, useEffect } from "react";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import { useSchool } from "../context/SchoolContext";
import axiosInstance from "../../../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClassSections = () => {
  const { selectedSchool, selectedSession } = useSchool();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null); // class_link UUID
  const [sections, setSections] = useState([]);
  const [sectionInput, setSectionInput] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);

  // ✅ Fetch class links
  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedSchool?.id || !selectedSession?.id) return;

      try {
        const res = await axiosInstance.get(
          `schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
        );
        setClasses(res.data.results || []);
      } catch (err) {
        console.error("Failed to fetch classes", err);
        toast.error("Failed to load class list");
      }
    };

    fetchClasses();
  }, [selectedSchool?.id, selectedSession?.id]);

  // ✅ Fetch sections for selected class
  useEffect(() => {
    if (!selectedClassId) return;

    const fetchSections = async () => {
      try {
        const res = await axiosInstance.get(`admin/v1/sections/?class_link=${selectedClassId}`);
        setSections(res.data || []);
      } catch (err) {
        console.error("Failed to fetch sections", err);
        toast.error("Failed to load sections");
      }
    };

    fetchSections();
  }, [selectedClassId]);

  // ✅ Add or Update Section
  const handleSubmitSection = async () => {
    if (!sectionInput.trim()) return;

    const payload = {
      label: sectionInput.trim(),
      class_link: selectedClassId,
      is_default: isDefault,
    };

    try {
      setLoading(true);

      if (editingSectionId) {
        const res = await axiosInstance.put(`admin/v1/section/${editingSectionId}/`, payload);
        setSections((prev) =>
          prev.map((sec) => (sec.id === editingSectionId ? res.data : sec))
        );
        toast.success("Section updated");
      } else {
        const res = await axiosInstance.post("admin/v1/sections/", payload);
        setSections((prev) => [...prev, res.data]);
        toast.success(`Section "${res.data.label}" added successfully`);
      }

      // Reset form
      setSectionInput("");
      setIsDefault(false);
      setEditingSectionId(null);
    } catch (err) {
      console.error("Failed to save section", err.response?.data || err.message);
      toast.error("Failed to save section");
    } finally {
      setLoading(false);
    }
  };

  const selectedClass = classes.find((cls) => cls.id === selectedClassId);

  return (
    <div className="space-y-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl font-bold text-[#6B21A8]">Class Sections</h1>

      {/* Class Table */}
      <div className="bg-white rounded-xl shadow border border-[#E2E8F0] overflow-x-auto">
        <table className="min-w-full text-sm text-[#334155]">
          <thead className="bg-[#F1F5F9] text-left">
            <tr className="uppercase text-xs tracking-wide text-gray-600">
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Sections</th>
              <th className="px-4 py-3">Total Students</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{cls.class_label}</td>
                <td className="px-4 py-2">{cls.sections?.length}</td>
                <td className="px-4 py-2">—</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedClassId(cls.id)}
                    className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-1 rounded text-sm font-medium"
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manage View */}
      {selectedClass && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section Table */}
          <div className="bg-white shadow rounded-xl border border-[#E2E8F0] p-5">
            <h2 className="text-lg font-semibold text-[#334155] mb-4">
              Sections in <span className="text-[#6B21A8]">{selectedClass.class_label}</span>
            </h2>
            <table className="min-w-full text-sm text-[#334155]">
              <thead className="bg-[#F1F5F9]">
                <tr className="uppercase text-xs text-gray-600 tracking-wide">
                  <th className="px-3 py-2">Section</th>
                  <th className="px-3 py-2">Total Students</th>
                  <th className="px-3 py-2">Edit</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((sec) => (
                  <tr key={sec.id} className="border-t hover:bg-gray-50">
                    <td className="px-3 py-2">{sec.label}{sec.is_default ? " - Default" : ""}</td>
                    <td className="px-3 py-2">0</td>
                    {/* <td className="px-3 py-2">—</td> */}
                    <td className="px-3 py-2">
                      <button
                        onClick={() => {
                          setSectionInput(sec.label);
                          setIsDefault(sec.is_default);
                          setEditingSectionId(sec.id);
                        }}
                        className="text-[#6B21A8] hover:underline flex items-center gap-1 text-sm"
                      >
                        <FiEdit2 />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Section Form */}
          <div className="bg-white shadow rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#334155]">
                {editingSectionId ? "Edit Section" : "Add New Section"}
              </h2>
              <button
                onClick={() => {
                  setSelectedClassId(null);
                  setEditingSectionId(null);
                  setSectionInput("");
                  setIsDefault(false);
                }}
                className="text-sm text-[#6B21A8] border border-[#6B21A8] px-3 py-1 rounded hover:bg-purple-50 font-medium"
              >
                View All Classes
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Section</label>
                <input
                  type="text"
                  value={sectionInput}
                  onChange={(e) => setSectionInput(e.target.value)}
                  placeholder="Enter section name"
                  className="w-full border border-[#E2E8F0] rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="accent-[#6B21A8]"
                />
                <label className="text-sm text-gray-700">Set as default section?</label>
              </div>

              <button
                onClick={handleSubmitSection}
                disabled={loading || !sectionInput.trim()}
                className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              >
                <FiPlusCircle />
                {loading
                  ? editingSectionId
                    ? "Saving..."
                    : "Adding..."
                  : editingSectionId
                  ? "Save Changes"
                  : "Add Section"}
              </button>

              {editingSectionId && (
                <button
                  onClick={() => {
                    setEditingSectionId(null);
                    setSectionInput("");
                    setIsDefault(false);
                  }}
                  className="text-sm text-red-600 mt-2 hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSections;

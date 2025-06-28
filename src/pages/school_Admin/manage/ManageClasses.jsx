import React, { useEffect, useState } from "react";
import { useSchool } from "../context/SchoolContext";
import { FiPlusCircle, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageClasses = () => {
  const { selectedSchool, selectedSession } = useSchool();
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [editingClassId, setEditingClassId] = useState(null);
  const [editedClassName, setEditedClassName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAssigned = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
      );
      const links = res.data.results || [];
      setAssignedClasses(
        links.map((link) => ({
          label: link.class_label || link.label || "Unnamed Class",
          link_id: link.id,
        }))
      );
    } catch (err) {
      console.error("Error fetching assigned classes:", err);
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSchool.id && selectedSession.id) {
      fetchAssigned();
    }
  }, [selectedSchool.id, selectedSession.id]);

  const handleAddClass = async () => {
    const trimmedName = newClassName.trim();
    if (!trimmedName) return toast.error("Please enter a class name.");
    if (
      assignedClasses.some(
        (cls) => cls.label.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      return toast.info("Class already exists.");
    }

    setLoading(true);
    try {
      const payload = {
        class_label: trimmedName,
        tenant: selectedSchool.id,
        session: selectedSession.id,
      };
      const res = await axiosInstance.post(
        "schools/v1/schools/classes/links/",
        payload
      );

      const newClass = {
        label: res.data.class_label || trimmedName,
        link_id: res.data.id,
      };

      setAssignedClasses((prev) => [...prev, newClass]);
      toast.success(`Class "${newClass.label}" added successfully`);
      setNewClassName("");
    } catch (err) {
      console.error("Error adding class:", err.response?.data || err.message);
      toast.error("Failed to add class");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (link_id) => {
    setLoading(true);
    try {
      await axiosInstance.delete(`schools/v1/schools/classes/link/${link_id}/`);
      setAssignedClasses((prev) => prev.filter((c) => c.link_id !== link_id));
      toast.success("Class removed successfully");
    } catch (err) {
      console.error("Error removing class:", err.response?.data || err.message);
      toast.error("Failed to remove class");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (cls) => {
    setEditingClassId(cls.link_id);
    setEditedClassName(cls.label);
  };

  const handleCancelEdit = () => {
    setEditingClassId(null);
    setEditedClassName("");
  };

  const handleSaveEdit = async (cls) => {
    if (!editedClassName.trim())
      return toast.error("Class name cannot be empty");

    setLoading(true);
    try {
      const payload = {
        class_label: editedClassName.trim(),
        tenant: selectedSchool.id,
      };
      await axiosInstance.put(
        `schools/v1/schools/classes/link/${cls.link_id}/`,
        payload
      );

      setAssignedClasses((prev) =>
        prev.map((item) =>
          item.link_id === cls.link_id
            ? { ...item, label: editedClassName.trim() }
            : item
        )
      );

      toast.success("Class updated successfully");
      setEditingClassId(null);
      setEditedClassName("");
    } catch (err) {
      console.error("Edit error:", err.response?.data || err.message);
      toast.error("Failed to update class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Title */}
      <div className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 shadow-md">
        <h1 className="text-2xl font-semibold">Manage Classes</h1>
        <p className="text-sm mt-1">
          Manage classes for <strong>{selectedSchool?.label}</strong> –{" "}
          <strong>{selectedSession?.label}</strong>
        </p>
      </div>

      {/* Add Class Input */}
      <div className="bg-white rounded-xl p-5 shadow flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="Enter new class name"
          className="border border-gray-300 px-4 py-2 rounded-md text-sm w-full sm:w-auto"
        />
        <button
          onClick={handleAddClass}
          disabled={loading || !newClassName.trim()}
          className={`${
            loading || !newClassName.trim()
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-800"
          } text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm`}
        >
          <FiPlusCircle />
          {loading ? "Saving..." : "Add Class"}
        </button>
      </div>

      {/* Class List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Assigned Classes
        </h2>
        {assignedClasses.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No classes added yet.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {assignedClasses.map((cls) => (
              <li
                key={cls.link_id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow transition"
              >
                <div className="w-full">
                  {editingClassId === cls.link_id ? (
                    <input
                      value={editedClassName}
                      onChange={(e) => setEditedClassName(e.target.value)}
                      className="border border-gray-300 px-3 py-1 rounded w-full text-sm"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{cls.label}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4 text-sm">
                  {editingClassId === cls.link_id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(cls)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleStartEdit(cls)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleRemove(cls.link_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageClasses;

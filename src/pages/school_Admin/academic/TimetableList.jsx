import React, { useState, useEffect } from "react";
import { FiEye, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import TimetableGrid from "./TimetableGrid";
import RoutineFormModal from "./RoutineFormModal";
import "react-toastify/dist/ReactToastify.css";

const TimetableList = () => {
  const { selectedSchool, selectedSession } = useSchool();
  const [timetables, setTimetables] = useState([]);
  const [viewTimetable, setViewTimetable] = useState(null);
  const [editData, setEditData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTimetables = async () => {
    try {
      const res = await axiosInstance.get(
        `/schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
      );
      setTimetables(res.data.results || []);
    } catch (err) {
      toast.error("Failed to load timetables");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this routine?")) {
      try {
        await axiosInstance.delete(`/admin/v1/sections/${id}/`);
        fetchTimetables();
        toast.success("Deleted successfully");
      } catch {
        toast.error("Failed to delete routine");
      }
    }
  };

  useEffect(() => {
    if (selectedSchool?.id && selectedSession?.id) {
      fetchTimetables();
    }
  }, [selectedSchool?.id, selectedSession?.id]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#6B21A8]">Timetable</h1>
        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
        >
          <FiPlusCircle />
          Add New Routine
        </button>
      </div>

      <div className="bg-white shadow rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="min-w-full text-sm text-[#334155]">
          <thead className="bg-[#F1F5F9] text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Section</th>
              <th className="px-4 py-3 text-left">View</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{row.class_label}</td>
                <td className="px-4 py-2">{row.section_label}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setViewTimetable(row)}
                    className="text-sm text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <FiEye />
                    View Timetable
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="text-sm text-red-600 hover:underline flex items-center gap-1"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <RoutineFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialData={editData}
          onSaved={fetchTimetables}
        />
      )}

      {viewTimetable && (
        <TimetableGrid
          classData={viewTimetable}
          onClose={() => setViewTimetable(null)}
        />
      )}
    </div>
  );
};

export default TimetableList;

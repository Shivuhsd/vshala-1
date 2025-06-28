import React, { useState, useEffect, useMemo } from "react";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import SubjectModal from "../../../components/modals/SubjectModal";
import { useSchool } from "../../school_Admin/context/SchoolContext";
import "react-toastify/dist/ReactToastify.css";

const Subjects = () => {
  const { selectedSchool, selectedSession } = useSchool();
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const fetchSubjects = async () => {
    try {
      const res = await axiosInstance.get("/schools/v1/subjects/");
      setSubjects(res.data || []);

      console.log("Subjects fetched:", res.data);
    } catch (err) {
      toast.error("Failed to load subjects");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openAddModal = () => {
    setEditSubject(null);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      const payload = {
        label: data.label,
        subject_type: data.subject_type,
        session: selectedSession?.id,
        tenant: selectedSchool?.id,
      };

      if (data.id) {
        // Edit
        await axiosInstance.put(`/schools/v1/subject/${data.id}/`, payload);
        toast.success("Subject updated");
      } else {
        // Add
        await axiosInstance.post("/schools/v1/subjects/", payload);
        toast.success("Subject added");
      }

      setModalOpen(false);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save subject");
    }
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      (s) =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subject_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subjects, searchQuery]);

  const totalPages =
    rowsPerPage === "All" ? 1 : Math.ceil(filteredSubjects.length / rowsPerPage);

  const currentSubjects =
    rowsPerPage === "All"
      ? filteredSubjects
      : filteredSubjects.slice(
          (currentPage - 1) * rowsPerPage,
          currentPage * rowsPerPage
        );

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-grow space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-[#6B21A8]">Subjects</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name or type..."
              className="border border-[#E2E8F0] rounded px-3 py-2 text-sm w-full sm:w-64"
            />
            <button
              onClick={openAddModal}
              className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <FiPlusCircle />
              Add Subject
            </button>
            <Link
              to="/school-admin/academic/subjects/group"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center"
            >
              Group Subjects
            </Link>
          </div>
        </div>

        {/* Entry Selector */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                const val = e.target.value;
                setRowsPerPage(val === "All" ? "All" : parseInt(val));
                setCurrentPage(1);
              }}
              className="border border-[#E2E8F0] rounded px-2 py-1 text-sm"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value="All">All</option>
            </select>
            <span>entries</span>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="bg-white shadow rounded-xl border border-[#E2E8F0] overflow-x-auto">
          <table className="min-w-full text-sm text-[#334155]">
            <thead className="bg-[#F1F5F9] text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Subject Name</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSubjects.map((subj) => (
                <tr key={subj.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{subj.label}</td>
                  <td className="px-4 py-2">{subj.subject_type}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setEditSubject({
                          id: subj.id,
                          label: subj.label,
                          subject_type: subj.subject_type,
                        });
                        setModalOpen(true);
                      }}
                      className="text-sm text-purple-700 hover:underline flex items-center gap-1"
                    >
                      <FiEdit />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 px-4 py-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <SubjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editSubject}
      />
    </div>
  );
};

export default Subjects;

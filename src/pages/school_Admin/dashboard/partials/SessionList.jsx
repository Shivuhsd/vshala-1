import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiCalendar } from "react-icons/fi";
import axiosInstance from "../../../../services/axiosInstance";
import { useSchool } from "../../context/SchoolContext";

const SessionList = ({ onAddNew, onEdit }) => {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { selectedSchool } = useSchool();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axiosInstance.get(`admin/v1/sessions/?school_id=${selectedSchool.id}`,);
        console.log(response.data);
        setSessions(response.data || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  const filtered = sessions.filter((session) =>
    session.label.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages =
    pageSize === "All" ? 1 : Math.ceil(filtered.length / pageSize);

  const paginatedData =
    pageSize === "All"
      ? filtered
      : filtered.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (dir) => {
    setPage((prev) => {
      if (dir === "next" && prev < totalPages) return prev + 1;
      if (dir === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Sessions</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none w-full sm:w-64 text-sm"
          />
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-md hover:brightness-110 transition text-sm shadow"
          >
            <FiPlus /> Add New Session
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm bg-white rounded-lg">
          <thead className="bg-gray-50 text-gray-700 text-left text-sm">
            <tr>
              <th className="py-3 px-4 font-medium">Session</th>
              <th className="py-3 px-4 font-medium">Start Date</th>
              <th className="py-3 px-4 font-medium">End Date</th>
              <th className="py-3 px-4 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{s.label}</td>
                  <td className="py-3 px-4">{s.start_date}</td>
                  <td className="py-3 px-4">{s.end_date}</td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => onEdit(s)}
                      className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    {/* <button
                      onClick={() => alert("Confirm delete logic")}
                      className="text-red-600 hover:text-red-800 transition-transform hover:scale-110"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-10 px-4 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FiCalendar className="text-3xl" />
                    <p className="text-sm font-medium">No sessions found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const size = e.target.value === "All" ? "All" : parseInt(e.target.value);
              setPageSize(size);
              setPage(1);
            }}
            className="border rounded px-2 py-1 focus:outline-none"
          >
            {[25, 50, 100, "All"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span>
            of {filtered.length} {filtered.length === 1 ? "record" : "records"}
          </span>
        </div>

        {/* Pagination */}
        {pageSize !== "All" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={page === 1}
              className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionList;

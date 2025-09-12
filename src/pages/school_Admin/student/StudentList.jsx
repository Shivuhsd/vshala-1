import React, { useState, useEffect } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const searchFields = [
  { label: "Admission Number", value: "admission_number" },
  { label: "Name", value: "name" },
  { label: "Phone", value: "phone" },
  { label: "Email", value: "email" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
  { label: "Father Name", value: "father_name" },
  { label: "Father Phone", value: "father_phone" },
  { label: "Admission Date", value: "admission_date" },
  { label: "Enrollment Number", value: "enrollment_number" },
];

const StudentList = () => {
  const { selectedSchool, selectedSession } = useSchool();

  const [allStudents, setAllStudents] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);

  const [searchMode, setSearchMode] = useState("class");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [searchField, setSearchField] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchClassData = async () => {
    try {
      const res = await axiosInstance.get(
        `schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
      );
      setClassOptions(res.data.results || []);
    } catch {
      toast.error("Error fetching class data");
    }
  };

  const fetchStudents = async () => {
  if (!selectedSchool?.id || !selectedSession?.id) return;

  setLoading(true);
  try {
    let url = `schools/v1/students/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`;

    if (
      searchMode === "class" &&
      selectedClass &&
      selectedSection
    ) {
      url += `&class_id=${selectedClass}&section_id=${selectedSection}`;
    } else if (
      searchMode === "keyword" &&
      searchField &&
      searchKeyword.trim() !== ""
    ) {
      url += `&${searchField}=${searchKeyword.trim()}`;
    }

    const res = await axiosInstance.get(url);
    setAllStudents(res.data || []);
    setCurrentPage(1);
  } catch {
    toast.error("Failed to fetch students");
  } finally {
    setLoading(false);
  }
};


  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedSection("");
    const selected = classOptions.find((c) => c.id === classId);
    setSectionOptions(selected?.sections || []);
  };

  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const sortedStudents = [...allStudents].sort((a, b) => {
    if (!sortField) return 0;
    const valA = a[sortField] || "";
    const valB = b[sortField] || "";
    return sortDirection === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const paginatedStudents = sortedStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(allStudents.length / itemsPerPage);

useEffect(() => {
  if (selectedSchool?.id && selectedSession?.id) {
    fetchClassData();
    fetchStudents(); // ✅ fetch all students on page load
  }
}, [selectedSchool?.id, selectedSession?.id]);


  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Student Records
      </h2>

      {/* Search Mode Toggle */}
      <div className="flex gap-6 mb-6 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="class"
            checked={searchMode === "class"}
            onChange={() => setSearchMode("class")}
          />
          Search by Class & Section
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="keyword"
            checked={searchMode === "keyword"}
            onChange={() => setSearchMode("keyword")}
          />
          Search by Keyword
        </label>
      </div>

      {/* Search Inputs */}
      {searchMode === "class" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="border rounded px-4 py-2 bg-white shadow text-gray-800"
          >
            <option value="">Select Class</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_label}
              </option>
            ))}
          </select>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="border rounded px-4 py-2 bg-white shadow text-gray-800"
            disabled={!selectedClass}
          >
            <option value="">Select Section</option>
            {sectionOptions.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.label}
              </option>
            ))}
          </select>
          <button
            onClick={fetchStudents}
            disabled={!selectedClass || !selectedSection}
            className="bg-blue-600 text-white rounded px-4 py-2 shadow hover:bg-blue-700 disabled:opacity-50"
          >
            Get Students
          </button>
        </div>
      )}

      {searchMode === "keyword" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="border px-4 py-2 rounded text-sm bg-white shadow"
          >
            <option value="">Select Field</option>
            {searchFields.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter keyword"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="border px-4 py-2 rounded text-sm bg-white shadow"
          />
          <button
            onClick={fetchStudents}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm"
          >
            Search
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-800">
            <tr>
              {[
                { label: "Name", key: "name" },
                { label: "Admission #", key: "admission_number" },
                { label: "Enrollment #", key: "enrollment_number" },
                { label: "Phone", key: "phone" },
                { label: "Class", key: "class_link" },
                { label: "Section", key: "section" },
                { label: "Father", key: "father_name" },
                { label: "Roll No", key: "roll_number" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="p-3 text-left cursor-pointer select-none"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortField === col.key && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Photo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center p-6 text-gray-500">
                  Loading students...
                </td>
              </tr>
            ) : paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center p-6 text-gray-500">
                  No students found.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((stu) => (
                <tr key={stu.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{stu.name}</td>
                  <td className="p-3">{stu.admission_number}</td>
                  <td className="p-3">{stu.enrollment_number}</td>
                  <td className="p-3">{stu.phone}</td>
                  <td className="p-3">{stu.class_link}</td>
                  <td className="p-3">{stu.section}</td>
                  <td className="p-3">{stu.father_name}</td>
                  <td className="p-3">{stu.roll_number}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        stu.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stu.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3">
                    {stu.photo ? (
                      <img
                        src={stu.photo}
                        alt="student"
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {allStudents.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-700 gap-4">
          <div className="flex items-center gap-2">
            <label>Rows per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="border rounded px-2 py-1 bg-white"
            >
              {[10, 25, 50, 100].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;

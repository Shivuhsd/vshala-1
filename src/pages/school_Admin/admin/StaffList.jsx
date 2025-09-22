import React, { useEffect, useState } from "react";
import { FiPlus, FiChevronDown, FiChevronUp, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";

const StaffList = () => {
  const navigate = useNavigate();
  const { selectedSchool,  selectedSession } = useSchool();

  const [staffList, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axiosInstance.get(`schools/v1/staffs/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`);
        setStaffList(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch staff");
      }
    };
    if (selectedSchool?.id) fetchStaff();
  }, [selectedSchool]);

  const toggleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FiChevronDown className="inline" />;
    return sortConfig.direction === "asc" ? <FiChevronUp className="inline" /> : <FiChevronDown className="inline" />;
  };

  const sortedStaff = [...staffList].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key]?.toString().toLowerCase() || "";
    const valB = b[sortConfig.key]?.toString().toLowerCase() || "";
    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredStaff = sortedStaff.filter((staff) =>
    Object.values(staff).some((val) =>
      val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#4C1D95]">Manage Staff</h2>
        <button
          onClick={() => navigate("/school-admin/staff/add")}
          className="flex items-center gap-2 bg-[#6B21A8] hover:bg-[#7E22CE] text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          <FiPlus />
          Add New Staff
        </button>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 border rounded-lg shadow-sm gap-4">
        <div className="text-sm text-gray-700">
          Show{" "}
          <select className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-purple-400">
            <option>25</option>
            <option>50</option>
            <option>100</option>
            <option>All</option>
          </select>{" "}
          entries
        </div>
        <input
          type="text"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-64 text-sm focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-[#F8FAFC] text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              {[
                { key: "photo", label: "Photo" },
                { key: "name", label: "Name" },
                { key: "phone_number", label: "Phone" },

                { key: "salary", label: "Salary" },
                { key: "designation", label: "Designation" },
                { key: "role", label: "Role" },
                { key: "login_email", label: "Login Email" },
                { key: "action", label: "Action" },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.key !== "action" && toggleSort(col.key)}
                  className={`px-4 py-3 text-left ${col.key !== "action" ? "cursor-pointer select-none" : ""}`}
                >
                  {col.label} {col.key !== "action" && renderSortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff, idx) => (
                <tr
                  key={staff.id}
                  className={`border-t ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                >
                  <td className="px-4 py-3">
                    {staff.profile_photo ? (
                      <img
                        src={staff.profile_photo}
                        alt={staff.name}
                        className="w-10 h-10 object-cover rounded-full border"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">{staff.name}</td>
                  <td className="px-4 py-3">{staff.phone_number}</td>
       
                  <td className="px-4 py-3">{staff.salary || "-"}</td>
                  <td className="px-4 py-3">{staff.designation || "-"}</td>
                  <td className="px-4 py-3">{staff.role || "-"}</td>
                  <td className="px-4 py-3">{staff.login_email || "-"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/school-admin/staff/edit/${staff.id}`)}
                      className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1"
                    >
                      <FiEdit2 className="inline" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                  No matching staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 text-sm text-gray-600 border-t bg-white rounded-b-lg gap-2">
          <span>
            Showing 1 to {filteredStaff.length} of {staffList.length} entries
          </span>
          <div className="flex gap-2">
            <button className="border px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Previous</button>
            <span className="px-3 font-semibold text-[#6B21A8]">1</span>
            <button className="border px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffList;

import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus, FiInbox, FiUserPlus } from "react-icons/fi";
import axiosInstance from "../../../../services/axiosInstance";
import { useNavigate } from "react-router-dom";

const SchoolList = ({ onAddNew, onEdit }) => {
  const [schoolData, setSchoolData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axiosInstance.get("admin/v1/schools/list/", {
          params: {
            page: page,
            per_page: pageSize === "All" ? total || 9999 : pageSize,
            search: search,
          },
        });
        setSchoolData(response.data.results || []);
        setTotal(response.data.total || 0);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    fetchSchools();
  }, [page, pageSize, search]);

  const handlePageChange = (direction) => {
    setPage((prev) => {
      if (direction === "next" && prev < Math.ceil(total / pageSize))
        return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const handleAddAdmin = (school) => {
    // Navigate to add admin page with school ID
    navigate(`/admin/schools/${school.id}/add-admin`);
  };

  const sortedData = [...schoolData].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (!sortConfig.key) return 0;

    if (typeof aVal === "string") {
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    }
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Schools</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search schools..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none w-full sm:w-64 text-sm"
          />
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-lg hover:brightness-110 transition text-sm shadow"
          >
            <FiPlus /> Add New School
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm bg-white rounded-lg">
          <thead className="bg-gray-50 text-gray-700 text-left text-sm">
            <tr>
              <th
                onClick={() => handleSort("label")}
                className="py-3 px-4 font-medium cursor-pointer"
              >
                School Name {renderSortIcon("label")}
              </th>
              <th
                onClick={() => handleSort("phone_number")}
                className="py-3 px-4 font-medium cursor-pointer"
              >
                Phone {renderSortIcon("phone_number")}
              </th>
              <th
                onClick={() => handleSort("email")}
                className="py-3 px-4 font-medium cursor-pointer"
              >
                Email {renderSortIcon("email")}
              </th>
              <th className="py-3 px-4 font-medium">Address</th>
              <th className="py-3 px-4 text-center font-medium">Classes</th>
              <th className="py-3 px-4 text-center font-medium">Admins</th>
              <th
                onClick={() => handleSort("is_active")}
                className="py-3 px-4 text-center font-medium cursor-pointer"
              >
                Status {renderSortIcon("is_active")}
              </th>
              <th className="py-3 px-4 text-center font-medium">Action</th>
              <th className="py-3 px-4 text-center font-medium">Add Admin</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((school) => (
                <tr
                  key={school.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{school.label}</td>
                  <td className="py-3 px-4">{school.phone_number}</td>
                  <td className="py-3 px-4">{school.email}</td>
                  <td className="py-3 px-4">{school.address}</td>
                  <td className="py-3 px-4 text-center">{school.classes}</td>
                  <td className="py-3 px-4 text-center">{school.admins}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        school.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {school.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => onEdit(school)}
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
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleAddAdmin(school)}
                      className="text-indigo-600 hover:text-indigo-800 transition-transform hover:scale-110"
                      title="Add Admin"
                    >
                      <FiUserPlus />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="py-10 px-4 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FiInbox className="text-3xl" />
                    <p className="text-sm font-medium">No schools available</p>
                    <p className="text-xs text-gray-400">
                      Click “Add New School” to get started.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-4 border-gray-100 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const size =
                e.target.value === "All" ? "All" : parseInt(e.target.value);
              setPageSize(size);
              setPage(1);
            }}
            className="border rounded px-2 py-1 focus:outline-none"
          >
            {[25, 50, 100, "All"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>
            of {total} {total === 1 ? "record" : "records"}
          </span>
        </div>

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
              Page {page} of {Math.ceil(total / pageSize)}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={page === Math.ceil(total / pageSize)}
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

export default SchoolList;

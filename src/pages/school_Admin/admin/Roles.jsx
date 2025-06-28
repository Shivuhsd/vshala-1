import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2 } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

const Roles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get(
          "accounts/v1/roles?school_id=${selectedSchool.id}"
        );
        setRoles(res.data.roles || []);
      } catch (error) {
        toast.error("Failed to fetch roles.");
      }
    };

    fetchRoles();
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#4C1D95]">Manage Roles</h1>
        <button
          onClick={() => navigate("/school-admin/roles/add")}
          className="flex items-center gap-2 bg-[#6B21A8] hover:bg-[#7E22CE] text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
        >
          <FiPlus />
          Add New Role
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4">
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
            placeholder="Search by role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded-md w-full md:w-64 text-sm focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-[#F8FAFC] text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <tr
                  key={role.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{role.name}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        navigate(`/school-admin/roles/edit/${role.id}`)
                      }
                      className="inline-flex items-center gap-1 text-sm text-purple-700 hover:text-purple-900 font-medium"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="px-4 py-4 text-gray-500" colSpan={2}>
                  No matching roles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;

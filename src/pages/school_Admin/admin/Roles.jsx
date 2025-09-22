import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiEdit2,
  FiSearch,
  FiRefreshCw,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { useSchool } from "../../school_Admin/context/SchoolContext";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="h-4 w-40 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-20 bg-gray-200 rounded" />
    </td>
  </tr>
);

const EmptyState = ({ title, subtitle, action }) => (
  <div className="py-16 text-center">
    <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
      <FiShield />
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

const useDebouncedValue = (value, delay = 250) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
};

const Roles = () => {
  const navigate = useNavigate();
  const { selectedSchool } = useSchool();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const mountedRef = useRef(true);

  const debouncedQuery = useDebouncedValue(searchQuery, 250);
  const totalCount = roles.length;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!selectedSchool?.id) {
        setRoles([]);
        return;
      }
      setLoading(true);
      try {
        const url = `/accounts/v1/roles/${
          selectedSchool?.id ? `?school_id=${selectedSchool.id}` : ""
        }`;
        const res = await axiosInstance.get(url);
        if (!mountedRef.current) return;
        setRoles(Array.isArray(res.data?.roles) ? res.data.roles : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch roles.");
        if (mountedRef.current) setRoles([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    fetchRoles();
  }, [selectedSchool?.id, refreshKey]);

  const filteredRoles = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) =>
      String(r?.name || "")
        .toLowerCase()
        .includes(q)
    );
  }, [roles, debouncedQuery]);

  const totalFiltered = filteredRoles.length;
  const perPage = rowsPerPage === 0 ? totalFiltered : rowsPerPage;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / (perPage || 1)));

  useEffect(() => setPage(1), [debouncedQuery, rowsPerPage]);

  const paginated = useMemo(() => {
    if (rowsPerPage === 0) return filteredRoles;
    const start = (page - 1) * perPage;
    return filteredRoles.slice(start, start + perPage);
  }, [filteredRoles, page, perPage, rowsPerPage]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-purple-700">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FiUsers />
            </div>
            <span className="uppercase text-xs font-semibold tracking-wider">
              Access Control
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#4C1D95] mt-1">
            Manage Roles
          </h1>
          <p className="text-sm text-gray-500">
            Create and update roles to control access across modules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition"
            title="Refresh"
          >
            <FiRefreshCw className="text-purple-700" /> Refresh
          </button>

          <button
            onClick={() => navigate("/school-admin/roles/add")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:to-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
          >
            <FiPlus /> Add New Role
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center p-4 gap-3">
          <div className="text-sm text-gray-700 flex items-center gap-2">
            <span>Show</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-purple-400"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={0}>All</option>
            </select>
            <span>entries</span>
            <span className="ml-3 text-gray-600">
              {totalFiltered} result{totalFiltered === 1 ? "" : "s"}
              {debouncedQuery && (
                <span className="ml-1 text-gray-400">
                  (filtered from {totalCount})
                </span>
              )}
            </span>
          </div>

          <label className="relative w-full md:w-72">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search roles…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-purple-500"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-[#F8FAFC] text-gray-600 uppercase text-xs tracking-wider sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Actions</th>
                <th className="px-4 py-3 text-left">Permissions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : paginated.length > 0 ? (
                paginated.map((role) => (
                  <tr
                    key={role.id}
                    className="border-t hover:bg-purple-50/40 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple-100 text-purple-700">
                          <FiShield />
                        </span>
                        <span className="font-medium text-gray-900">
                          {role.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          navigate(`/school-admin/roles/edit/${role.id}`)
                        }
                        className="inline-flex items-center gap-1.5 text-sm text-purple-700 hover:text-purple-900 font-medium px-2 py-1 rounded hover:bg-purple-100"
                        title="Edit role"
                      >
                        <FiEdit2 /> Edit
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          navigate(`/school-admin/permissions/add/${role.id}`)
                        }
                        className="inline-flex items-center gap-1.5 text-sm text-purple-700 hover:text-purple-900 font-medium px-2 py-1 rounded hover:bg-purple-100"
                        title="Edit role"
                      >
                        <FiEdit2 /> Add Permissions
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          navigate(`/school-admin/permissions/remove/${role.id}`)
                        }
                        className="inline-flex items-center gap-1.5 text-sm text-purple-700 hover:text-purple-900 font-medium px-2 py-1 rounded hover:bg-purple-100"
                        title="Edit role"
                      >
                        <FiEdit2 /> Remove Permissions
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td className="px-4" colSpan={2}>
                    <EmptyState
                      title={
                        debouncedQuery
                          ? "No matching roles found"
                          : "No roles yet"
                      }
                      subtitle={
                        debouncedQuery
                          ? "Try adjusting your search."
                          : "Create your first role to get started."
                      }
                      action={
                        <button
                          onClick={() => navigate("/school-admin/roles/add")}
                          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
                        >
                          <FiPlus /> Add Role
                        </button>
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && rowsPerPage !== 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 border-t">
            <div className="text-xs text-gray-500">
              Page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                className={`px-3 py-1.5 rounded border text-xs ${
                  page === 1
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                First
              </button>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`px-3 py-1.5 rounded border text-xs ${
                  page === 1
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={`px-3 py-1.5 rounded border text-xs ${
                  page === totalPages
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
                className={`px-3 py-1.5 rounded border text-xs ${
                  page === totalPages
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 text-center">
        Tip: Roles define what users can access across modules. Keep names short
        & meaningful.
      </div>
    </div>
  );
};

export default Roles;

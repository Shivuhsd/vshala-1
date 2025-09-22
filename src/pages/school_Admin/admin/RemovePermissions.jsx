// school_Admin/pages/school_Admin/Permissions.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUsers,
  FiKey,
} from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { useSchool } from "../../school_Admin/context/SchoolContext";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="h-4 w-48 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-32 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-20 bg-gray-200 rounded" />
    </td>
  </tr>
);

const EmptyState = ({ title, subtitle, action }) => (
  <div className="py-16 text-center">
    <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
      <FiKey />
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

const formatDate = (iso) => {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

const RemovePermissions = () => {
  const navigate = useNavigate();
  const { selectedSchool } = useSchool();
  const mountedRef = useRef(true);

  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [selected, setSelected] = useState([]);

  const { roleId } = useParams()


  const debouncedQuery = useDebouncedValue(searchQuery, 250);

  const handleSelect = (id) => {
  setSelected((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );
};

const [assignedCodes, setAssignedCodes] = useState([]);

useEffect(() => {
  const fetchRole = async () => {
    try {
      const res = await axiosInstance.get(`/accounts/v1/role/${roleId}/permissions/`);
      const roleData = res.data;
      if (roleData?.permissions) {
        const codes = roleData.permissions.map((p) => p.permissioncode);
        setAssignedCodes(codes);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load role details.");
    }
  };

  fetchRole();
}, []);



  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        // Base endpoint from your spec
        let url = "/accounts/v1/role/permissions/all/";
        // attach school_id if available (some backends expect it)
        if (selectedSchool?.id) {
          const sep = url.includes("?") ? "&" : "?";
          url = `${url}${sep}school_id=${selectedSchool.id}`;
        }
        const res = await axiosInstance.get(url);
        if (!mountedRef.current) return;
        setPermissions(
          Array.isArray(res.data?.permissions) ? res.data.permissions : []
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load permissions.");
        if (mountedRef.current) setPermissions([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    fetchPermissions();
  }, [selectedSchool?.id, refreshKey]);

 const filtered = useMemo(() => {
  const q = debouncedQuery.trim().toLowerCase();
  return permissions.filter(
    (p) =>
      assignedCodes.includes(p.code) && // 👈 only show already assigned
      (q === "" ||
        String(p?.label || "").toLowerCase().includes(q) ||
        String(p?.code || "").toLowerCase().includes(q))
  );
}, [permissions, debouncedQuery, assignedCodes]);


  const totalFiltered = filtered.length;
  const perPage = rowsPerPage === 0 ? totalFiltered : rowsPerPage;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / (perPage || 1)));

  useEffect(() => setPage(1), [debouncedQuery, rowsPerPage]);

  const paginated = useMemo(() => {
    if (rowsPerPage === 0) return filtered;
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page, perPage, rowsPerPage]);

  const handleSubmit = async () => {
  try {
    console.log({
        permission_ids: selected
    })
 await axiosInstance.delete(`/accounts/v1/role/${roleId}/permissions/remove/`, {
    headers: { 'Content-Type': 'application/json' },
    data: { permission_ids: selected },
});

    toast.success("Permissions removed successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to remove permissions.");
  }
};


  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-purple-700">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FiKey />
            </div>
            <span className="uppercase text-xs font-semibold tracking-wider">
              Access Control
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#4C1D95] mt-1">
            Permissions
          </h1>
          <p className="text-sm text-gray-500">
            List of all permission codes available in the system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition"
            title="Refresh"
          >
            <FiRefreshCw className="text-purple-700" /> Refresh
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
            </span>
          </div>

          <label className="relative w-full md:w-72">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search permissions by label or code…"
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
                <th className="px-4 py-3 text-left">Label</th>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Select</th>
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
                paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-purple-50/40 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple-100 text-purple-700">
                          <FiShield />
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {p.label}
                          </div>
                          <div className="text-xs text-gray-400">{p.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-mono text-sm text-gray-700">
                        {p.code}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-600">
                        {formatDate(p.created_at)}
                      </div>
                    </td>

                    <td className="px-4 py-3">
  <input
    type="checkbox"
    checked={selected.includes(p.id)}
    onChange={() => handleSelect(p.id)}
  />
</td>

                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td className="px-4" colSpan={3}>
                    <EmptyState
                      title="No permissions found"
                      subtitle="No permissions are available or your search returned no results."
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-end p-4">
  <button
    onClick={handleSubmit}
    disabled={selected.length === 0}
    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
  >
    Remove {selected.length} Permission{selected.length !== 1 ? "s" : ""}
  </button>
</div>

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
        Tip: Permission codes are used to grant or check access programmatically
        (e.g. <span className="font-mono">student.view</span>).
      </div>
    </div>
  );
};

export default RemovePermissions;

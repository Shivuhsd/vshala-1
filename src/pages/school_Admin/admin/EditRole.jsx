import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import AddRole from "./AddRole";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";

const Glass = ({ children, className = "" }) => (
  <div
    className={`relative rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_12px_44px_rgba(16,24,40,0.12)] ring-1 ring-black/5 ${className}`}
  >
    {children}
  </div>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200/70 rounded-lg ${className}`} />
);

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roleData, setRoleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchRole = async () => {
    if (!id) {
      setFetchError("Missing role ID.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError("");
    try {
      // Try direct single-item endpoint first (common case)
      const res = await axiosInstance.get(
        `/accounts/v1/roles/${encodeURIComponent(id)}/`
      );
      const data = res?.data;
      const role = data?.role ?? (data?.id || data?.name ? data : null);
      if (role) {
        if (!mountedRef.current) return;
        setRoleData({
          id: role.id,
          name: role.name ?? "",
          description: role.description ?? "",
        });
        setLoading(false);
        return;
      }
      // If response didn't include single object, fallback to list search
      throw new Error("No single-role object returned");
    } catch (err) {
      // Fallback: fetch list and search by id
      try {
        const listRes = await axiosInstance.get("/accounts/v1/roles/");
        const list = Array.isArray(listRes?.data?.roles)
          ? listRes.data.roles
          : [];
        const found = list.find((r) => String(r.id) === String(id));
        if (found) {
          if (!mountedRef.current) return;
          setRoleData({
            id: found.id,
            name: found.name ?? "",
            description: found.description ?? "",
          });
          setLoading(false);
          return;
        }
        const msg = err?.response?.data?.message || "Role not found.";
        if (!mountedRef.current) return;
        setFetchError(msg);
        toast.error(msg);
        setRoleData(null);
        setLoading(false);
      } catch (err2) {
        console.error(err2);
        const msg =
          err2?.response?.data?.message || "Failed to fetch role data.";
        if (!mountedRef.current) return;
        setFetchError(msg);
        toast.error(msg);
        setRoleData(null);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRole(); /* eslint-disable-line react-hooks/exhaustive-deps */
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_210deg_at_50%_50%,#F0ABFC_0deg,#93C5FD_90deg,#34D399_180deg,#FDE68A_270deg,#F0ABFC_360deg)] opacity-30 blur-3xl" />
          <Glass className="p-6 md:p-8">
            <div
              className="absolute inset-0 -z-10 opacity-20 rounded-3xl"
              style={{
                backgroundImage:
                  "radial-gradient(#a78bfa 1px, transparent 1px), radial-gradient(#34d399 1px, transparent 1px), radial-gradient(#60a5fa 1px, transparent 1px)",
                backgroundPosition: "0 0, 25px 25px, 50px 50px",
                backgroundSize: "60px 60px",
              }}
            />
            <div className="flex items-center justify-between gap-3">
              <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </Glass>
        </div>

        <Glass className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-10 w-full mb-6" />
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-24 w-full mb-6" />
          <div className="flex justify-end">
            <Skeleton className="h-10 w-36" />
          </div>
        </Glass>
      </div>
    );
  }

  if (!roleData) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-16 text-center">
        <div className="text-gray-700 font-medium mb-3">
          {fetchError || "Unable to load role details."}
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={fetchRole}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition"
          >
            <FiRefreshCw /> Retry
          </button>
          <button
            onClick={() => navigate("/school-admin/roles")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition"
          >
            <FiArrowLeft /> Back to Roles
          </button>
        </div>
      </div>
    );
  }

  return <AddRole editData={roleData} />;
};

export default EditRole;

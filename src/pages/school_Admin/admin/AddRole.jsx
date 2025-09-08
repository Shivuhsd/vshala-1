import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { FiPlusCircle, FiSave, FiArrowLeft, FiTag } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const NAME_MAX = 60;
const DESC_MAX = 200;

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

const Counter = ({ value, max }) => {
  const used = value?.length ?? 0;
  const over = used > max;
  return (
    <span className={`text-xs ${over ? "text-rose-600" : "text-gray-400"}`}>
      {used}/{max}
    </span>
  );
};

const Chip = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
  >
    <FiTag /> {label}
  </button>
);

const AddRole = ({ editData }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(!!editData);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [fetchingRoles, setFetchingRoles] = useState(true);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (editData) {
      setForm({
        name: editData.name || "",
        description: editData.description || "",
      });
    }
    setLoading(false);
    return () => {
      mountedRef.current = false;
    };
  }, [editData]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setFetchingRoles(true);
        const { data } = await axiosInstance.get("/accounts/v1/roles/");
        if (!mountedRef.current) return;
        setRoles(Array.isArray(data?.roles) ? data.roles : []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch existing roles.");
        setRoles([]);
      } finally {
        if (mountedRef.current) setFetchingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const existingNames = useMemo(
    () =>
      roles
        .map((r) =>
          String(r?.name || "")
            .trim()
            .toLowerCase()
        )
        .filter(Boolean),
    [roles]
  );

  const nameClashes = useMemo(() => {
    const current = String(form.name || "")
      .trim()
      .toLowerCase();
    if (!current) return false;
    const original = String(editData?.name || "")
      .trim()
      .toLowerCase();
    if (editData && current === original) return false;
    return existingNames.includes(current);
  }, [form.name, editData, existingNames]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Role name is required.";
    if (form.name.length > NAME_MAX) e.name = `Max ${NAME_MAX} characters.`;
    if (nameClashes) e.name = "A role with this name already exists.";
    if (form.description.length > DESC_MAX)
      e.description = `Max ${DESC_MAX} characters.`;
    return e;
  }, [form.name, form.description, nameClashes]);

  const disableSubmit = submitting || !!Object.keys(errors).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const quickInserts = [
    "School Admin",
    "Library Admin",
    "Academic Coordinator",
    "Department Head",
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (disableSubmit) {
      if (errors.name) toast.error(errors.name);
      else if (errors.description) toast.error(errors.description);
      return;
    }

    const payload = {
      role_name: form.name.trim(),
      description: form.description.trim() || null,
    };

    try {
      setSubmitting(true);

      if (editData?.id) {
        // Update — use PATCH to the edit endpoint as specified
        const { data } = await axiosInstance.patch(
          `/accounts/v1/role/${editData.id}/edit/`,
          payload
        );
        toast.success(data?.message || "Role updated successfully.");
      } else {
        // Create
        const { data } = await axiosInstance.post(
          "/accounts/v1/roles/",
          payload
        );
        if (data?.message) toast.success(data.message);
        else if (data?.name)
          toast.success(`Role "${data.name}" created successfully.`);
        else toast.success("Role created successfully.");
      }

      // navigate back to list
      setTimeout(() => navigate("/school-admin/roles"), 600);
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to submit role. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
      <ToastContainer />
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
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {editData ? "Edit Role" : "Create a New Role"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Roles define what users can access. Keep names short &
                meaningful.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition"
            >
              <FiArrowLeft /> Back
            </button>
          </div>
        </Glass>
      </div>

      <Glass className="p-6">
        {loading ? (
          <>
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-10 w-full mb-6" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-10 w-40 ml-auto" />
          </>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Name <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  maxLength={NAME_MAX + 10}
                  placeholder="e.g., School Admin"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 ${
                    errors.name
                      ? "border-rose-300 focus:ring-rose-300"
                      : "border-gray-300 focus:ring-indigo-300"
                  }`}
                />
                <div className="absolute right-2 top-2">
                  <Counter value={form.name} max={NAME_MAX} />
                </div>
              </div>
              {errors.name && (
                <div className="text-xs text-rose-600 mt-1">{errors.name}</div>
              )}

              {!editData && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {fetchingRoles ? (
                    <Skeleton className="h-6 w-32" />
                  ) : (
                    quickInserts.map((q) => (
                      <Chip
                        key={q}
                        label={q}
                        onClick={() => setForm((s) => ({ ...s, name: q }))}
                      />
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  maxLength={DESC_MAX + 50}
                  placeholder="Short note about this role…"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 resize-y ${
                    errors.description
                      ? "border-rose-300 focus:ring-rose-300"
                      : "border-gray-300 focus:ring-indigo-300"
                  }`}
                />
                <div className="absolute right-2 bottom-2">
                  <Counter value={form.description} max={DESC_MAX} />
                </div>
              </div>
              {errors.description && (
                <div className="text-xs text-rose-600 mt-1">
                  {errors.description}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={disableSubmit}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow transition ${
                  disableSubmit
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:to-fuchsia-700"
                }`}
              >
                {editData ? <FiSave /> : <FiPlusCircle />}{" "}
                {editData ? "Update Role" : "Create Role"}
              </button>
            </div>
          </form>
        )}
      </Glass>
    </div>
  );
};

export default AddRole;

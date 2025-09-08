// // school_Admin/pages/school_Admin/TimetableList.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   FiEye,
//   FiTrash2,
//   FiPlusCircle,
//   FiRefreshCw,
//   FiCalendar,
// } from "react-icons/fi";
// import { toast, ToastContainer } from "react-toastify";
// import axiosInstance from "../../../services/axiosInstance";
// import { useSchool } from "../context/SchoolContext";
// import TimetableGrid from "./TimetableGrid";
// import RoutineFormModal from "./RoutineFormModal";
// import "react-toastify/dist/ReactToastify.css";

// /* ------------------------- baseURL helpers ------------------------- */
// const baseHasApi = () => {
//   try {
//     const u = new URL(axiosInstance.defaults.baseURL || "");
//     return u.pathname.replace(/\/+$/, "").endsWith("/api");
//   } catch {
//     return false;
//   }
// };
// const apiPath = (suffix) => (baseHasApi() ? suffix : `/api${suffix}`);

// /* ------------------------------ UI bits ------------------------------ */
// const Glass = ({ children, className = "" }) => (
//   <div
//     className={`relative rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_12px_44px_rgba(16,24,40,0.12)] ring-1 ring-black/5 ${className}`}
//   >
//     {children}
//   </div>
// );

// const SkeletonRow = () => (
//   <tr className="animate-pulse">
//     <td className="px-4 py-3">
//       <div className="h-4 w-40 bg-gray-200 rounded" />
//     </td>
//     <td className="px-4 py-3">
//       <div className="h-4 w-28 bg-gray-200 rounded" />
//     </td>
//     <td className="px-4 py-3">
//       <div className="h-4 w-24 bg-gray-200 rounded" />
//     </td>
//     <td className="px-4 py-3">
//       <div className="h-4 w-24 bg-gray-200 rounded" />
//     </td>
//     <td className="px-4 py-3">
//       <div className="h-4 w-16 bg-gray-200 rounded" />
//     </td>
//   </tr>
// );

// const EmptyState = ({ onAdd }) => (
//   <div className="py-16 text-center">
//     <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
//       <FiCalendar />
//     </div>
//     <h3 className="text-lg font-semibold text-gray-800">No timetables yet</h3>
//     <p className="text-sm text-gray-500 mt-1">
//       Create a timetable for a class/section to get started.
//     </p>
//     <button
//       onClick={onAdd}
//       className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:to-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
//     >
//       <FiPlusCircle />
//       Create Timetable
//     </button>
//   </div>
// );

// /* --------------------------- Normalizer --------------------------- */
// /** Accepts many possible backend shapes and returns a stable row */
// const normalizeRow = (raw) => {
//   // id
//   const id = raw?.id ?? raw?.timetable_id ?? raw?.uuid ?? raw?.pk ?? null;

//   // name (timetable title)
//   const name =
//     raw?.name ?? raw?.title ?? raw?.timetable_name ?? raw?.label ?? "—";

//   // class label (flat or nested)
//   const class_label =
//     raw?.class_label ??
//     raw?.class_name ??
//     raw?.classTitle ??
//     raw?.class ??
//     raw?.cls ??
//     raw?.class?.label ??
//     raw?.class?.name ??
//     raw?.class?.title ??
//     "—";

//   // section label (flat or nested)
//   const section_label =
//     raw?.section_label ??
//     raw?.section_name ??
//     raw?.sectionTitle ??
//     raw?.section ??
//     raw?.sec ??
//     raw?.section?.label ??
//     raw?.section?.name ??
//     raw?.section?.title ??
//     "—";

//   // preserve original in case you need it for the viewer/modal
//   return { id, name, class_label, section_label, __raw: raw };
// };

// /* ----------------------------- Component ----------------------------- */
// const TimetableList = () => {
//   const { selectedSchool, selectedSession } = useSchool();

//   const [timetables, setTimetables] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");
//   const [searchDebounced, setSearchDebounced] = useState("");

//   const [viewTimetable, setViewTimetable] = useState(null);
//   const [editData, setEditData] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   const schoolId = selectedSchool?.id;
//   const sessionId = selectedSession?.id;

//   // debounce search input
//   useEffect(() => {
//     const id = setTimeout(
//       () => setSearchDebounced(search.trim().toLowerCase()),
//       250
//     );
//     return () => clearTimeout(id);
//   }, [search]);

//   const fetchTimetables = async () => {
//     if (!schoolId || !sessionId) return;
//     setLoading(true);
//     try {
//       const url = apiPath(
//         `/schools/v1/timetables/?session_id=${encodeURIComponent(
//           sessionId
//         )}&school_id=${encodeURIComponent(schoolId)}`
//       );
//       const res = await axiosInstance.get(url);
//       const rawList = Array.isArray(res.data?.results)
//         ? res.data.results
//         : Array.isArray(res.data)
//         ? res.data
//         : [];

//       // normalize
//       const list = rawList.map(normalizeRow);
//       setTimetables(list);
//     } catch (err) {
//       toast.error("Failed to load timetables");
//       setTimetables([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!id) return;
//     if (!window.confirm("Are you sure you want to delete this timetable?"))
//       return;

//     try {
//       await axiosInstance.delete(
//         apiPath(`/schools/v1/timetables/${encodeURIComponent(id)}/`)
//       );
//       toast.success("Timetable deleted successfully");
//       fetchTimetables();
//     } catch {
//       try {
//         await axiosInstance.delete(
//           apiPath(`/schools/v1/timetables/${encodeURIComponent(id)}`)
//         );
//         toast.success("Timetable deleted successfully");
//         fetchTimetables();
//       } catch (err2) {
//         toast.error(
//           err2?.response?.data?.message || "Failed to delete timetable"
//         );
//       }
//     }
//   };

//   useEffect(() => {
//     fetchTimetables();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [schoolId, sessionId]);

//   // Filter by name/class/section (client-side)
//   const filtered = useMemo(() => {
//     if (!searchDebounced) return timetables;
//     return timetables.filter((t) => {
//       const hay = `${t.name || ""} ${t.class_label || ""} ${
//         t.section_label || ""
//       }`.toLowerCase();
//       return hay.includes(searchDebounced);
//     });
//   }, [timetables, searchDebounced]);

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-6">
//       <ToastContainer position="top-right" autoClose={3000} />

//       {/* Header / Hero */}
//       <div className="relative mb-6">
//         <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_210deg_at_50%_50%,#F0ABFC_0deg,#93C5FD_90deg,#34D399_180deg,#FDE68A_270deg,#F0ABFC_360deg)] opacity-30 blur-3xl" />
//         <Glass className="p-5 md:p-6">
//           <div
//             className="absolute inset-0 -z-10 opacity-20 rounded-3xl"
//             style={{
//               backgroundImage:
//                 "radial-gradient(#a78bfa 1px, transparent 1px), radial-gradient(#34d399 1px, transparent 1px), radial-gradient(#60a5fa 1px, transparent 1px)",
//               backgroundPosition: "0 0, 25px 25px, 50px 50px",
//               backgroundSize: "60px 60px",
//             }}
//           />
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//             <div>
//               <div className="inline-flex items-center gap-2 text-purple-700">
//                 <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
//                   <FiCalendar />
//                 </div>
//                 <span className="uppercase text-xs font-semibold tracking-wider">
//                   Academic Management
//                 </span>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 mt-1">
//                 Timetables
//               </h1>
//               <p className="text-sm text-gray-600">
//                 {selectedSchool?.label || "School"} • Session{" "}
//                 {selectedSession?.label || "—"}
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={fetchTimetables}
//                 className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition"
//               >
//                 <FiRefreshCw />
//                 Refresh
//               </button>
//               <button
//                 onClick={() => {
//                   setEditData(null);
//                   setModalOpen(true);
//                 }}
//                 className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:to-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
//               >
//                 <FiPlusCircle />
//                 Add New Routine
//               </button>
//             </div>
//           </div>
//         </Glass>
//       </div>

//       {/* Controls */}
//       <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//         <div className="text-sm text-gray-600">
//           Showing <span className="font-semibold">{filtered.length}</span> of{" "}
//           <span className="font-semibold">{timetables.length}</span>
//         </div>
//         <div className="relative w-full md:w-80">
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name, class or section…"
//             className="w-full pl-3 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white shadow rounded-xl border border-[#E2E8F0] overflow-x-auto">
//         <table className="min-w-full text-sm text-[#334155]">
//           <thead className="bg-[#F1F5F9] text-xs text-gray-600 uppercase sticky top-0">
//             <tr>
//               <th className="px-4 py-3 text-left">Name</th>
//               <th className="px-4 py-3 text-left">Class</th>
//               <th className="px-4 py-3 text-left">Section</th>
//               <th className="px-4 py-3 text-left">View</th>
//               <th className="px-4 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <>
//                 <SkeletonRow />
//                 <SkeletonRow />
//                 <SkeletonRow />
//                 <SkeletonRow />
//               </>
//             ) : filtered.length ? (
//               filtered.map((row) => (
//                 <tr
//                   key={row.id || row.__raw?.id || Math.random()}
//                   className="border-t hover:bg-gray-50 transition"
//                 >
//                   <td className="px-4 py-3 font-medium">{row.name || "—"}</td>
//                   <td className="px-4 py-3">{row.class_label || "—"}</td>
//                   <td className="px-4 py-3">{row.section_label || "—"}</td>
//                   <td className="px-4 py-3">
//                     <button
//                       onClick={() => setViewTimetable(row.__raw || row)}
//                       className="text-sm text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 font-medium"
//                     >
//                       <FiEye />
//                       View Timetable
//                     </button>
//                   </td>
//                   <td className="px-4 py-3">
//                     {row.id ? (
//                       <button
//                         onClick={() => handleDelete(row.id)}
//                         className="text-sm text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 font-medium"
//                       >
//                         <FiTrash2 />
//                         Delete
//                       </button>
//                     ) : (
//                       <span className="text-xs text-gray-400">—</span>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr className="border-t">
//                 <td colSpan={5} className="px-4">
//                   <EmptyState
//                     onAdd={() => {
//                       setEditData(null);
//                       setModalOpen(true);
//                     }}
//                   />
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Create / Edit modal */}
//       {modalOpen && (
//         <RoutineFormModal
//           open={modalOpen}
//           onClose={() => setModalOpen(false)}
//           initialData={editData}
//           onSaved={() => {
//             setModalOpen(false);
//             fetchTimetables();
//           }}
//         />
//       )}

//       {/* Viewer */}
//       {viewTimetable && (
//         <TimetableGrid
//           classData={viewTimetable}
//           onClose={() => setViewTimetable(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default TimetableList;
// school_Admin/pages/school_Admin/TimetableList.jsx
// school_Admin/pages/school_Admin/TimetableList.jsx

// TimetableList.jsx

// src/school_Admin/pages/school_Admin/TimetableList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiEye,
  FiTrash2,
  FiPlusCircle,
  FiRefreshCw,
  FiCalendar,
  FiSearch,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSchool } from "../context/SchoolContext";
import TimetableGrid from "./TimetableGrid";
import RoutineFormModal from "./RoutineFormModal";

import {
  listTimetables,
  deleteTimetable as apiDeleteTimetable,
  listClasses,
  listSections,
} from "../../../services/timetableApi";

/* ------------------------------ UI bits ------------------------------ */
const Glass = ({ children, className = "" }) => (
  <div
    className={`relative rounded-3xl bg-white/70 backdrop-blur-xl shadow-[0_12px_44px_rgba(16,24,40,0.12)] ring-1 ring-black/5 ${className}`}
  >
    {children}
  </div>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3">
      <div className="h-4 w-40 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-28 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-16 bg-gray-200 rounded" />
    </td>
  </tr>
);

const EmptyState = ({ onAdd }) => (
  <div className="py-16 text-center">
    <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
      <FiCalendar />
    </div>
    <h3 className="text-lg font-semibold text-gray-800">No timetables yet</h3>
    <p className="text-sm text-gray-500 mt-1">
      Create a timetable for a class/section to get started.
    </p>
    <button
      onClick={onAdd}
      className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:to-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
    >
      <FiPlusCircle />
      Create Timetable
    </button>
  </div>
);

/* --------------------------- Normalizer --------------------------- */
/** Accepts many possible backend shapes and returns a stable row */
const normalizeRow = (raw) => {
  // id
  const id = raw?.id ?? raw?.timetable_id ?? raw?.uuid ?? raw?.pk ?? null;

  // name (timetable title)
  const name =
    raw?.name ?? raw?.title ?? raw?.timetable_name ?? raw?.label ?? "—";

  // class label (flat or nested)
  const class_label =
    raw?.class_label ??
    raw?.class_name ??
    raw?.classTitle ??
    raw?.class ??
    raw?.cls ??
    raw?.class?.label ??
    raw?.class?.name ??
    raw?.class?.title ??
    "—";

  // section label (flat or nested)
  const section_label =
    raw?.section_label ??
    raw?.section_name ??
    raw?.sectionTitle ??
    raw?.section ??
    raw?.sec ??
    raw?.section?.label ??
    raw?.section?.name ??
    raw?.section?.title ??
    "—";

  // preserve original in case you need it for the viewer/modal
  return { id, name, class_label, section_label, __raw: raw };
};

/* ----------------------------- Component ----------------------------- */
const TimetableList = () => {
  const { selectedSchool, selectedSession } = useSchool();

  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  const [viewTimetable, setViewTimetable] = useState(null);
  const [editData, setEditData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const mountedRef = useRef(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const schoolId = selectedSchool?.id;
  const sessionId = selectedSession?.id;

  // debounce search input
  useEffect(() => {
    const id = setTimeout(
      () => setSearchDebounced(search.trim().toLowerCase()),
      250
    );
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /**
   * Improved fetch:
   * - fetch timetables
   * - collect class/section ids from raw payloads
   * - fetch classes & sections (bulk) and build id->label maps
   * - normalize rows and replace GUIDs with friendly labels where available
   */
  const fetchTimetables = async () => {
    if (!schoolId || !sessionId) {
      setTimetables([]);
      return;
    }

    setLoading(true);
    try {
      const res = await listTimetables({
        school_id: schoolId,
        session_id: sessionId,
      });

      const rawList = Array.isArray(res.data?.timetables)
        ? res.data.timetables
        : Array.isArray(res.data?.results)
        ? res.data.results
        : Array.isArray(res.data)
        ? res.data
        : [];

      // collect candidate IDs
      const classIds = new Set();
      const sectionIds = new Set();

      rawList.forEach((r) => {
        // common shapes for class id
        const c =
          r?.class_id ??
          (typeof r?.class === "string" ? r.class : null) ??
          (r?.class && typeof r.class === "object"
            ? r.class.id ?? r.class.pk ?? null
            : null);

        const s =
          r?.section ??
          r?.section_id ??
          (r?.section && typeof r.section === "object"
            ? r.section.id ?? r.section.pk ?? null
            : null);

        if (c && typeof c === "string") classIds.add(c);
        if (s && typeof s === "string") sectionIds.add(s);
      });

      // fetch metadata only if we have ids
      let classMap = {};
      let sectionMap = {};
      const fetchPromises = [];

      if (classIds.size > 0) {
        fetchPromises.push(
          // FIXED: pass the correct variable name to the helper
          listClasses({ school_id: schoolId })
            .then((r) => {
              const list = Array.isArray(r?.data?.classes)
                ? r.data.classes
                : Array.isArray(r?.data)
                ? r.data
                : [];
              list.forEach((it) => {
                const id = it.id ?? it.pk ?? it.class_id ?? it.uuid;
                const label =
                  it.name ?? it.label ?? it.class_name ?? it.title ?? id;
                if (id) classMap[String(id)] = label;
              });
            })
            .catch((e) => {
              console.debug("classes lookup failed:", e?.message || e);
            })
        );
      }

      if (sectionIds.size > 0) {
        fetchPromises.push(
          // FIXED: pass the correct variable name to the helper
          listSections({ school_id: schoolId })
            .then((r) => {
              const list = Array.isArray(r?.data?.sections)
                ? r.data.sections
                : Array.isArray(r?.data)
                ? r.data
                : [];
              list.forEach((it) => {
                const id = it.id ?? it.pk ?? it.section_id ?? it.uuid;
                const label =
                  it.name ?? it.label ?? it.section_name ?? it.title ?? id;
                if (id) sectionMap[String(id)] = label;
              });
            })
            .catch((e) => {
              console.debug("sections lookup failed:", e?.message || e);
            })
        );
      }

      await Promise.all(fetchPromises);

      // normalize and enrich
      const normalized = rawList.map((raw) => {
        const row = normalizeRow(raw);

        const rawClassId =
          raw?.class_id ??
          (raw?.class && typeof raw.class === "string" ? raw.class : null) ??
          (raw?.class && typeof raw.class === "object"
            ? raw.class.id ?? raw.class.pk ?? null
            : null);

        const rawSectionId =
          raw?.section ??
          raw?.section_id ??
          (raw?.section && typeof raw.section === "object"
            ? raw.section.id ?? raw.section.pk ?? null
            : null);

        if (rawClassId && classMap[String(rawClassId)]) {
          row.class_label = classMap[String(rawClassId)];
        } else if (row.class_label && classMap[String(row.class_label)]) {
          row.class_label =
            classMap[String(row.class_label)] ?? row.class_label;
        }

        if (rawSectionId && sectionMap[String(rawSectionId)]) {
          row.section_label = sectionMap[String(rawSectionId)];
        } else if (row.section_label && sectionMap[String(row.section_label)]) {
          row.section_label =
            sectionMap[String(row.section_label)] ?? row.section_label;
        }

        return row;
      });

      if (!mountedRef.current) return;
      setTimetables(normalized);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load timetables");
      if (mountedRef.current) setTimetables([]);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId, sessionId, refreshKey]);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this timetable?"))
      return;

    try {
      await apiDeleteTimetable(id);
      toast.success("Timetable deleted successfully");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      // try fallback without trailing slash
      try {
        await apiDeleteTimetable(String(id).replace(/\/$/, ""));
        toast.success("Timetable deleted successfully");
        setRefreshKey((k) => k + 1);
      } catch (err2) {
        console.error(err2);
        toast.error(
          err2?.response?.data?.message || "Failed to delete timetable"
        );
      }
    }
  };

  // Filter by name/class/section (client-side)
  const filtered = useMemo(() => {
    if (!searchDebounced) return timetables;
    return timetables.filter((t) => {
      const hay = `${t.name || ""} ${t.class_label || ""} ${
        t.section_label || ""
      }`.toLowerCase();
      return hay.includes(searchDebounced);
    });
  }, [timetables, searchDebounced]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header / Hero */}
      <div className="relative mb-6">
        <div className="absolute inset-0 -z-10 bg-[conic-gradient(from_210deg_at_50%_50%,#F0ABFC_0deg,#93C5FD_90deg,#34D399_180deg,#FDE68A_270deg,#F0ABFC_360deg)] opacity-30 blur-3xl" />
        <Glass className="p-5 md:p-6">
          <div
            className="absolute inset-0 -z-10 opacity-20 rounded-3xl"
            style={{
              backgroundImage:
                "radial-gradient(#a78bfa 1px, transparent 1px), radial-gradient(#34d399 1px, transparent 1px), radial-gradient(#60a5fa 1px, transparent 1px)",
              backgroundPosition: "0 0, 25px 25px, 50px 50px",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-purple-700">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FiCalendar />
                </div>
                <span className="uppercase text-xs font-semibold tracking-wider">
                  Academic Management
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                Timetables
              </h1>
              <p className="text-sm text-gray-600">
                {selectedSchool?.label || "School"} • Session{" "}
                {selectedSession?.label || "—"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition"
              >
                <FiRefreshCw />
                Refresh
              </button>
              <button
                onClick={() => {
                  setEditData(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:to-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow"
              >
                <FiPlusCircle />
                Add New Routine
              </button>
            </div>
          </div>
        </Glass>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filtered.length}</span> of{" "}
          <span className="font-semibold">{timetables.length}</span>
        </div>
        <div className="relative w-full md:w-80">
          <div className="absolute left-3 top-3 text-gray-400">
            <FiSearch />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, class or section…"
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl border border-[#E2E8F0] overflow-x-auto">
        <table className="min-w-full text-sm text-[#334155]">
          <thead className="bg-[#F1F5F9] text-xs text-gray-600 uppercase sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Class</th>
              <th className="px-4 py-3 text-left">Section</th>
              <th className="px-4 py-3 text-left">View</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : filtered.length ? (
              filtered.map((row) => (
                <tr
                  key={
                    row.id || row.__raw?.id || `${row.name}-${Math.random()}`
                  }
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{row.name || "—"}</td>
                  <td className="px-4 py-3">{row.class_label || "—"}</td>
                  <td className="px-4 py-3">{row.section_label || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setViewTimetable(row.__raw || row)}
                      className="text-sm text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 font-medium"
                    >
                      <FiEye />
                      View Timetable
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {row.id ? (
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="text-sm text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 font-medium"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td colSpan={5} className="px-4">
                  <EmptyState
                    onAdd={() => {
                      setEditData(null);
                      setModalOpen(true);
                    }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <RoutineFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialData={editData}
          onSaved={() => {
            setModalOpen(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      {/* Viewer modal/drawer */}
      {viewTimetable && (
        <TimetableGrid
          classData={viewTimetable}
          onClose={() => setViewTimetable(null)}
          onChange={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default TimetableList;

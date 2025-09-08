// import React, { useEffect, useState } from "react";
// import { FiEdit, FiTrash2, FiPrinter, FiX } from "react-icons/fi";
// import RoutineFormModal from "./RoutineFormModal";
// import { printTimetable } from "./timetableUtils";

// const days = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];

// const TimetableGrid = ({ classData, onClose }) => {
//   const [routineMap, setRoutineMap] = useState({});
//   const [editData, setEditData] = useState(null);

//   useEffect(() => {
//     // Dummy data only for Monday
//     const dummy = {
//       Monday: [
//         {
//           id: 1,
//           subject: "MATHS",
//           start_time: "07:30 am",
//           end_time: "08:25 am",
//           room_no: "Room No. Theory",
//           teacher: "Ms. Afreen",
//         },
//         {
//           id: 2,
//           subject: "ACCOUNTS",
//           start_time: "08:30 am",
//           end_time: "09:25 am",
//           room_no: "Room No. 102",
//           teacher: "Mrs. Manjula",
//         },
//         {
//           id: 3,
//           subject: "ENGLISH",
//           start_time: "09:30 am",
//           end_time: "10:25 am",
//           room_no: "Room No. 201",
//           teacher: "Ms. Sumaya",
//         },
//         {
//           id: 4,
//           subject: "C Programming",
//           start_time: "10:30 am",
//           end_time: "11:25 am",
//           room_no: "Lab A1",
//           teacher: "Mr. Upendra Kumar",
//         },
//         {
//           id: 4,
//           subject: "C Programming",
//           start_time: "10:30 am",
//           end_time: "11:25 am",
//           room_no: "Lab A1",
//           teacher: "Mr. Upendra Kumar",
//         },
//         {
//           id: 4,
//           subject: "C Programming",
//           start_time: "10:30 am",
//           end_time: "11:25 am",
//           room_no: "Lab A1",
//           teacher: "Mr. Upendra Kumar",
//         },
//         {
//           id: 4,
//           subject: "C Programming",
//           start_time: "10:30 am",
//           end_time: "11:25 am",
//           room_no: "Lab A1",
//           teacher: "Mr. Upendra Kumar",
//         },
//       ],
//     };
//     setRoutineMap(dummy);
//   }, []);

//   const handleDelete = (id) => {
//     const updated = { ...routineMap };
//     updated.Monday = updated.Monday.filter((item) => item.id !== id);
//     setRoutineMap(updated);
//   };

//   return (
//     <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center overflow-y-auto">
//       <div
//         className="bg-white max-w-7xl w-full mx-6 rounded-lg shadow-xl p-6 relative overflow-x-auto"
//         id="print-timetable"
//       >
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-600 hover:text-black"
//         >
//           <FiX size={20} />
//         </button>

//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-purple-700 mb-1">
//               Class Timetable: BCA 1st Year - A
//             </h2>
//             <p className="text-sm text-gray-600">
//               Sample Layout with Dummy Data
//             </p>
//           </div>
//           <button
//             onClick={() => printTimetable("print-timetable")}
//             className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
//           >
//             <FiPrinter />
//             Print Timetable
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto border rounded-lg">
//           <table className="min-w-full text-sm text-gray-800 border-collapse">
//             <thead className="bg-gray-100 text-xs uppercase text-gray-600">
//               <tr>
//                 <th className="border px-4 py-3 w-32 text-left">Day</th>
//                 <th className="border px-4 py-3 text-left">Time Slots</th>
//               </tr>
//             </thead>
//             <tbody>
//               {days.map((day) => (
//                 <tr key={day} className="border-t align-top">
//                   <td className="border px-4 py-3 font-semibold text-purple-700 whitespace-nowrap">
//                     {day}
//                   </td>
//                   <td className="border px-2 py-3">
//                     <div className="flex flex-wrap gap-3">
//                       {(routineMap[day] || []).length > 0 ? (
//                         routineMap[day].map((entry) => (
//                           <div
//                             key={entry.id}
//                             className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 min-w-[220px] max-w-[240px] relative"
//                           >
//                             <div className="font-semibold text-[#334155] text-sm">
//                               {entry.subject}
//                             </div>
//                             <div className="text-xs text-gray-600">
//                               {entry.start_time} - {entry.end_time}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               Room: {entry.room_no}
//                             </div>
//                             <div className="text-xs italic text-gray-700 mt-1">
//                               – {entry.teacher}
//                             </div>

//                             {/* Edit/Delete Icons */}
//                             <div className="absolute top-1.5 right-2 flex gap-2 text-sm text-gray-500">
//                               <button
//                                 onClick={() => setEditData(entry)}
//                                 className="hover:text-purple-700"
//                               >
//                                 <FiEdit />
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(entry.id)}
//                                 className="hover:text-red-600"
//                               >
//                                 <FiTrash2 />
//                               </button>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-xs text-gray-500 italic">
//                           No routines
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {editData && (
//           <RoutineFormModal
//             open={true}
//             onClose={() => setEditData(null)}
//             initialData={editData}
//             onSaved={() => setEditData(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TimetableGrid;
// import React, { useEffect, useState } from "react";
// import { Plus, Loader2 } from "lucide-react";
// import axios from "axios";

// const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat"];

// const TimetableGrid = ({ selectedTimetableId }) => {
//   const [loading, setLoading] = useState(false);
//   const [timetableItems, setTimetableItems] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newItem, setNewItem] = useState({
//     subject: "",
//     day_of_week: "",
//     start_time: "",
//     end_time: "",
//     room_number: "",
//   });

//   // ✅ Fetch timetable items when timetableId changes
//   useEffect(() => {
//     if (!selectedTimetableId) return;
//     setLoading(true);
//     axios
//       .get(
//         `/schools/v1/timetable/items/add/?timetablename_id=${selectedTimetableId}`
//       )
//       .then((res) => {
//         setTimetableItems(res.data?.timetables || []);
//       })
//       .catch((err) => console.error(err))
//       .finally(() => setLoading(false));
//   }, [selectedTimetableId]);

//   // ✅ Handle Add Item
//   const handleAddItem = () => {
//     if (!newItem.subject || !newItem.day_of_week) {
//       alert("Please fill all required fields");
//       return;
//     }
//     axios
//       .post("/schools/v1/timetable/items/add/", {
//         ...newItem,
//         timetable: selectedTimetableId,
//       })
//       .then((res) => {
//         setTimetableItems((prev) => [...prev, res.data]);
//         setShowModal(false);
//         setNewItem({
//           subject: "",
//           day_of_week: "",
//           start_time: "",
//           end_time: "",
//           room_number: "",
//         });
//       })
//       .catch((err) => console.error(err));
//   };

//   return (
//     <div className="p-6 bg-white shadow rounded-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Timetable</h2>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           <Plus size={18} /> Add Slot
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center py-10">
//           <Loader2 className="animate-spin" size={28} />
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-200">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border p-2 text-left">Day</th>
//                 <th className="border p-2 text-left">Time</th>
//                 <th className="border p-2 text-left">Subject</th>
//                 <th className="border p-2 text-left">Room</th>
//               </tr>
//             </thead>
//             <tbody>
//               {timetableItems.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="4"
//                     className="text-center py-6 text-gray-500 italic"
//                   >
//                     No timetable entries yet
//                   </td>
//                 </tr>
//               ) : (
//                 timetableItems.map((item) => (
//                   <tr key={item.id} className="hover:bg-gray-50">
//                     <td className="border p-2 capitalize">
//                       {item.day_of_week}
//                     </td>
//                     <td className="border p-2">
//                       {item.start_time} - {item.end_time}
//                     </td>
//                     <td className="border p-2">{item.subject}</td>
//                     <td className="border p-2">{item.room_number || "-"}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ✅ Add Slot Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
//             <h3 className="text-lg font-semibold mb-4">Add Timetable Slot</h3>

//             <div className="space-y-3">
//               <select
//                 className="w-full border p-2 rounded"
//                 value={newItem.day_of_week}
//                 onChange={(e) =>
//                   setNewItem({ ...newItem, day_of_week: e.target.value })
//                 }
//               >
//                 <option value="">Select Day</option>
//                 {DAYS.map((d) => (
//                   <option key={d} value={d}>
//                     {d.toUpperCase()}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="time"
//                 className="w-full border p-2 rounded"
//                 value={newItem.start_time}
//                 onChange={(e) =>
//                   setNewItem({ ...newItem, start_time: e.target.value })
//                 }
//               />

//               <input
//                 type="time"
//                 className="w-full border p-2 rounded"
//                 value={newItem.end_time}
//                 onChange={(e) =>
//                   setNewItem({ ...newItem, end_time: e.target.value })
//                 }
//               />

//               <input
//                 type="text"
//                 placeholder="Subject ID"
//                 className="w-full border p-2 rounded"
//                 value={newItem.subject}
//                 onChange={(e) =>
//                   setNewItem({ ...newItem, subject: e.target.value })
//                 }
//               />

//               <input
//                 type="text"
//                 placeholder="Room Number (optional)"
//                 className="w-full border p-2 rounded"
//                 value={newItem.room_number}
//                 onChange={(e) =>
//                   setNewItem({ ...newItem, room_number: e.target.value })
//                 }
//               />
//             </div>

//             <div className="flex justify-end gap-3 mt-5">
//               <button
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddItem}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimetableGrid;
// school_Admin/pages/school_Admin/TimetableGrid.jsx

// TimetableGrid.jsx
// TimetableGrid.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiPrinter, FiPlus, FiRefreshCw, FiX, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { useSchool } from "../context/SchoolContext";
import {
  getTimetableItems,
  addTimetableItem,
  deleteTimetableItem,
} from "../../../services/timetableApi";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABEL = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const formatTime = (hhmmss) => {
  if (!hhmmss) return "-";
  const parts = hhmmss.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : hhmmss;
};

const TimetableGrid = ({
  classData,
  selectedTimetableId,
  onClose = () => {},
  onChange = () => {},
}) => {
  const mountedRef = useRef(true);
  const { selectedSchool, selectedSession } = useSchool();

  const timetableId =
    (classData &&
      (classData.id || classData.timetable || classData.__raw?.id)) ||
    selectedTimetableId;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    day_of_week: "mon",
    start_time: "09:00:00",
    end_time: "10:00:00",
    room_number: "",
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!timetableId) return;
    setLoading(true);
    const fetch = async () => {
      try {
        const res = await getTimetableItems(timetableId);
        const list = Array.isArray(res?.data?.timetables)
          ? res.data.timetables
          : Array.isArray(res?.data)
          ? res.data
          : [];
        if (!mountedRef.current) return;
        setItems(list);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load timetable items");
        if (mountedRef.current) setItems([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    fetch();
  }, [timetableId, selectedSchool?.id, selectedSession?.id]);

  const timeRows = useMemo(() => {
    const bounds = new Set();
    items.forEach((it) => {
      if (it.start_time) bounds.add(it.start_time);
      if (it.end_time) bounds.add(it.end_time);
    });
    const arr = Array.from(bounds).sort();
    if (arr.length < 2) {
      const fallback = [];
      for (let h = 8; h < 17; h++)
        fallback.push({
          start: `${String(h).padStart(2, "0")}:00:00`,
          end: `${String(h + 1).padStart(2, "0")}:00:00`,
        });
      return fallback;
    }
    const rows = [];
    for (let i = 0; i < arr.length - 1; i++)
      rows.push({ start: arr[i], end: arr[i + 1] });
    return rows;
  }, [items]);

  const grid = useMemo(() => {
    const map = {};
    DAYS.forEach((d) => (map[d] = {}));
    items.forEach((it) => {
      const day = it.day_of_week || "mon";
      const rowIndex = timeRows.findIndex(
        (r) => r.start === it.start_time && r.end === it.end_time
      );
      const idx =
        rowIndex >= 0
          ? rowIndex
          : Math.max(
              0,
              timeRows.findIndex((r) => r.start === it.start_time)
            );
      map[day][idx] = it;
    });
    return map;
  }, [items, timeRows]);

  const resetForm = () =>
    setForm({
      subject: "",
      day_of_week: "mon",
      start_time: "09:00:00",
      end_time: "10:00:00",
      room_number: "",
    });

  // Helper: normalize and show server validation messages
  const showServerErrors = (data) => {
    if (!data) return;
    try {
      // Common shapes:
      // { detail: "..." } or { message: "..." } or { field: ["err1","err2"] }
      if (typeof data === "string") {
        toast.error(data);
        return;
      }
      if (data.detail) {
        toast.error(String(data.detail));
        return;
      }
      if (data.message) {
        toast.error(String(data.message));
        return;
      }
      // field errors
      if (typeof data === "object") {
        const messages = [];
        for (const k of Object.keys(data)) {
          const v = data[k];
          if (Array.isArray(v)) messages.push(`${k}: ${v.join(", ")}`);
          else if (typeof v === "string") messages.push(`${k}: ${v}`);
          else if (typeof v === "object")
            messages.push(`${k}: ${JSON.stringify(v)}`);
        }
        if (messages.length) {
          // show first message and log all
          toast.error(messages[0]);
          console.error("Server validation errors:", messages);
          return;
        }
      }
    } catch (ex) {
      console.error("Failed to parse server error body", ex, data);
    }
    toast.error("Validation failed. See console for details.");
  };

  // >>> UPDATED: robust add flow with validation + fallback
  const handleAdd = async (e) => {
    e?.preventDefault();

    // Basic validation
    const allowedDays = new Set(DAYS);
    if (!form.subject || !String(form.subject).trim()) {
      toast.error("Subject (id) is required.");
      return;
    }
    if (!form.day_of_week || !allowedDays.has(form.day_of_week)) {
      toast.error("Select a valid day.");
      return;
    }
    const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(form.start_time) || !timeRegex.test(form.end_time)) {
      toast.error("Start and end times must be in HH:MM:SS format.");
      return;
    }
    // ensure start < end
    const toMinutes = (hhmmss) => {
      const [h, m] = hhmmss.split(":").map((x) => parseInt(x, 10));
      return h * 60 + m;
    };
    if (toMinutes(form.start_time) >= toMinutes(form.end_time)) {
      toast.error("Start time must be before end time.");
      return;
    }
    if (!timetableId) {
      toast.error("Missing timetable ID.");
      return;
    }

    setSubmitting(true);

    const payload = {
      subject: String(form.subject).trim(),
      timetable: String(timetableId),
      day_of_week: form.day_of_week,
      start_time: form.start_time,
      end_time: form.end_time,
      room_number: form.room_number ? String(form.room_number).trim() : null,
    };

    try {
      const res = await addTimetableItem(payload);
      const created =
        res?.data && !Array.isArray(res.data)
          ? res.data?.timetable ?? res.data
          : res.data;

      if (created && (created.id || created.pk || created.timetable)) {
        // push created item (if backend returned created object)
        setItems((prev) => [...prev, created]);
      } else {
        // fallback: refresh list from server
        const fresh = await getTimetableItems(timetableId);
        const list = Array.isArray(fresh?.data?.timetables)
          ? fresh.data.timetables
          : Array.isArray(fresh?.data)
          ? fresh.data
          : [];
        setItems(list);
      }

      toast.success("Slot added");
      resetForm();
      setAdding(false);
      onChange();
    } catch (err) {
      console.error("Add slot failed:", err);

      const resp = err?.response;
      const respData = resp?.data;
      const status = resp?.status;

      if (status === 400 && respData) {
        // show server validation message(s)
        showServerErrors(respData);

        // Attempt one safe fallback payload shape if server expects a different timetable key
        try {
          const fallbackPayload = {
            ...payload,
            timetablename_id: String(timetableId),
            timetable_id: String(timetableId),
          };
          const fallbackRes = await addTimetableItem(fallbackPayload);
          const created2 =
            fallbackRes?.data && !Array.isArray(fallbackRes.data)
              ? fallbackRes.data?.timetable ?? fallbackRes.data
              : fallbackRes.data;
          if (created2 && (created2.id || created2.pk || created2.timetable)) {
            setItems((prev) => [...prev, created2]);
            toast.success("Slot added (fallback)");
            resetForm();
            setAdding(false);
            onChange();
            setSubmitting(false);
            return;
          } else {
            // if fallback returned no object, refresh list
            const fresh2 = await getTimetableItems(timetableId);
            const list2 = Array.isArray(fresh2?.data?.timetables)
              ? fresh2.data.timetables
              : Array.isArray(fresh2?.data)
              ? fresh2.data
              : [];
            setItems(list2);
          }
        } catch (err2) {
          console.error("Fallback attempt failed:", err2);
          if (err2?.response?.data) showServerErrors(err2.response.data);
        }
      } else if (respData) {
        // other non-400 error with body
        showServerErrors(respData);
      } else {
        toast.error(err?.message || "Failed to add slot");
      }
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!itemId) return;
    if (!window.confirm("Delete this timetable slot?")) return;
    const prev = items.slice();
    setItems((s) => s.filter((it) => it.id !== itemId));
    try {
      await deleteTimetableItem(itemId);
      toast.success("Deleted");
      onChange();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
      setItems(prev);
    }
  };

  const handlePrint = () => {
    const title =
      classData?.name ||
      classData?.timetable_name ||
      `Timetable ${timetableId || ""}`;
    const rowsHtml = timeRows
      .map((r, ri) => {
        const cells = DAYS.map((d) => {
          const it = grid[d] && grid[d][ri] ? grid[d][ri] : null;
          if (!it)
            return `<td style="border:1px solid #e5e7eb;padding:8px"></td>`;
          const subj =
            it.subject_name || it.subject || it.subject_id || it.subject;
          const room = it.room_number
            ? `<div style="font-size:12px;color:#555;margin-top:6px">Room: ${it.room_number}</div>`
            : "";
          return `<td style="border:1px solid #e5e7eb;padding:8px"><div style="font-weight:600">${subj}</div><div style="font-size:12px;color:#666">${formatTime(
            it.start_time
          )} - ${formatTime(it.end_time)}</div>${room}</td>`;
        }).join("");
        return `<tr><td style="border:1px solid #e5e7eb;padding:8px">${formatTime(
          r.start
        )} - ${formatTime(r.end)}</td>${cells}</tr>`;
      })
      .join("");

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
      <style>
        body{font-family:Inter,system-ui,Arial;margin:0;padding:18px;color:#111}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th,td{border:1px solid #e5e7eb;padding:8px;vertical-align:top}
        th{background:#f8fafc}
        h1{font-size:18px;margin:0 0 8px 0}
        .meta{color:#666;margin-bottom:12px}
      </style>
      </head><body>
      <h1>${title}</h1>
      <div class="meta">${
        classData?.class_label ? `Class: ${classData.class_label}` : ""
      } ${
      classData?.section_label ? ` • Section: ${classData.section_label}` : ""
    }</div>
      <table><thead><tr><th>Time</th>${DAYS.map(
        (d) => `<th>${DAY_LABEL[d]}</th>`
      ).join("")}</tr></thead><tbody>${rowsHtml}</tbody></table>
      <div style="margin-top:12px;color:#777;font-size:12px">Printed: ${new Date().toLocaleString()}</div>
      </body></html>`;

    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      toast.error("Pop-up blocked. Allow pop-ups for print.");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-sm text-gray-500">Timetable</div>
            <div className="text-lg font-semibold">
              {classData?.name ||
                classData?.timetable_name ||
                `ID: ${timetableId}`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setItems([])}
              className="px-3 py-2 border rounded inline-flex items-center gap-2"
            >
              <FiRefreshCw />
            </button>
            <button
              onClick={() => setAdding((s) => !s)}
              className="px-3 py-2 border rounded inline-flex items-center gap-2"
            >
              <FiPlus /> Add
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded inline-flex items-center gap-2"
            >
              <FiPrinter /> Print
            </button>
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
              <FiX />
            </button>
          </div>
        </div>

        <div className="p-4">
          {adding && (
            <form
              onSubmit={handleAdd}
              className="mb-4 grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
            >
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Subject (ID)
                </label>
                <input
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="subject id"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Day</label>
                <select
                  value={form.day_of_week}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, day_of_week: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {DAY_LABEL[d]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Start
                </label>
                <input
                  type="time"
                  value={form.start_time.slice(0, 5)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      start_time: `${e.target.value}:00`,
                    }))
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">End</label>
                <input
                  type="time"
                  value={form.end_time.slice(0, 5)}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, end_time: `${e.target.value}:00` }))
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Room (optional)
                </label>
                <input
                  value={form.room_number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, room_number: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setAdding(false);
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white"
                >
                  {submitting ? "Adding…" : "Add"}
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-4 py-3 text-left">Time</th>
                  {DAYS.map((d) => (
                    <th key={d} className="px-4 py-3 text-left">
                      {DAY_LABEL[d]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3">
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </td>
                      {DAYS.map((d) => (
                        <td key={d} className="px-4 py-3">
                          <div className="h-4 w-40 bg-gray-200 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : timeRows.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8" colSpan={DAYS.length + 1}>
                      No schedule items for this timetable.
                    </td>
                  </tr>
                ) : (
                  timeRows.map((r, ri) => (
                    <tr key={`${r.start}-${r.end}`} className="border-t">
                      <td className="px-4 py-3 font-medium">
                        {formatTime(r.start)} - {formatTime(r.end)}
                      </td>
                      {DAYS.map((d) => {
                        const it = grid[d] && grid[d][ri] ? grid[d][ri] : null;
                        return (
                          <td key={d} className="px-4 py-3 align-top">
                            {it ? (
                              <div className="rounded-lg p-2 bg-purple-50 border border-purple-100">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {it.subject_name ||
                                        it.subject ||
                                        it.subject_id ||
                                        "—"}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatTime(it.start_time)} -{" "}
                                      {formatTime(it.end_time)}
                                    </div>
                                    {it.room_number && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        Room: {it.room_number}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2 items-start">
                                    {it.id && (
                                      <button
                                        onClick={() => handleDelete(it.id)}
                                        title="Delete"
                                        className="p-1 rounded hover:bg-red-50 text-rose-600"
                                      >
                                        <FiTrash2 />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableGrid;

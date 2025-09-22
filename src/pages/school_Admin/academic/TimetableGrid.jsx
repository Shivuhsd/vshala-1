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
import axiosInstance from "../../../services/axiosInstance";

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



  const [subjects, setSubjects] = useState([]);


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


  useEffect(() => {
  const fetchSubjects = async () => {
    try {
      const res = await axiosInstance.get(`/schools/v2/subjects/?school_id=${selectedSchool?.id}&session_id=${selectedSession?.id}`); // replace with your API
      setSubjects(res.data || []); // adjust based on API response
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  fetchSubjects();
}, []);





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
                Subject
              </label>
              <select
                  value={form.subject}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subj) => (
                    <option key={subj.id} value={subj.id}>
                      {subj.label} ({subj.subject_type})
                    </option>
                  ))}
              </select>
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
                                      {it.subject_label ||
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

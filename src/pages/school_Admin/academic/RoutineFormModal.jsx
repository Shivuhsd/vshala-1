import React, { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import {
  FiPlusCircle,
  FiTrash2,
  FiSave,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";

Modal.setAppElement("#root");

/* ------------------- baseURL helpers: with/without /api ------------------- */
const baseHasApi = () => {
  try {
    const u = new URL(axiosInstance.defaults.baseURL || "");
    return u.pathname.replace(/\/+$/, "").endsWith("/api");
  } catch {
    return false;
  }
};
const apiPath = (suffix) => (baseHasApi() ? suffix : `/api${suffix}`);

const RoutineFormModal = ({ open, onClose, onSaved }) => {
  const { selectedSchool, selectedSession } = useSchool();

  const [classLinks, setClassLinks] = useState([]);
  const [sections, setSections] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);

  const classes = useMemo(() => {
    const map = new Map();
    for (const cl of classLinks) {
      if (cl.class_id && !map.has(cl.class_id)) {
        map.set(cl.class_id, cl.class_label || cl.class_name || "Class");
      }
    }
    return Array.from(map, ([id, label]) => ({ id, label }));
  }, [classLinks]);

  // Subjects dummy (replace later with API)
  const [subjects, setSubjects] = useState([]);

  const [step, setStep] = useState(1);
  const [timetableId, setTimetableId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    class_id: "",
    section: "",
  });

  const [items, setItems] = useState([
    {
      subject: "",
      day_of_week: "",
      start_time: "",
      end_time: "",
      room_number: "",
    },
  ]);

  const [submitting, setSubmitting] = useState(false);

  /* ----------------------------- effects ----------------------------- */
  useEffect(() => {
    if (open) {
      fetchClassLinks();
      setSubjects([
        { id: "sub1", label: "Mathematics" },
        { id: "sub2", label: "Science" },
      ]);
      setStep(1);
      setTimetableId(null);
      setItems([
        {
          subject: "",
          day_of_week: "",
          start_time: "",
          end_time: "",
          room_number: "",
        },
      ]);
    }
  }, [open]);

  const fetchClassLinks = async () => {
    if (!selectedSchool?.id || !selectedSession?.id) return;
    setLoadingClasses(true);
    try {
      const url = apiPath(
        `/schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
      );
      const { data } = await axiosInstance.get(url);
      const list = Array.isArray(data?.results) ? data.results : data;
      setClassLinks(list || []);
    } catch {
      toast.error("Failed to load classes.");
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchSections = async (clsId) => {
    if (!clsId) {
      setSections([]);
      return;
    }
    setLoadingSections(true);
    try {
      const url = apiPath(`/admin/v1/sections/?class_link=${clsId}`);
      const { data } = await axiosInstance.get(url);
      const list = Array.isArray(data?.results) ? data.results : data;
      setSections(
        list.map((s) => ({
          id: s.id || s.section_id,
          label: s.label || s.name || "Section",
        }))
      );
    } catch {
      const fallback = classLinks
        .filter((cl) => cl.class_id === clsId)
        .map((cl) => ({
          id: cl.section_id,
          label: cl.section_label || "Section",
        }));
      setSections(fallback);
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    if (form.class_id) {
      setForm((prev) => ({ ...prev, section: "" }));
      fetchSections(form.class_id);
    }
  }, [form.class_id]);

  /* ----------------------------- handlers ----------------------------- */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        subject: "",
        day_of_week: "",
        start_time: "",
        end_time: "",
        room_number: "",
      },
    ]);
  };

  const removeItemRow = (i) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  const createTimetable = async () => {
    if (!form.name.trim() || !form.class_id || !form.section) {
      toast.error("Please fill Timetable Name, Class and Section.");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        class_id: form.class_id,
        section: form.section,
        ...(localStorage.getItem("user_id") && {
          created_by: localStorage.getItem("user_id"),
        }),
      };
      const url = apiPath(`/schools/v1/timetables/`);
      const { data } = await axiosInstance.post(url, payload);
      console.log(payload)
      setTimetableId(data?.id);
      toast.success("Timetable created successfully.");
      setStep(2);
    } catch {
      toast.error("Failed to create timetable.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time.length === 5 ? `${time}:00` : time; // convert HH:MM → HH:MM:SS
  };

  const saveItems = async () => {
    if (!timetableId) return;
    try {
      setSubmitting(true);
      for (const item of items) {
        if (
          !item.subject ||
          !item.day_of_week ||
          !item.start_time ||
          !item.end_time
        )
          continue;
        const payload = {
          subject: item.subject,
          timetable: timetableId,
          day_of_week: item.day_of_week,
          start_time: formatTime(item.start_time),
          end_time: formatTime(item.end_time),
          room_number: item.room_number || "",
        };
        const url = apiPath(`/schools/v1/timetable/items/add/`);
        await axiosInstance.post(url, payload);
      }
      toast.success("Items saved successfully.");
      onSaved?.();
      onClose?.();
    } catch {
      toast.error("Failed to save timetable items.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel="Timetable Modal"
      className="bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-xl p-6 max-w-4xl mx-auto mt-20 shadow-2xl border border-gray-200 outline-none"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span
            className={`px-3 py-1 rounded-full ${
              step === 1 ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}
          >
            1. Timetable
          </span>
          <FiArrowRight />
          <span
            className={`px-3 py-1 rounded-full ${
              step === 2 ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}
          >
            2. Items
          </span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      {step === 1 && (
        <>
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Create Timetable
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Timetable Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., BCA 1ST YEAR"
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Class *</label>
              <select
                name="class_id"
                value={form.class_id}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold">Section *</label>
              <select
                name="section"
                value={form.section}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={createTimetable}
              disabled={submitting}
              className="px-4 py-2 rounded bg-purple-700 text-white flex items-center gap-2 hover:bg-purple-800"
            >
              <FiSave /> {submitting ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-semibold text-purple-700 mb-4">
            Add Timetable Items
          </h2>
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end border p-3 rounded-md bg-gray-50"
              >
                <select
                  value={item.subject}
                  onChange={(e) =>
                    handleItemChange(i, "subject", e.target.value)
                  }
                  className="border px-2 py-1 rounded focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <select
                  value={item.day_of_week}
                  onChange={(e) =>
                    handleItemChange(i, "day_of_week", e.target.value)
                  }
                  className="border px-2 py-1 rounded focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Day</option>
                  {["mon", "tue", "wed", "thu", "fri", "sat"].map((d) => (
                    <option key={d} value={d}>
                      {d.toUpperCase()}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={item.start_time}
                  onChange={(e) =>
                    handleItemChange(i, "start_time", e.target.value)
                  }
                  className="border px-2 py-1 rounded focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="time"
                  value={item.end_time}
                  onChange={(e) =>
                    handleItemChange(i, "end_time", e.target.value)
                  }
                  className="border px-2 py-1 rounded focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.room_number}
                    onChange={(e) =>
                      handleItemChange(i, "room_number", e.target.value)
                    }
                    placeholder="Room"
                    className="border px-2 py-1 rounded w-full focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItemRow(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={addItemRow}
              className="px-3 py-1 text-sm border rounded flex items-center gap-1 hover:bg-gray-100"
            >
              <FiPlusCircle /> Add Row
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 border rounded flex items-center gap-2 hover:bg-gray-100"
              >
                <FiArrowLeft /> Back
              </button>
              <button
                onClick={saveItems}
                disabled={submitting}
                className="px-4 py-2 rounded bg-purple-700 text-white flex items-center gap-2 hover:bg-purple-800"
              >
                <FiSave /> {submitting ? "Saving..." : "Save All"}
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default RoutineFormModal;

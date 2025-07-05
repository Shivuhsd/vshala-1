import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import { FiPlusCircle } from "react-icons/fi";

Modal.setAppElement("#root");

const RoutineFormModal = ({ open, onClose, initialData, onSaved }) => {
  const { selectedSchool, selectedSession } = useSchool();

  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    class: "",
    section: "",
    subject: "",
    day: "",
    start_time: "",
    end_time: "",
    room_no: "",
    teacher: "",
  });

  useEffect(() => {
    if (selectedSchool?.id && selectedSession?.id) {
      axiosInstance
        .get(
          `/schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
        )
        .then((res) => {
          setClasses(res.data.results || []);
        })
        .catch(() => toast.error("Failed to load classes"));
    }
  }, [selectedSchool?.id, selectedSession?.id]);

  useEffect(() => {
    if (form.class) {
      const classSections =
        classes.find((cls) => cls.class_id === form.class)?.sections || [];
      setSections(classSections);
    } else {
      setSections([]);
    }
  }, [form.class, classes]);

  useEffect(() => {
    // Dummy data (replace with real API if needed)
    setSubjects([
      { id: "sub1", label: "Mathematics" },
      { id: "sub2", label: "Science" },
    ]);
    setTeachers([
      { id: "t1", name: "Mr. Sharma" },
      { id: "t2", name: "Ms. Anita" },
    ]);
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        class: "",
        section: "",
        subject: "",
        day: "",
        start_time: "",
        end_time: "",
        room_no: "",
        teacher: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !form.class ||
      !form.section ||
      !form.subject ||
      !form.day ||
      !form.start_time ||
      !form.end_time
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Combine class and section to get class_link_id (you'll need to map this in your backend or API)
    const classLink = classes.find(
      (cls) => cls.class_id === form.class && cls.section_id === form.section
    );

    if (!classLink) {
      toast.error("Invalid class/section combination");
      return;
    }

    const payload = {
      ...form,
      class_link: classLink.id, // This is the actual class_link_id
    };

    try {
      // await axiosInstance.post("/schools/v1/routines/", payload);
      toast.success("Routine would be saved (dummy mode)");
      onClose();
      onSaved();
    } catch (error) {
      toast.error("Failed to save routine");
    }
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel="Routine Form"
      className="bg-white rounded-xl p-6 max-w-2xl mx-auto mt-24 shadow-2xl border border-gray-200 outline-none"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <h2 className="text-2xl font-semibold text-purple-700 mb-6 border-b pb-2">
        {initialData ? "Edit Routine" : "Add New Routine"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Class
          </label>
          <select
            name="class"
            value={form.class}
            onChange={(e) => {
              handleChange(e);
              setForm((prev) => ({ ...prev, section: "" }));
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Class</option>
            {[...new Set(classes.map((c) => c.class_id))].map((classId) => {
              const className = classes.find(
                (c) => c.class_id === classId
              )?.class_label;
              return (
                <option key={classId} value={classId}>
                  {className}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Section
          </label>
          <select
            name="section"
            value={form.section}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Section</option>
            {classes
              .filter((c) => c.class_id === form.class)
              .map((s) => (
                <option key={s.section_id} value={s.section_id}>
                  {s.section_label}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Subject
          </label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.label}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Day
          </label>
          <select
            name="day"
            value={form.day}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Day</option>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Start Time
          </label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            End Time
          </label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Room Number
          </label>
          <input
            type="text"
            name="room_no"
            value={form.room_no}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            Teacher
          </label>
          <select
            name="teacher"
            value={form.teacher}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Teacher</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={onClose}
          className="text-sm text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
        >
          <FiPlusCircle />
          {initialData ? "Save Changes" : "Add Routine"}
        </button>
      </div>
    </Modal>
  );
};

export default RoutineFormModal;

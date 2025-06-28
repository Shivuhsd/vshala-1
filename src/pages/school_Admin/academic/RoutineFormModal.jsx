import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import { FiPlusCircle } from "react-icons/fi";

Modal.setAppElement("#root");

const RoutineFormModal = ({ open, onClose, initialData, onSaved }) => {
  const { selectedSchool, selectedSession } = useSchool();

  const [form, setForm] = useState({
    class_link: "",
    section: "",
    subject: "",
    day: "",
    start_time: "",
    end_time: "",
    room_no: "",
    teacher: "",
  });

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // ✅ Skip actual API for now — fill with dummy data later if needed
  useEffect(() => {
    setClasses([]); // placeholder
    setSubjects([]);
    setTeachers([]);
  }, [selectedSchool?.id, selectedSession?.id]);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        class_link: "",
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

  const handleSubmit = () => {
    toast.success("Routine would be saved (dummy mode)");
    onClose();
    onSaved();
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={onClose}
      contentLabel="Routine Form"
      className="bg-white rounded-lg p-6 max-w-xl mx-auto mt-24 shadow-xl border border-gray-200 outline-none"
      overlayClassName="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
    >
      <h2 className="text-xl font-semibold text-purple-700 mb-4">
        {initialData ? "Edit Routine" : "Add New Routine"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Class
          </label>
          <select
            name="class_link"
            value={form.class_link}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_label} - {cls.section_label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Subject
          </label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Day
          </label>
          <select
            name="day"
            value={form.day}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Room Number
          </label>
          <input
            name="room_no"
            value={form.room_no}
            onChange={handleChange}
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Start Time
          </label>
          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">
            End Time
          </label>
          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-600 block mb-1">
            Teacher
          </label>
          <select
            name="teacher"
            value={form.teacher}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
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

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="text-sm text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
        >
          <FiPlusCircle />
          {initialData ? "Save Changes" : "Add Routine"}
        </button>
      </div>
    </Modal>
  );
};

export default RoutineFormModal;

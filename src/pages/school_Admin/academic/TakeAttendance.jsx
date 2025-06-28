import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClipboard } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";

const TakeAttendance = () => {
  const { selectedSchool, selectedSession } = useSchool();
  const navigate = useNavigate();

  const [attendanceType, setAttendanceType] = useState("month");
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSchool?.id || !selectedSession?.id) return;
      try {
        const classRes = await axiosInstance.get(
          `/schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
        );
        const subjectRes = await axiosInstance.get(`/schools/v1/subjects/`);
        setClasses(classRes.data.results || []);
        setSubjects(subjectRes.data || []);
      } catch (err) {
        console.error("Failed to fetch form options", err);
      }
    };
    fetchData();
  }, [selectedSchool?.id, selectedSession?.id]);

  useEffect(() => {
    const cls = classes.find((c) => c.id === selectedClass);
    setSections(cls?.sections || []);
    setSelectedSection("");
  }, [selectedClass]);

  const handleProceed = () => {
    if (!selectedClass || !date) {
      alert("Please select Class and Date.");
      return;
    }

    navigate("/school-admin/academic/manage-attendance", {
      state: {
        class_id: selectedClass,
        section: selectedSection,
        date,
        subject: attendanceType === "subject" ? selectedSubject : null,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#6B21A8] flex items-center gap-2">
            <FiClipboard />
            Take Attendance
          </h2>
        </div>

        {/* Attendance Mode */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Attendance By
          </p>
          <div className="flex gap-6 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="month"
                checked={attendanceType === "month"}
                onChange={(e) => setAttendanceType(e.target.value)}
                className="accent-[#6B21A8]"
              />
              By Month
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="subject"
                checked={attendanceType === "subject"}
                onChange={(e) => setAttendanceType(e.target.value)}
                className="accent-[#6B21A8]"
              />
              By Subject
            </label>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              * Class
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Section
            </label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">All Sections</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              * Date
            </label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {attendanceType === "subject" && (
            <div className="col-span-full lg:col-span-1">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                * Subject
              </label>
              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {subjects.map((subj) => (
                  <option key={subj.id} value={subj.id}>
                    {subj.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="text-center mt-8">
          <button
            onClick={handleProceed}
            className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            Manage Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeAttendance;

import React, { useEffect, useState } from "react";
import { FiCalendar, FiEye } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";

const ViewAttendance = () => {
  const { selectedSchool, selectedSession } = useSchool();

  const [attendanceType, setAttendanceType] = useState("month");
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [month, setMonth] = useState("");

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSchool?.id || !selectedSession?.id) return;

      try {
        const classRes = await axiosInstance.get(
          `/schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
        );
        const subjectRes = await axiosInstance.get("/schools/v1/subjects/");

        setClasses(classRes.data.results || []);
        setSubjects(subjectRes.data || []);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchData();
  }, [selectedSchool?.id, selectedSession?.id]);

  useEffect(() => {
    const selected = classes.find((cls) => cls.id === selectedClass);
    setSections(selected?.sections || []);
    setSelectedSection("");
  }, [selectedClass]);

  const handleView = async () => {
    if (!selectedClass || !month) {
      alert("Please select Class and Month.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/schools/v1/attendances/`, {
        params: {
          class_id: selectedClass,
          section: selectedSection,
          subject: attendanceType === "subject" ? selectedSubject : null,
          date: month,
        },
      });
      setAttendanceData(res.data.attendance || []);
    } catch (err) {
      console.error("Error fetching attendance", err);
      setAttendanceData([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#6B21A8] flex items-center gap-2">
            <FiCalendar /> View Attendance
          </h2>
          <button
            onClick={() =>
              (window.location.href = "/school-admin/academic/take-attendance")
            }
            className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <FiEye />
            Take Attendance
          </button>
        </div>

        {/* Attendance Type */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            Attendance By
          </p>
          <div className="flex gap-6 text-sm text-gray-700">
            {["month", "subject"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={type}
                  checked={attendanceType === type}
                  onChange={(e) => setAttendanceType(e.target.value)}
                  className="accent-[#6B21A8]"
                />
                {type === "month" ? "By Month" : "By Subject"}
              </label>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
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
              * Section
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
              * Month
            </label>
            <input
              type="month"
              className="w-full border rounded px-3 py-2 text-sm"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
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
                <option value="">All Subjects</option>
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
        <div className="text-center mb-8">
          <button
            onClick={handleView}
            className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            View Attendance
          </button>
        </div>

        {/* Attendance Result Table */}
        {loading ? (
          <div className="text-center text-gray-600">
            Loading attendance data...
          </div>
        ) : (
          <div className="overflow-x-auto">
            {attendanceData.length === 0 ? (
              <p className="text-center text-gray-500">
                No Attendance Records Found
              </p>
            ) : (
              <table className="min-w-full bg-white rounded-md shadow text-sm border">
                <thead className="bg-[#6B21A8] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">Student Name</th>
                    {attendanceData[0]?.records.map((record, idx) => (
                      <th key={idx} className="px-4 py-2 text-center">
                        {record.date}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((student) => (
                    <tr key={student.student_id} className="border-b">
                      <td className="px-4 py-2 font-medium text-gray-800">
                        {student.student_name}
                      </td>
                      {student.records.map((rec, i) => (
                        <td key={i} className="px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              rec.status === "present"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttendance;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiUserCheck } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import { toast } from "react-toastify";

const ManageAttendance = () => {
  const { state } = useLocation(); // passed from TakeAttendance
  const { class_id, section, date, subject } = state || {};

  const { selectedSchool, selectedSession } = useSchool();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch attendance data
  useEffect(() => {
  if (!class_id || !section || !date) return;

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const formattedMonth = date.slice(0, 7); // yyyy-mm
      let res = await axiosInstance.get(
        `/schools/v1/attendances/?date=${formattedMonth}&class_id=${class_id}&section=${section}${
          subject ? `&subject=${subject}` : ""
        }`
      );

      let data = res.data.attendance;

      // If attendance is empty or null, fetch student list instead
      if (!Array.isArray(data) || data.length === 0) {
        console.log("No attendance found, fetching student list...");
        const studentRes = await axiosInstance.get(
          `/schools/v1/students?class_id=${class_id}&section_id=${section}&school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
        );
        const studentList = studentRes.data || [];

        // Map students with undefined attendance
        const mapped = studentList.map((s) => ({
          id: s.id,
          name: s.name,
          status: "undefined",
        }));

        setStudents(mapped);
      } else {
        // Attendance exists, map attendance with today’s record
        const mapped = data.map((student) => {
          const todayRecord = student.records.find((r) => r.date === date);
          return {
            id: student.student_id,
            name: student.student_name,
            status: todayRecord?.status || "undefined",
          };
        });

        setStudents(mapped);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch attendance or student list.");
    } finally {
      setLoading(false);
    }
  };

  fetchAttendance();
}, [class_id, section, date, subject]);

  const handleStatusChange = (id, status) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const markAll = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        date,
        class_id,
        section,
        subject: subject || null,
        attendance: students.map((s) => ({
          student: s.id,
          status: s.status,
        })),
      };
      console.log(payload)
      await axiosInstance.post(`/schools/v1/attendances/`, payload);
       console.log("Submission successful");
       alert("Attendance Submitted Successfully")
      toast.success("Attendance submitted successfully");
    } catch (err) {
      toast.error("Failed to save attendance");
      alert("Attendance Submitted Successfully")
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="bg-white rounded-xl shadow border border-gray-200 p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#6B21A8] flex items-center gap-2">
              <FiUserCheck />
              Manage Attendance
            </h2>
            <p className="text-sm text-gray-600">
              Date: {date} | Subject: {subject || "—"}
            </p>
          </div>
        </div>

        {/* Mark All */}
        <div className="flex justify-end gap-3 mb-3">
          <button
            onClick={() => markAll("present")}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            ✔️ Mark All Present
          </button>
          <button
            onClick={() => markAll("absent")}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            ❌ Mark All Absent
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border-collapse">
            <thead className="bg-[#6B21A8] text-white text-left text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} className="text-center py-8 text-gray-500">
                    Loading students...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-8 text-gray-500">
                    No students found for this class/section.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-4">
                        {["undefined", "present", "absent"].map((status) => (
                          <label
                            key={status}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              value={status}
                              checked={student.status === status}
                              onChange={() =>
                                handleStatusChange(student.id, status)
                              }
                              className={`accent-${
                                status === "present"
                                  ? "green-600"
                                  : status === "absent"
                                  ? "red-600"
                                  : "gray-400"
                              }`}
                            />
                            <span className="capitalize">{status}</span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Submit */}
        <div className="text-right mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAttendance;

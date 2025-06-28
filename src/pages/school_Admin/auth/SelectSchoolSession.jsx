import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSchool } from "../context/SchoolContext";
import loginImage from "../../../assets/login_image.png"; // Adjust path if needed

const SelectSchoolSession = () => {
  const navigate = useNavigate();
  const {
    schoolList,
    sessionList,
    setSelectedSchool,
    setSelectedSession,
  } = useSchool();

  const [schoolId, setSchoolId] = useState("");
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    console.log("🏫 Available schools:", schoolList);
    console.log("📅 Available sessions:", sessionList);
  }, [schoolList, sessionList]);

  const handleContinue = () => {
    const school = schoolList.find((s) => String(s.id) === String(schoolId));
    const session = sessionList.find((s) => String(s.id) === String(sessionId));

    if (!school || !session) {
      alert("Please select both school and session.");
      return;
    }

    setSelectedSchool(school);
    setSelectedSession(session);
    navigate("/school-admin/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "#5906B2" }}
    >
      <div className="bg-white text-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md relative border-2" style={{ borderColor: "#8C50E2" }}>
        {/* Floating image with animation */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={loginImage}
            alt="Select Prompt"
            className="w-24 h-24 object-contain animate-float"
          />
          <p className="text-sm text-center text-gray-600 mt-2 italic">
            Please select your school and session to proceed.
          </p>
        </div>

        <h2 className="text-xl font-bold mb-6 text-center text-purple-700">
          Select School & Session
        </h2>

        {/* School Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">School</label>
          <select
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
          >
            <option value="">-- Select School --</option>
            {schoolList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Session Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Session</label>
          <select
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          >
            <option value="">-- Select Session --</option>
            {sessionList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleContinue}
          disabled={!schoolId || !sessionId}
          className={`w-full py-2 text-white rounded-md font-semibold transition ${
            !schoolId || !sessionId
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-800"
          }`}
        >
          Continue
        </button>
      </div>

      {/* ✨ Keyframe animation style */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default SelectSchoolSession;

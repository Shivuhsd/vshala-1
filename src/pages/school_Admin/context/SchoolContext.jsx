import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../../../services/axiosInstance";

const SchoolContext = createContext();

export const SchoolProvider = ({ children }) => {
  const safeParse = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const [selectedSchool, setSelectedSchool] = useState(() => safeParse("school"));
  const [selectedSession, setSelectedSession] = useState(() => safeParse("session"));
  const [sessionList, setSessionList] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Track loading

  // ✅ Step 1: Load school by ID (or skip if already available)
  useEffect(() => {
    const loadSchool = async () => {
      const schoolId = localStorage.getItem("school_id");
      const token = localStorage.getItem("schoolAdminToken");

      if (!schoolId || !token) {
        setLoading(false);
        return;
      }

      // Skip if already loaded correctly
      const alreadyLoaded = selectedSchool?.id === schoolId && selectedSchool?.label;
      if (alreadyLoaded) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get(`admin/v1/school/${schoolId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.id) {
          setSelectedSchool(res.data);
          localStorage.setItem("school", JSON.stringify(res.data));
        }
      } catch (error) {
        console.error("❌ Failed to load school details:", error);
      } finally {
        setLoading(false); // ✅ Done
      }
    };

    loadSchool();
  }, []);

  // ✅ Step 2: Load sessions when school is available
  useEffect(() => {
    const fetchSessions = async () => {
      if (!selectedSchool?.id) return;

      try {
        const res = await axiosInstance.get(`admin/v1/sessions/?school_id=${selectedSchool.id}`);
        const sessions = res.data || [];

        setSessionList(sessions);

        if (!selectedSession && sessions.length > 0) {
          setSelectedSession(sessions[0]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch sessions:", err);
      }
    };

    fetchSessions();
  }, [selectedSchool]);

  // ✅ Step 3: Persist session when changed
  useEffect(() => {
    if (selectedSession) {
      localStorage.setItem("session", JSON.stringify(selectedSession));
    }
  }, [selectedSession]);

  return (
    <SchoolContext.Provider
      value={{
        selectedSchool,
        selectedSession,
        setSelectedSchool,
        setSelectedSession,
        sessionList,
        loading, // ✅ exposed
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => useContext(SchoolContext);

// services/timetableApi.js
import axiosInstance from "./axiosInstance";

/**
 * Timetable API helpers
 * - Uses the endpoints discussed in the conversation
 * - Edit paths here if your backend differs
 */

/* Timetable list/create/delete */
export const listTimetables = async ({ school_id, session_id } = {}) => {
  const params = new URLSearchParams();
  if (session_id) params.append("session_id", session_id);
  if (school_id) params.append("school_id", school_id);
  const url = `/schools/v1/timetables/?${params.toString()}`;
  return axiosInstance.get(url);
};

export const createTimetable = async (
  payload = {},
  { school_id, session_id } = {}
) => {
  const params = new URLSearchParams();
  if (session_id) params.append("session_id", session_id);
  if (school_id) params.append("school_id", school_id);
  const url = `/schools/v1/timetables/?${params.toString()}`;
  return axiosInstance.post(url, payload);
};

export const deleteTimetable = async (id) => {
  return axiosInstance.delete(
    `/schools/v1/timetables/${encodeURIComponent(id)}/`
  );
};

/* Timetable items */
export const getTimetableItems = async (timetableId) => {
  const url = `/schools/v1/timetable/items/add/?timetablename_id=${encodeURIComponent(
    timetableId
  )}`;
  return axiosInstance.get(url);
};

export const addTimetableItem = async (payload) => {
  // payload: { subject, timetable, day_of_week, start_time, end_time, room_number }
  return axiosInstance.post("/schools/v1/timetable/items/add/", payload);
};

export const deleteTimetableItem = async (itemId) => {
  // adjust path if your backend differs
  return axiosInstance.delete(
    `/schools/v1/timetable/${encodeURIComponent(itemId)}/update/`
  );
};

/* ---- Helper lookups: classes & sections ----
   Used to map GUIDs -> friendly labels when timetable rows contain only IDs.
   Edit endpoints if your backend uses different paths.
*/
export const listClasses = async ({ school_id } = {}) => {
  const params = new URLSearchParams();
  if (school_id) params.append("school_id", school_id);
  const url = `/schools/v1/classes/?${params.toString()}`;
  return axiosInstance.get(url);
};

export const listSections = async ({ school_id } = {}) => {
  const params = new URLSearchParams();
  if (school_id) params.append("school_id", school_id);
  const url = `/schools/v1/sections/?${params.toString()}`;
  return axiosInstance.get(url);
};

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GroupSubjects = () => {
  const { selectedSchool, selectedSession } = useSchool();

  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [groupedList, setGroupedList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (!selectedSchool?.id || !selectedSession?.id) return;

    axiosInstance
      .get(`schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`)
      .then((res) => setClassOptions(res.data.results || []))
      .catch(() => console.error("Failed to fetch class list"));

    axiosInstance
      .get("schools/v1/subjects/")
      .then((res) => setSubjectOptions(res.data || []))
      .catch(() => console.error("Failed to fetch subjects"));
  }, [selectedSchool.id, selectedSession.id]);

  useEffect(() => {
    if (!selectedSchool?.id || !selectedSession?.id || classOptions.length === 0) return;

    axiosInstance
      .get(`schools/v1/sub/groups/?tenant_id=${selectedSchool.id}&session_id=${selectedSession.id}`)
      .then((res) => {
        const groups = res.data?.data || [];
        const formatted = groups.map((g) => ({
          id: g.id,
          label: g.label,
          code: g.code,
          class_link_id: g.class_link_id,
          classLabel: g.class_label || "N/A",
          subjects: g.subjects.map((s) => ({
            id: s.id,
            name: s.label,
            code: s.subject_code,
          })),
        }));
        setGroupedList(formatted);
      })
      .catch(() => console.error("Failed to fetch groups"));
  }, [selectedSchool.id, selectedSession.id, classOptions]);

  const handleAddSubject = () => {
    if (subjects.length >= 8) return;
    setSubjects([...subjects, { name: "", code: "" }]);
  };

  const handleSubjectChange = (index, value) => {
    const updated = [...subjects];
    updated[index].name = value;
    const subject = subjectOptions.find((s) => s.label === value);
    updated[index].id = subject?.id || "";
    setSubjects(updated);
  };

  const handleCodeChange = (index, value) => {
    const updated = [...subjects];
    updated[index].code = value;
    setSubjects(updated);
  };

  const handleRemoveSubject = (index) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGroupSubmit = async () => {
    if (!selectedClassId || !groupName || !groupCode || subjects.length < 1) return;

    const subject_ids = subjects.map((s) => subjectOptions.find((opt) => opt.label === s.name)?.id).filter(Boolean);
    const subject_codes = subjects.map((s) => s.code);

    const payload = {
      label: groupName,
      code: groupCode,
      class_link_id: selectedClassId,
      subject_ids,
      subject_codes,
    };

    try {
      if (isEditing) {
        await axiosInstance.put(`schools/v1/sub/group/${editId}/update/`, payload);
        const updatedList = groupedList.map((g) =>
          g.id === editId
            ? {
                ...g,
                label: groupName,
                code: groupCode,
                class_link_id: selectedClassId,
                classLabel: classOptions.find(c => c.id === selectedClassId)?.label || "N/A",
                subjects,
              }
            : g
        );
        setGroupedList(updatedList);
        toast.success("Group updated successfully!");
      } else {
        const res = await axiosInstance.post("schools/v1/sub/groups/", payload);
        const newGroup = {
          id: res.data.id,
          label: groupName,
          code: groupCode,
          class_link_id: selectedClassId,
          classLabel: classOptions.find(c => c.id === selectedClassId)?.label || "N/A",
          subjects,
        };
        setGroupedList((prev) => [...prev, newGroup]);
        toast.success("Group created successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving group", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedClassId("");
    setGroupName("");
    setGroupCode("");
    setSubjects([]);
    setIsEditing(false);
    setEditId(null);
  };

  const handleEditGroup = (group) => {
    const restoredSubjects = group.subjects.map((s) => ({
      name: s.name,
      code: s.code,
      id: s.id,
    }));

    setSelectedClassId(group.class_link_id);
    setGroupName(group.label);
    setGroupCode(group.code);
    setSubjects(restoredSubjects);
    setIsEditing(true);
    setEditId(group.id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-12">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-[#6B21A8]">Group Subjects</h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6 border border-[#E2E8F0]">
        <h2 className="text-lg font-semibold text-gray-800">
          {isEditing ? "Edit Subject Group" : "Create Subject Group"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border rounded px-4 py-2"
            required
          >
            <option value="">Select Class</option>
            {classOptions.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
            className="border rounded px-4 py-2"
            required
          />

          <input
            type="text"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
            placeholder="Group Code"
            className="border rounded px-4 py-2"
            required
          />
        </div>

        {/* Subjects List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Subjects in Group</h3>
            {subjects.length < 8 && (
              <button
                onClick={handleAddSubject}
                className="bg-[#6B21A8] text-white text-sm px-4 py-2 rounded hover:bg-[#9333EA]"
              >
                + Add Subject
              </button>
            )}
          </div>

          {subjects.length === 0 && <p className="text-sm text-gray-500">No subjects added yet.</p>}

          {subjects.map((subject, idx) => (
            <div key={idx} className="flex gap-4 flex-col sm:flex-row">
              <select
                value={subject.name}
                onChange={(e) => handleSubjectChange(idx, e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">Select Subject</option>
                {subjectOptions.map((s) => (
                  <option key={s.id} value={s.label}>
                    {s.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={subject.code}
                onChange={(e) => handleCodeChange(idx, e.target.value)}
                placeholder="Enter Subject Code"
                className="w-full border rounded px-3 py-2"
                required
              />

              <button
                onClick={() => handleRemoveSubject(idx)}
                className="text-sm px-3 py-2 text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4 flex gap-3">
          <button
            onClick={handleGroupSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm"
            disabled={!selectedClassId || !groupName || !groupCode || subjects.length === 0}
          >
            {isEditing ? "Save Changes" : "Submit Group"}
          </button>
          {isEditing && (
            <button
              onClick={resetForm}
              className="px-6 py-2 border rounded text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6 border border-[#E2E8F0]">
        <h2 className="text-lg font-semibold text-gray-800">Existing Groups</h2>

        {groupedList.length === 0 ? (
          <p className="text-sm text-gray-500">No groups available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-[#F1F5F9] text-xs uppercase text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">Group Name</th>
                  <th className="px-4 py-3 text-left">Group Code</th>
                  <th className="px-4 py-3 text-left">Class</th>
                  <th className="px-4 py-3 text-left">Subjects</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedList.map((group, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{group.label}</td>
                    <td className="px-4 py-2">{group.code}</td>
                    <td className="px-4 py-2">{group.classLabel}</td>
                    <td className="px-4 py-2">
                      {group.subjects.map((s) => `${s.name} (${s.code})`).join(", ")}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSubjects;

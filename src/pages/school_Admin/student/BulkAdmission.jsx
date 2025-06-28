// src/pages/school_Admin/student/BulkAdmission.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import "react-toastify/dist/ReactToastify.css";
import { useSchool } from "../context/SchoolContext";

const BulkAdmission = () => {
  const navigate = useNavigate();
  const { selectedSchool, selectedSession } = useSchool();

  const [classOptions, setClassOptions] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [file, setFile] = useState(null);

  // Fetch class options
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axiosInstance.get(
          `schools/v1/schools/classes/links/?school_id=${selectedSchool?.id}&session_id=${selectedSession?.id}`
        );
        setClassOptions(res.data.results || []);
      } catch (err) {
        toast.error("Failed to load class list");
        console.error(err);
      }
    };

    if (selectedSchool?.id && selectedSession?.id) {
      fetchClasses();
    }
  }, [selectedSchool?.id, selectedSession?.id]);

  const handleExportSample = () => {
    window.open("/sample-csv/student_import_sample.csv", "_blank");
  };

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (!uploaded?.name.endsWith(".csv")) {
      toast.error("Please select a valid .csv file");
      return;
    }
    setFile(uploaded);
  };

  const handleImport = async () => {
    if (!selectedClassId) {
      return toast.error("Please select a class");
    }

    if (!file) {
      return toast.error("Please select a CSV file");
    }

    const formData = new FormData();
    formData.append("class_id", selectedClassId);
    formData.append("file", file);
    formData.append("school_id", selectedSchool?.id);
    formData.append("session_id", selectedSession?.id);

    try {
      await axiosInstance.post("schools/v1/admission/bulk/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Bulk admission imported successfully!");
      setFile(null);
      setSelectedClassId("");
    } catch (err) {
      toast.error("Import failed. Check file format and data.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-[#6B21A8] mb-4">
        Bulk Admission
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Select class, click "Export Sample CSV", fill student details in the
        file, choose the CSV file with student details and click "Bulk Import".
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="">Select Class</option>
          {classOptions.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_label}
            </option>
          ))}
        </select>

        <div />

        <button
          onClick={handleExportSample}
          className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded"
        >
          Export Sample CSV
        </button>
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Choose CSV File *
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="border px-4 py-2 rounded w-full"
        />
        {file && (
          <p className="text-sm text-green-600 mt-1">Selected: {file.name}</p>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={handleImport}
          className="bg-[#6B21A8] hover:bg-[#9333EA] text-white px-6 py-2 rounded"
        >
          Bulk Import
        </button>
      </div>
    </div>
  );
};

export default BulkAdmission;

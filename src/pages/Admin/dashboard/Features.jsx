import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dummyFeatures = [
  { id: "f1", name: "Online Admission" },
  { id: "f2", name: "Fee Management" },
  { id: "f3", name: "Student Attendance" },
  { id: "f4", name: "Exam Results" },
  { id: "f5", name: "Staff Payroll" },
  { id: "f6", name: "Transport Tracking" },
  { id: "f7", name: "Notifications & SMS" },
  { id: "f8", name: "Document Repository" },
];

const Features = () => {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [features, setFeatures] = useState([]);
  const [enabledFeatures, setEnabledFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axiosInstance.get("/admin/v1/schools/list/");
        setSchools(res.data.results || []);
      } catch {
        toast.error("Failed to load schools.");
      }
    };
    fetchSchools();
  }, []);

  // Fetch features for selected school
  useEffect(() => {
    if (!selectedSchool) return;

    const fetchFeatures = async () => {
      try {
        // Replace below with actual API when available
        const res = await axiosInstance.get(`/admin/v1/features/?school_id=${selectedSchool}`);
        setFeatures(res.data.features || dummyFeatures);
        setEnabledFeatures(res.data.enabled || []);
      } catch {
        // For demo purposes
        setFeatures(dummyFeatures);
        setEnabledFeatures(["f1", "f3", "f6"]); // enabled features dummy
      }
    };
    fetchFeatures();
  }, [selectedSchool]);

  const handleToggle = (id) => {
    setEnabledFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/admin/v1/features/update/", {
        school_id: selectedSchool,
        enabled: enabledFeatures,
      });
      toast.success("Features updated successfully!");
    } catch {
      toast.error("Failed to update features.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-xl space-y-8">
      <ToastContainer />

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Feature Management</h1>
        <p className="text-sm text-gray-500 mt-1">Enable/Disable features for each school.</p>
      </div>

      {/* School Selector */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Select School</label>
        <select
          className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
        >
          <option value="">-- Choose a school --</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.label}
            </option>
          ))}
        </select>
      </div>

      {/* Feature Toggles */}
      {selectedSchool && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Available Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((feature) => (
              <label
                key={feature.id}
                className="flex items-center gap-3 bg-gray-50 border p-3 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <input
                  type="checkbox"
                  checked={enabledFeatures.includes(feature.id)}
                  onChange={() => handleToggle(feature.id)}
                  className="accent-purple-600"
                />
                <span className="text-sm font-medium text-gray-700">{feature.name}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className={`mt-6 px-6 py-2 rounded-md text-white font-medium transition ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Features;

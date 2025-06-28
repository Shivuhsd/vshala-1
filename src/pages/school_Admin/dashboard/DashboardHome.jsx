import React, { useEffect, useState } from "react";
import {
  FiUsers,
  FiBook,
  FiCalendar,
  FiUserPlus,
  FiBell,
  FiArrowRightCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useSchool } from "../context/SchoolContext";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const DashboardHome = () => {
  const { selectedSchool, selectedSession } = useSchool();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardStats = async () => {
    if (!selectedSchool?.id || !selectedSession?.id) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/schools/v1/dashboard/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
      );
      setDashboardStats(response.data);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [selectedSchool?.id, selectedSession?.id]);

  const statItems = dashboardStats
    ? [
        {
          label: "Total Students",
          value: dashboardStats.total_students,
          icon: FiUsers,
          color: "bg-gradient-to-r from-indigo-500 to-purple-500",
        },
        {
          label: "Total Staff",
          value: dashboardStats.total_staff,
          icon: FiBook,
          color: "bg-gradient-to-r from-blue-500 to-cyan-500",
        },
        {
          label: "Classes Running",
          value: dashboardStats.total_classes,
          icon: FiCalendar,
          color: "bg-gradient-to-r from-green-500 to-emerald-400",
        },
        {
          label: "Students This Session",
          value: dashboardStats.students_in_current_session,
          icon: FiUserPlus,
          color: "bg-gradient-to-r from-yellow-500 to-orange-400",
        },
      ]
    : [];

  // Chart Data (Dummy)
  const barData = {
    labels: ["Class 1", "Class 2", "Class 3", "Class 4"],
    datasets: [
      {
        label: "Student Count",
        data: [30, 45, 38, 50],
        backgroundColor: "#6366f1",
      },
    ],
  };

  const pieData = {
    labels: ["Boys", "Girls", "Others"],
    datasets: [
      {
        label: "Gender Distribution",
        data: [120, 100, 5],
        backgroundColor: ["#3b82f6", "#ec4899", "#facc15"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="bg-white border-l-8 border-purple-600 rounded-xl p-6 shadow-xl">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, School Admin
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          You're managing <strong>{selectedSchool?.label || "..."}</strong> for
          session <strong>{selectedSession?.label || "..."}</strong>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">
            Loading...
          </div>
        ) : (
          statItems.map(({ label, value, icon: Icon, color }, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl shadow-md text-white flex justify-between items-center ${color} hover:scale-105 transition-transform`}
            >
              <div>
                <p className="text-sm opacity-90">{label}</p>
                <p className="text-3xl font-bold">{value ?? 0}</p>
              </div>
              <Icon size={28} className="opacity-90" />
            </div>
          ))
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Students by Class
          </h2>
          <Bar data={barData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Gender Breakdown
          </h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <FiBell size={20} className="text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Latest Announcements
          </h2>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>📌 Mid-term exams scheduled from July 1st week</li>
          <li>📌 New teacher orientation on Monday</li>
          <li>📌 Library updated with 50+ new books</li>
        </ul>
      </div>

      {/* Quick Action Card
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl shadow-md text-white flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Manage Assigned Classes</h2>
          <p className="text-sm mt-1 opacity-90">Assign or update your school’s active classes.</p>
        </div>
        <Link to="/school-admin/manage-classes">
          <button className="bg-white text-purple-700 font-medium px-4 py-2 rounded-md shadow hover:bg-gray-100 flex items-center gap-2">
            Go Now <FiArrowRightCircle />
          </button>
        </Link>
      </div> */}
    </div>
  );
};

export default DashboardHome;

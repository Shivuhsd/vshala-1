import React from "react";
import {
  FiUsers,
  FiBook,
  FiCalendar,
  FiSettings,
  FiShield,
} from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";

const stats = [
  {
    label: "Total Schools",
    value: 12,
    icon: FiUsers,
    color: "bg-purple-100 text-purple-700",
  },
  {
    label: "Active Sessions",
    value: 4,
    icon: FiCalendar,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Total Classes",
    value: 24,
    icon: FiBook,
    color: "bg-green-100 text-green-700",
  },
  {
    label: "Permissions Set",
    value: 8,
    icon: FiShield,
    color: "bg-yellow-100 text-yellow-700",
  },
  // {
  //   label: "Settings Configured",
  //   value: 5,
  //   icon: FiSettings,
  //   color: "bg-red-100 text-red-700",
  // },
];

const DashboardHome = () => {
  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-xl p-6 shadow-md">
        <h1 className="text-3xl font-bold">Welcome, Super Admin</h1>
        <p className="text-sm mt-1 opacity-80">
          You can manage schools, sessions, classes, permissions, and settings
          from this dashboard.
        </p>
        <p className="text-xs opacity-60 mt-2">
          Last login: 16 May 2025 • IP: 192.168.0.101
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${color}`}
              >
                <Icon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;

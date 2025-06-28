// src/pages/school_Admin/admin/AdminDashboard.jsx
import React from "react";
import {
  FiUserPlus,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const stats = [
  {
    label: "Total Admins",
    value: 5,
    icon: <FiUserPlus />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    label: "Total Roles",
    value: 3,
    icon: <FiShield />,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    label: "Total Staff",
    value: 38,
    icon: <FiUsers />,
    color: "bg-green-100 text-green-700",
  },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-xl p-6 shadow-md">
        <h1 className="text-3xl font-bold">Welcome, Admin</h1>
        <p className="text-sm mt-1 opacity-80">
          You can manage staff, roles, and admin users here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                {Icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

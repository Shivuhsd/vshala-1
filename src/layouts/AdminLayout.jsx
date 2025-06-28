import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiSettings,
  FiShield,
  FiCalendar,
  FiMenu,
  FiBell,
  FiLogOut,
  FiSearch,
} from "react-icons/fi";
import {
  FaUserShield,
  FaUniversity,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { FiGrid } from "react-icons/fi";

const menuItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: <FiHome /> },
  { path: "/admin/schools", label: "Schools", icon: <FaUniversity /> },
  { path: "/admin/features", label: "Features", icon: <FiGrid /> },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const currentPage =
    menuItems.find((item) => location.pathname.includes(item.path))?.label ||
    "Dashboard";

  const handleLogout = () => {
    // Clear stored tokens or session data
    localStorage.removeItem("admin_token"); // adjust if you store token under a different key
    localStorage.removeItem("admin_user"); // optional: clear user info
    navigate("/login"); // Redirect to admin login page
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-white shadow-md border-r border-gray-200 sticky top-0 h-screen flex flex-col transition-all duration-300 z-20`}
      >
        <div className="p-4 border-b border-purple-100 flex justify-between items-center">
          {!collapsed && (
            <h1 className="text-xl font-bold text-purple-700">Vshala Admin</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600"
          >
            <FiMenu />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                  isActive
                    ? "bg-purple-100 text-purple-700 font-semibold border-l-4 border-purple-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gradient-to-b from-slate-900 to-purple-700 px-4 py-3 shadow text-white gap-3 sm:gap-0">
          <div className="text-lg font-semibold">{currentPage}</div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-3 text-white/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 border border-white/30 bg-white/10 rounded-lg text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            {/* Notifications */}
            <button className="text-white/70 hover:text-white hidden sm:block">
              <FiBell />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-semibold">
                A
              </div>
              <span className="text-sm font-medium hidden sm:block">Admin</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-red-300 hidden sm:block"
              title="Logout"
            >
              <FiLogOut />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

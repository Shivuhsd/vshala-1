// NOTE: Save this as SchoolAdminLayout.jsx

import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiSearch,
  FiLogOut,
  FiHome,
  FiSettings,
  FiUsers,
  FiBook,
  FiFileText,
  FiUserPlus,
  FiGrid,
  FiClock,
  FiCalendar,
  FiClipboard,
  FiFolderPlus,
  FiBell,
  FiEdit,
  FiVideo,
  FiAward,
  FiChevronRight,
  FiChevronDown,
  FiShield,
  FiTruck,
  FiBox,
  FiPackage,
  FiShare2,
} from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useSchool } from "../pages/school_Admin/context/SchoolContext";
import loginLogo from "../assets/login_image.png";

const sidebarItems = [
  {
    section: "School Management",
    icon: <FiHome />,
    links: [
      { path: "/school-admin/dashboard", label: "Dashboard", icon: <FiGrid /> },
      {
        path: "/school-admin/sessions",
        label: "Sessions",
        icon: <FiCalendar />,
      },
      {
        path: "/school-admin/manage-classes",
        label: "Manage Classes",
        icon: <FiBook />,
      },
      {
        path: "/school-admin/department",
        label: "Department",
        icon: <FiGrid />,
      },
    ],
  },
  {
    section: "Academic Management",
    icon: <FiBook />,
    links: [
      {
        path: "/school-admin/class-sections",
        label: "Class Sections",
        icon: <FaChalkboardTeacher />,
      },
      { path: "/school-admin/subjects", label: "Subjects", icon: <FiBook /> },
      {
        path: "/school-admin/academic/timetable",
        label: "Timetable",
        icon: <FiClock />,
      },
      {
        path: "/school-admin/attendance",
        label: "Attendance",
        icon: <FiCalendar />,
      },
      // {
      //   path: "/school-admin/student-leaves",
      //   label: "Student Leaves",
      //   icon: <FiClipboard />,
      // },
      {
        path: "/school-admin/academic/notice-board",
        label: "Notice Board",
        icon: <FiClipboard />,
      },
    ],
  },
  {
    section: "Student Management",
    icon: <FiUserPlus />,
    links: [
      {
        path: "/school-admin/student/admission",
        label: "Admission",
        icon: <FiUserPlus />,
      },
      {
        path: "/school-admin/students",
        label: "Students List",
        icon: <FiUsers />,
      },
      {
        path: "/school-admin/student/certificates",
        label: "Certificates",
        icon: <FiAward />, // Replaced FiFileText with FiAward for better visual
      },
    ],
  },
  {
    section: "Staff & Admin",
    icon: <FiUsers />,
    links: [
      { path: "/school-admin/roles", label: "Roles", icon: <FiShield /> },
      {
        path: "/school-admin/staff-list",
        label: "Staff List",
        icon: <FiUsers />,
      },
    ],
  },
  {
    section: "Inventory Management",
    icon: <FiFolderPlus />,
    links: [
      {
        path: "/school-admin/inventory/dashboard",
        label: "Dashboard",
        icon: <FiGrid />, // Represents a summary grid
      },
      {
        path: "/school-admin/inventory/supplier",
        label: "Stock Supplier",
        icon: <FiTruck />, // Logistics
      },
      {
        path: "/school-admin/inventory/purchase-order",
        label: "Stock Purchase Order",
        icon: <FiFileText />, // Represents documents/orders
      },
      {
        path: "/school-admin/inventory/category",
        label: "Category",
        icon: <FiBox />, // Categorization
      },
      {
        path: "/school-admin/inventory/item",
        label: "Item",
        icon: <FiPackage />, // Items/products
      },
      {
        path: "/school-admin/inventory/assign-stock",
        label: "Assign Inventory",
        icon: <FiShare2 />,
      },
    ],
  },
  {
    section: "Library Management",
    icon: <FiBook />,
    links: [
      {
        path: "https://library.vshala.in/",
        label: "Open Library",
        icon: <FiBook />,
        external: true,
      },
    ],
  },
  {
    section: "Accounts",
    icon: <FiFileText />,
    links: [
      {
        path: "/school-admin/accounts/fees",
        label: "Fee Management",
        icon: <FiFileText />,
      },
      {
        path: "/school-admin/accounts/student-fee",
        label: "Student Fee",
        icon: <FiFileText />,
      },
      {
        path: "/school-admin/accounts/student-bill",
        label: "Student Bill",
        icon: <FiFileText />,
      },
    ],
  },
];

const SchoolAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState(() =>
    sidebarItems.map((_, idx) => idx === 0)
  );

  const {
    selectedSchool,
    selectedSession,
    setSelectedSession,
    sessionList,
    loading,
  } = useSchool();

  const currentPage =
    sidebarItems
      .flatMap((section) => section.links)
      .find((item) => location.pathname.includes(item.path))?.label ||
    "Dashboard";

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((open, idx) => (idx === index ? !open : open))
    );
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/school-login");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading school data...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-white shadow-md border-r border-[#8C50E2] sticky top-0 h-screen flex flex-col transition-all duration-300 z-20`}
      >
        <div className="p-4 border-b border-purple-100 flex justify-between items-center">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img
                src={loginLogo}
                alt="Logo"
                className="w-8 h-8 rounded-full border border-[#8C50E2]"
              />
              <h1 className="text-xl font-bold text-[#5906B2]">Vshala</h1>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600"
          >
            <FiMenu />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4 custom-scrollbar">
          {sidebarItems.map((group, idx) => {
            const isOpen = openSections[idx];
            return (
              <div key={idx}>
                <button
                  onClick={() => toggleSection(idx)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#F3E8FF] hover:text-[#5906B2] ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{group.icon}</span>
                    {!collapsed && (
                      <span className="font-semibold">{group.section}</span>
                    )}
                  </span>
                  {!collapsed &&
                    (isOpen ? <FiChevronDown /> : <FiChevronRight />)}
                </button>

                {!collapsed && isOpen && (
                  <div className="space-y-1 mt-1 ml-4">
                    {group.links.map((item) =>
                      item.external ? (
                        <a
                          key={item.path}
                          href={item.path}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-[#F3E8FF] hover:text-[#5906B2]"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </a>
                      ) : (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                              isActive
                                ? "bg-[#F3E8FF] text-[#5906B2] font-semibold border-l-4 border-[#8C50E2]"
                                : "text-gray-700 hover:bg-[#F3E8FF] hover:text-[#5906B2]"
                            }`
                          }
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span>{item.label}</span>
                        </NavLink>
                      )
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gradient-to-b from-[#5906B2] to-[#8C50E2] px-4 py-3 shadow text-white gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <div className="text-xl font-semibold">{currentPage}</div>
            {selectedSchool && (
              <div className="text-2xl font-bold">{selectedSchool.label}</div>
            )}
            {selectedSession && sessionList?.length > 0 && (
              <select
                value={selectedSession.id}
                onChange={(e) => {
                  const newSession = sessionList.find(
                    (s) => s.id === e.target.value
                  );
                  if (newSession) {
                    setSelectedSession(newSession);
                    navigate(0);
                  }
                }}
                className="bg-white/20 text-white text-sm rounded px-3 py-1 outline-none border border-white/30 hover:bg-white/30"
              >
                {sessionList.map((session) => (
                  <option
                    key={session.id}
                    value={session.id}
                    className="text-black"
                  >
                    {session.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-40 sm:w-64">
              <FiSearch className="absolute left-3 top-3 text-white/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 border border-white/30 bg-white/10 rounded-lg text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#8C50E2]"
              />
            </div>
            <button className="text-white/70 hover:text-white hidden sm:block">
              <FiBell />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#8C50E2] text-white rounded-full flex items-center justify-center font-semibold">
                A
              </div>
              <span className="text-sm font-medium hidden sm:block">
                School Admin
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-red-400 hidden sm:block"
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

export default SchoolAdminLayout;

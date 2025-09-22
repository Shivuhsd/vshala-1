// import React, { useState } from "react";
// import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
// import {
//   FiMenu,
//   FiSearch,
//   FiLogOut,
//   FiHome,
//   FiSettings,
//   FiUsers,
//   FiBook,
//   FiFileText,
//   FiUserPlus,
//   FiGrid,
//   FiClock,
//   FiCalendar,
//   FiClipboard,
//   FiFolderPlus,
//   FiBell,
//   FiEdit,
//   FiVideo,
//   FiAward,
//   FiChevronRight,
//   FiChevronDown,
//   FiShield,
//   FiTruck,
//   FiBox,
//   FiPackage,
//   FiShare2,
// } from "react-icons/fi";
// import { FaChalkboardTeacher } from "react-icons/fa";
// import { useSchool } from "../pages/school_Admin/context/SchoolContext";
// import loginLogo from "../assets/login_image.png";

// const sidebarItems = [
//   {
//     section: "College Management",
//     icon: <FiHome />,
//     links: [
//       { path: "/school-admin/dashboard", label: "Dashboard", icon: <FiGrid /> },
//       {
//         path: "/school-admin/sessions",
//         label: "Sessions",
//         icon: <FiCalendar />,
//       },
//       {
//         path: "/school-admin/manage-classes",
//         label: "Manage Classes",
//         icon: <FiBook />,
//       },
//       {
//         path: "/school-admin/department",
//         label: "Department",
//         icon: <FiGrid />,
//       },
//     ],
//   },
//   {
//     section: "Academic Management",
//     icon: <FiBook />,
//     links: [
//       {
//         path: "/school-admin/class-sections",
//         label: "Class Sections",
//         icon: <FaChalkboardTeacher />,
//       },
//       { path: "/school-admin/subjects", label: "Subjects", icon: <FiBook /> },
//       {
//         path: "/school-admin/academic/timetable",
//         label: "Timetable",
//         icon: <FiClock />,
//       },
//       {
//         path: "/school-admin/attendance",
//         label: "Attendance",
//         icon: <FiCalendar />,
//       },
//       {
//         path: "/school-admin/academic/notice-board",
//         label: "Notice Board",
//         icon: <FiClipboard />,
//       },
//     ],
//   },
//   {
//     section: "Student Management",
//     icon: <FiUserPlus />,
//     links: [
//       {
//         path: "/school-admin/student/admission",
//         label: "Admission",
//         icon: <FiUserPlus />,
//       },
//       {
//         path: "/school-admin/students",
//         label: "Students List",
//         icon: <FiUsers />,
//       },
//       {
//         path: "/school-admin/student/certificates",
//         label: "Certificates",
//         icon: <FiAward />,
//       },
//     ],
//   },
//   {
//     section: "Staff & Admin",
//     icon: <FiUsers />,
//     links: [
//       { path: "/school-admin/roles", label: "Roles", icon: <FiShield /> },
//       {
//         path: "/school-admin/staff-list",
//         label: "Staff List",
//         icon: <FiUsers />,
//       },
//     ],
//   },
//   {
//     section: "Inventory Management",
//     icon: <FiFolderPlus />,
//     links: [
//       {
//         path: "/school-admin/inventory/dashboard",
//         label: "Dashboard",
//         icon: <FiGrid />,
//       },
//       {
//         path: "/school-admin/inventory/supplier",
//         label: "Stock Supplier",
//         icon: <FiTruck />,
//       },
//       {
//         path: "/school-admin/inventory/purchase-order",
//         label: "Stock Purchase Order",
//         icon: <FiFileText />,
//       },
//       {
//         path: "/school-admin/inventory/category",
//         label: "Category",
//         icon: <FiBox />,
//       },
//       {
//         path: "/school-admin/inventory/item",
//         label: "Item",
//         icon: <FiPackage />,
//       },
//       {
//         path: "/school-admin/inventory/assign-stock",
//         label: "Assign Inventory",
//         icon: <FiShare2 />,
//       },
//     ],
//   },
//   {
//     section: "Library Management",
//     icon: <FiBook />,
//     links: [
//       {
//         path: "https://anjumanlibrary.vshala.in/",
//         label: "Open Library",
//         icon: <FiBook />,
//         external: true,
//       },
//     ],
//   },
//   {
//     section: "Accounts",
//     icon: <FiFileText />,
//     links: [
//       {
//         path: "/school-admin/accounts/fees",
//         label: "Fee Management",
//         icon: <FiFileText />,
//       },
//       {
//         path: "/school-admin/accounts/student-fee",
//         label: "Student Fee",
//         icon: <FiFileText />,
//       },
//       // {
//       //   path: "/school-admin/accounts/student-bill",
//       //   label: "Student Bill",
//       //   icon: <FiFileText />,
//       // },
//     ],
//   },
// ];

// const SchoolAdminLayout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [collapsed, setCollapsed] = useState(false);
//   const [search, setSearch] = useState("");
//   const [openSections, setOpenSections] = useState(() =>
//     sidebarItems.map((_, idx) => idx === 0)
//   );

//   const {
//     selectedSchool,
//     selectedSession,
//     setSelectedSession,
//     sessionList,
//     loading,
//   } = useSchool();

//   const currentPage =
//     sidebarItems
//       .flatMap((section) => section.links)
//       .find((item) => location.pathname.includes(item.path))?.label ||
//     "Dashboard";

//   const toggleSection = (index) => {
//     setOpenSections((prev) =>
//       prev.map((open, idx) => (idx === index ? !open : open))
//     );
//   };

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       localStorage.clear();
//       navigate("/");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         Loading school data...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
//       {/* Sidebar */}
//       <aside
//         className={`${
//           collapsed ? "w-20" : "w-full md:w-64"
//         } bg-white shadow-md border-r border-[#8C50E2] sticky top-0 md:h-screen flex flex-col transition-all duration-300 z-30`}
//       >
//         <div className="p-4 border-b border-purple-100 flex justify-between items-center">
//           {!collapsed && (
//             <div className="flex items-center gap-2">
//               <img
//                 src={loginLogo}
//                 alt="Logo"
//                 className="w-8 h-8 rounded-full border border-[#8C50E2]"
//               />
//               <h1 className="text-lg md:text-xl font-bold text-[#5906B2] whitespace-nowrap">
//                 Anjuman College
//               </h1>
//             </div>
//           )}
//           <button
//             onClick={() => setCollapsed(!collapsed)}
//             className="text-gray-600"
//           >
//             <FiMenu />
//           </button>
//         </div>

//         <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4 custom-scrollbar">
//           {sidebarItems.map((group, idx) => {
//             const isOpen = openSections[idx];
//             return (
//               <div key={idx}>
//                 <button
//                   onClick={() => toggleSection(idx)}
//                   className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#F3E8FF] hover:text-[#5906B2] ${
//                     collapsed ? "justify-center" : ""
//                   }`}
//                 >
//                   <span className="flex items-center gap-2">
//                     <span className="text-lg">{group.icon}</span>
//                     {!collapsed && (
//                       <span className="font-semibold">{group.section}</span>
//                     )}
//                   </span>
//                   {!collapsed &&
//                     (isOpen ? <FiChevronDown /> : <FiChevronRight />)}
//                 </button>

//                 {!collapsed && isOpen && (
//                   <div className="space-y-1 mt-1 ml-4">
//                     {group.links.map((item) =>
//                       item.external ? (
//                         <a
//                           key={item.path}
//                           href={item.path}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-[#F3E8FF] hover:text-[#5906B2]"
//                         >
//                           <span className="text-lg">{item.icon}</span>
//                           <span>{item.label}</span>
//                         </a>
//                       ) : (
//                         <NavLink
//                           key={item.path}
//                           to={item.path}
//                           className={({ isActive }) =>
//                             `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
//                               isActive
//                                 ? "bg-[#F3E8FF] text-[#5906B2] font-semibold border-l-4 border-[#8C50E2]"
//                                 : "text-gray-700 hover:bg-[#F3E8FF] hover:text-[#5906B2]"
//                             }`
//                           }
//                         >
//                           <span className="text-lg">{item.icon}</span>
//                           <span>{item.label}</span>
//                         </NavLink>
//                       )
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>
//       </aside>

//       {/* Main Area */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Topbar */}
//         <header className="bg-gradient-to-b from-[#5906B2] to-[#8C50E2] px-4 py-4 shadow text-white flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
//             <div className="text-lg md:text-xl font-semibold">
//               {currentPage}
//             </div>
//             {selectedSchool && (
//               <div className="text-xl font-bold truncate">
//                 {selectedSchool.label}
//               </div>
//             )}
//             {selectedSession && sessionList?.length > 0 && (
//               <select
//                 value={selectedSession.id}
//                 onChange={(e) => {
//                   const newSession = sessionList.find(
//                     (s) => s.id === e.target.value
//                   );
//                   if (newSession) {
//                     setSelectedSession(newSession);
//                     navigate(0);
//                   }
//                 }}
//                 className="bg-white/20 text-white text-sm rounded px-3 py-1 outline-none border border-white/30 hover:bg-white/30"
//               >
//                 {sessionList.map((session) => (
//                   <option
//                     key={session.id}
//                     value={session.id}
//                     className="text-black"
//                   >
//                     {session.label}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>

//           <div className="flex items-center gap-4 w-full sm:w-auto">
//             <div className="relative w-full sm:w-64">
//               <FiSearch className="absolute left-3 top-3 text-white/70" />
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search..."
//                 className="w-full pl-10 pr-3 py-2 border border-white/30 bg-white/10 rounded-lg text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#8C50E2]"
//               />
//             </div>
//             <button className="text-white/70 hover:text-white hidden sm:block">
//               <FiBell />
//             </button>
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-[#8C50E2] text-white rounded-full flex items-center justify-center font-semibold">
//                 A
//               </div>
//               <span className="text-sm font-medium hidden sm:block">
//                 School Admin
//               </span>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="text-white/70 hover:text-red-400 hidden sm:block"
//               title="Logout"
//             >
//               <FiLogOut />
//             </button>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="p-4 md:p-6 flex-1 overflow-x-auto flex flex-col">
//           <div className="flex-1">
//             <Outlet />
//           </div>

//           <footer className="mt-6 bg-gradient-to-tr from-[#2D026C] to-[#5906B2] text-white text-sm text-center py-4 rounded-md shadow-xl backdrop-blur-md animate-fade-up">
//   © {new Date().getFullYear()} Anjuman College. All rights reserved. |
//   <span className="ml-1 font-semibold text-white hover:text-[#D1B3FF] transition duration-300 ease-in-out">
//     Powered by <span className="italic tracking-wide">VTech Coders Dharwad</span>
//   </span>
// </footer>

//         </main>
//       </div>
//     </div>
//   );
// };

// export default SchoolAdminLayout;
// SchoolAdminLayout.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  FiKey,
} from "react-icons/fi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useSchool } from "../pages/school_Admin/context/SchoolContext";
import loginLogo from "../assets/login_image.png";

/** -------------------------------------------
 * Sidebar structure (unchanged, just tidy)
 * ------------------------------------------*/
const sidebarItems = [
  {
    section: "College Management",
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
        icon: <FiAward />,
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
      {
        path: "/school-admin/permissions",
        label: "Permissions",
        icon: <FiKey />,
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
        icon: <FiGrid />,
      },
      {
        path: "/school-admin/inventory/supplier",
        label: "Stock Supplier",
        icon: <FiTruck />,
      },
      {
        path: "/school-admin/inventory/purchase-order",
        label: "Stock Purchase Order",
        icon: <FiFileText />,
      },
      {
        path: "/school-admin/inventory/category",
        label: "Category",
        icon: <FiBox />,
      },
      {
        path: "/school-admin/inventory/item",
        label: "Item",
        icon: <FiPackage />,
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
        path: "https://anjumanlibrary.vshala.in/",
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
      // { path: "/school-admin/accounts/student-bill", label: "Student Bill", icon: <FiFileText /> },
    ],
  },
];

/** Helpers */
const LS_KEY_COLLAPSED = "vshala_sidebar_collapsed";
const LS_KEY_OPEN_SECTIONS = "vshala_sidebar_open_sections";

/** Render a single side link (internal or external) */
const SideLink = React.memo(function SideLink({ item, collapsed }) {
  if (item.external) {
    return (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-[#F3E8FF] hover:text-[#5906B2]"
        title={collapsed ? item.label : undefined}
      >
        <span className="text-lg">{item.icon}</span>
        {!collapsed && <span>{item.label}</span>}
      </a>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
          isActive
            ? "bg-[#F3E8FF] text-[#5906B2] font-semibold border-l-4 border-[#8C50E2]"
            : "text-gray-700 hover:bg-[#F3E8FF] hover:text-[#5906B2]"
        }`
      }
      title={collapsed ? item.label : undefined}
      end
    >
      <span className="text-lg">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
});

const SchoolAdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /** State */
  const [collapsed, setCollapsed] = useState(() => {
    const v = localStorage.getItem(LS_KEY_COLLAPSED);
    return v ? JSON.parse(v) : false;
  });

  const [search, setSearch] = useState("");
  const [openSections, setOpenSections] = useState(() => {
    const saved = localStorage.getItem(LS_KEY_OPEN_SECTIONS);
    if (saved) return JSON.parse(saved);
    // default: open the first section
    return sidebarItems.map((_, idx) => idx === 0);
  });

  /** School Context */
  const {
    selectedSchool,
    selectedSession,
    setSelectedSession,
    sessionList,
    loading,
  } = useSchool();

  /** Build a flat map of path->label for reliable current page detection */
  const pathToLabel = useMemo(() => {
    const map = new Map();
    sidebarItems.forEach((grp) =>
      grp.links.forEach((lnk) => {
        if (!lnk.external) map.set(lnk.path, lnk.label);
      })
    );
    return map;
  }, []);

  /** Get the best matching label for the current location */
  const currentPage = useMemo(() => {
    // Try exact match
    if (pathToLabel.has(location.pathname)) {
      return pathToLabel.get(location.pathname);
    }
    // Try startsWith match by longest path
    const best = Array.from(pathToLabel.keys())
      .filter((p) => location.pathname.startsWith(p))
      .sort((a, b) => b.length - a.length)[0];
    return best ? pathToLabel.get(best) : "Dashboard";
  }, [location.pathname, pathToLabel]);

  /** Persist UI prefs */
  useEffect(() => {
    localStorage.setItem(LS_KEY_COLLAPSED, JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    localStorage.setItem(LS_KEY_OPEN_SECTIONS, JSON.stringify(openSections));
  }, [openSections]);

  /** Auto-open section containing the active route */
  useEffect(() => {
    const idxWithActive = sidebarItems.findIndex((grp) =>
      grp.links.some(
        (lnk) => !lnk.external && location.pathname.startsWith(lnk.path)
      )
    );
    if (idxWithActive >= 0 && !openSections[idxWithActive]) {
      setOpenSections((prev) =>
        prev.map((v, i) => (i === idxWithActive ? true : v))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  /** Toggle section open/close */
  const toggleSection = useCallback((index) => {
    setOpenSections((prev) =>
      prev.map((open, idx) => (idx === index ? !open : open))
    );
  }, []);

  /** Logout */
  const handleLogout = useCallback(() => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  /** Filtered groups by topbar search (labels only) */
  const filteredSidebarItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sidebarItems;
    return sidebarItems
      .map((grp) => ({
        ...grp,
        links: grp.links.filter((l) => l.label.toLowerCase().includes(q)),
      }))
      .filter((grp) => grp.links.length > 0);
  }, [search]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading school data...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-full md:w-64"
        } bg-white shadow-md border-r border-[#8C50E2]/30 sticky top-0 md:h-screen flex flex-col transition-all duration-300 z-30`}
        aria-label="Sidebar Navigation"
      >
        {/* Brand */}
        <div className="p-4 border-b border-purple-100 flex justify-between items-center">
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={loginLogo}
                alt="Logo"
                className="w-8 h-8 rounded-full border border-[#8C50E2]"
              />
              <h1 className="text-lg md:text-xl font-bold text-[#5906B2] truncate">
                Vshala
              </h1>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="text-gray-600 hover:text-[#5906B2]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <FiMenu />
          </button>
        </div>

        {/* Nav */}
        <nav
          className="flex-1 overflow-y-auto px-2 py-4 space-y-4 custom-scrollbar"
          role="navigation"
        >
          {filteredSidebarItems.map((group, idx) => {
            const isOpen = openSections[idx] ?? false;
            const SectionIcon = () => (
              <span className="text-lg">{group.icon}</span>
            );

            return (
              <div key={`${group.section}-${idx}`}>
                <button
                  onClick={() => toggleSection(idx)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-[#F3E8FF] hover:text-[#5906B2] transition-colors ${
                    collapsed ? "justify-center" : ""
                  }`}
                  aria-expanded={isOpen}
                  aria-controls={`section-${idx}`}
                  title={collapsed ? group.section : undefined}
                >
                  <span className="flex items-center gap-2">
                    <SectionIcon />
                    {!collapsed && (
                      <span className="font-semibold">{group.section}</span>
                    )}
                  </span>
                  {!collapsed &&
                    (isOpen ? <FiChevronDown /> : <FiChevronRight />)}
                </button>

                {/* Links */}
                <div
                  id={`section-${idx}`}
                  className={`${
                    !collapsed && isOpen ? "block" : "hidden"
                  } space-y-1 mt-1 ${!collapsed ? "ml-4" : ""}`}
                >
                  {group.links.map((item) => (
                    <SideLink
                      key={item.path}
                      item={item}
                      collapsed={collapsed}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-gradient-to-b from-[#5906B2] to-[#8C50E2] px-4 py-4 shadow text-white flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 min-w-0">
            <div className="text-lg md:text-xl font-semibold truncate">
              {currentPage}
            </div>

            {selectedSchool && (
              <div
                className="text-xl font-bold truncate max-w-[40vw] sm:max-w-[28vw]"
                title={selectedSchool.label}
              >
                {selectedSchool.label}
              </div>
            )}

            {selectedSession &&
              Array.isArray(sessionList) &&
              sessionList.length > 0 && (
                <label className="inline-flex items-center gap-2">
                  <span className="text-sm opacity-80 hidden md:inline">
                    Session
                  </span>
                  <select
                    value={selectedSession?.id ?? ""}
                    onChange={(e) => {
                      const newSession = sessionList.find(
                        (s) => String(s.id) === e.target.value
                      );
                      if (newSession) {
                        setSelectedSession(newSession);
                        // Force reload to refetch context-bound pages
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
                </label>
              )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-3 text-white/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-10 pr-3 py-2 border border-white/30 bg-white/10 rounded-lg text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#D1B3FF]"
                aria-label="Search sidebar items"
              />
            </div>

            <button
              className="text-white/80 hover:text-white hidden sm:block"
              aria-label="Notifications"
            >
              <FiBell />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center font-semibold">
                A
              </div>
              <span className="text-sm font-medium hidden sm:block">
                School Admin
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-white/80 hover:text-red-300 hidden sm:block"
              title="Logout"
              aria-label="Logout"
            >
              <FiLogOut />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 flex-1 overflow-x-auto flex flex-col">
          <div className="flex-1 min-w-0">
            <Outlet />
          </div>

          {/* Branded Footer */}
          <footer className="mt-6 bg-gradient-to-tr from-[#2D026C] to-[#5906B2] text-white text-sm text-center py-4 rounded-md shadow-xl backdrop-blur-md animate-fade-up">
            {" "}
            © {new Date().getFullYear()} Anjuman College. All rights reserved. |{" "}
            <span className="ml-1 font-semibold text-white hover:text-[#D1B3FF] transition duration-300 ease-in-out">
              {" "}
              Powered by{" "}
              <span className="italic tracking-wide">
                VTech Coders Dharwad
              </span>{" "}
            </span>{" "}
          </footer>
        </main>
      </div>
    </div>
  );
};

export default SchoolAdminLayout;

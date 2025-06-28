import React from "react";
import { Link } from "react-router-dom";
import { FiGrid, FiBookOpen, FiCalendar, FiClipboard, FiFolderPlus, FiBell, FiUsers, FiEdit, FiVideo } from "react-icons/fi";

const modules = [
  {
    title: "Class Sections",
    icon: <FiGrid />,
    actions: [
      { label: "View Sections", to: "/school-admin/class-sections" },
    ],
  },
  {
    title: "Subjects",
    icon: <FiBookOpen />,
    actions: [
      { label: "View Subjects", to: "/school-admin/subjects" },
      { label: "Add Subject", to: "/school-admin/subjects/add" },
    ],
  },
  {
    title: "Attendance",
    icon: <FiCalendar />,
    actions: [
      { label: "View Attendance", to: "/school-admin/attendance" },
      { label: "Take Attendance", to: "/school-admin/attendance/take" },
    ],
  },
  {
    title: "Study Materials",
    icon: <FiFolderPlus />,
    actions: [
      { label: "Study Materials", to: "/school-admin/study-materials" },
      { label: "Add Material", to: "/school-admin/study-materials/add" },
    ],
  },
  {
    title: "Home Work",
    icon: <FiClipboard />,
    actions: [
      { label: "Homework", to: "/school-admin/homework" },
      { label: "Assign Homework", to: "/school-admin/homework/assign" },
    ],
  },
  {
    title: "Noticeboard",
    icon: <FiBell />,
    actions: [
      { label: "Noticeboard", to: "/school-admin/noticeboard" },
      { label: "Add Notice", to: "/school-admin/noticeboard/add" },
    ],
  },
  {
    title: "Events",
    icon: <FiEdit />,
    actions: [
      { label: "View Events", to: "/school-admin/events" },
      { label: "Add Event", to: "/school-admin/events/add" },
    ],
  },
  {
    title: "Live Classes",
    icon: <FiVideo />,
    actions: [
      { label: "Live Class", to: "/school-admin/live-classes" },
    ],
  },
];

const AcademicDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#6B21A8]">Academic Overview</h1>
        <p className="text-gray-600 mt-1 text-sm">Quick access to academic tools & modules</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((mod, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition group border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 text-purple-700 rounded-full p-2 text-xl">
                {mod.icon}
              </div>
              <h2 className="text-lg font-semibold text-[#334155]">{mod.title}</h2>
            </div>
            <div className="space-y-2">
              {mod.actions.map((action, i) => (
                <Link
                  key={i}
                  to={action.to}
                  className="block bg-[#6B21A8] hover:bg-[#9333EA] text-white text-sm text-center py-2 rounded-md font-medium"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicDashboard;

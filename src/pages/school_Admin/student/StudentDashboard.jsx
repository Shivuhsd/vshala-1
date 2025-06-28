import React from "react";
import { Link } from "react-router-dom";
import {
  FiUserPlus,
  FiUsers,
  FiFileText,
  FiRepeat,
  FiArrowUpCircle,
} from "react-icons/fi";
import { FiCreditCard } from "react-icons/fi";


const studentModules = [
  {
    title: "Admission",
    icon: <FiUserPlus />,
    actions: [
      { label: "Add New Admission", to: "/school-admin/students/admissions/add" },
      { label: "Bulk Admission", to: "/school-admin/students/admissions/bulk" },
    ],
  },
  {
    title: "Students",
    icon: <FiUsers />,
    actions: [{ label: "View Students", to: "/school-admin/students/list" }],
  },
  {
    title: "ID Cards",
    icon: < FiCreditCard />,
    actions: [{ label: "Print ID Cards", to: "/school-admin/students/id-cards" }],
  },
  {
    title: "Student Promotion",
    icon: <FiArrowUpCircle />,
    actions: [{ label: "Promote Students", to: "/school-admin/students/promotions" }],
  },
  {
    title: "Transfer Student",
    icon: <FiRepeat />,
    actions: [
      { label: "View Students Transferred", to: "/school-admin/students/transfers" },
      { label: "Transfer Student", to: "/school-admin/students/transfers/initiate" },
    ],
  },
  {
    title: "Certificates",
    icon: <FiFileText />,
    actions: [
      { label: "View Certificates", to: "/school-admin/students/certificates" },
      { label: "Add New Certificate", to: "/school-admin/students/certificates/issue" },
    ],
  },
];

const StudentDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#6B21A8]">Student Dashboard</h1>
        <p className="text-sm text-gray-600">Quick links to student-related features</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {studentModules.map((mod, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow border border-[#E2E8F0] p-5 hover:shadow-md transition"
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
                  className="block w-full text-center bg-[#6B21A8] hover:bg-[#9333EA] text-white text-sm py-2 rounded-md font-medium"
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

export default StudentDashboard;

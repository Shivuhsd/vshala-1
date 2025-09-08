import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom"; // 👈 make sure this is imported

// 🔐 Super Admin
import Login from "./pages/Admin/auth/login.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import DashboardHome from "./pages/Admin/dashboard/DashboardHome.jsx";
import Schools from "./pages/Admin/dashboard/Schools.jsx";
import Features from "./pages/Admin/dashboard/Features.jsx";
import Settings from "./pages/Admin/dashboard/Settings.jsx";
import AddAdminPage from "./pages/Admin/dashboard/AddAdminForm.jsx";

// 🏫 School Admin
import SchoolLogin from "./pages/school_Admin/auth/SchoolLogin.jsx";
import SelectSchoolSession from "./pages/school_Admin/auth/SelectSchoolSession.jsx";
import SchoolAdminLayout from "./layouts/SchoolAdminLayout.jsx";
import SchoolDashboardHome from "./pages/school_Admin/dashboard/DashboardHome.jsx";
import Sessions from "./pages/school_Admin/dashboard/Sessions.jsx";
import TimetableList from "./pages/school_Admin/academic/TimetableList.jsx";

// ✅ moved here

import ManageClasses from "./pages/school_Admin/manage/ManageClasses.jsx";
import AcademicDashboard from "./pages/school_Admin/academic/AcademicDashboard.jsx";
import ClassSections from "./pages/school_Admin/academic/ClassSections.jsx";
import Subjects from "./pages/school_Admin/academic/Subjects.jsx";
import GroupSubjects from "./pages/school_Admin/academic/GroupSubjects.jsx";

import StudentDashboard from "./pages/school_Admin/student/StudentDashboard.jsx";
import AddAdmissionForm from "./pages/school_Admin/student/AddAdmissionForm.jsx";
import StudentList from "./pages/school_Admin/student/StudentList";

import AdminDashboard from "./pages/school_Admin/admin/AdminDashboard.jsx";
import Roles from "./pages/school_Admin/admin/Roles.jsx";
import AddRole from "./pages/school_Admin/admin/AddRole.jsx";
import EditRole from "./pages/school_Admin/admin/EditRole.jsx";
import StaffList from "./pages/school_Admin/admin/StaffList";
import AddStaffForm from "./pages/school_Admin/admin/AddStaffForm";
import EditStaffForm from "./pages/school_Admin/admin/EditStaffForm";
import BulkAdmission from "./pages/school_Admin/student/BulkAdmission.jsx";
import Permissions from "./pages/school_Admin/admin/Permissions.jsx";

import Inquiries from "./pages/school_Admin/school/Inquiries.jsx";
import School_Settings from "./pages/school_Admin/school/Settings.jsx";
import Logs from "./pages/school_Admin/school/Logs.jsx";
import CategoryList from "./pages/school_Admin/inventory/Category/CategoryList.jsx";
import ItemList from "./pages/school_Admin/inventory/item/ItemList.jsx";
import DepartmentList from "./pages/school_Admin/inventory/Department/DepartmentList.jsx";
import SupplierList from "./pages/school_Admin/inventory/Supplier/SupplierList.jsx";
import StockPurchaseOrder from "./pages/school_Admin/inventory/Supplier/StockPurchaseOrder.jsx";
import InventoryDashboard from "./pages/school_Admin/inventory/InventoryDashboard.jsx";
import AssignInventory from "./pages/school_Admin/inventory/item/AssignInventory.jsx";
import ViewAttendance from "./pages/school_Admin/academic/ViewAttendance";
import TakeAttendance from "./pages/school_Admin/academic/TakeAttendance";
import ManageAttendance from "./pages/school_Admin/academic/ManageAttendance";
import CertificateDesigner from "./pages/school_Admin/student/certificate/CertificateDesigner.jsx";
import CertificateTemplates from "./pages/school_Admin/student/certificate/CertificateTemplates.jsx";
import NoticeBoard from "./pages/school_Admin/academic/NoticeBoard.jsx";
import FeeManagement from "./pages/school_Admin/accounts/FeeManagement.jsx";
import StudentFee from "./pages/school_Admin/accounts/studentFee.jsx";
import StudentBill from "./pages/school_Admin/accounts/StudentBill.jsx";
import LandingPage from "./pages/website/LandingPage.jsx";
import PucHome from "./pages/website/PucHome.jsx";
import DegreeHome from "./pages/website/DegreeHome.jsx";

// 🌐 Context
import { SchoolProvider } from "./pages/school_Admin/context/SchoolContext.jsx";

const App = () => {
  return (
    <SchoolProvider>
      <Router>
        <Routes>
          {/* 🔐 Super Admin Routes */}
          {/* <Route path="/" element={<Navigate to="/school-login" replace />} /> */}

          {/* <Route path="/" element={<LandingPage />} />
          <Route path="/puc" element={<PucHome />} />
          <Route path="/degree" element={<DegreeHome />} />*/}

          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="schools" element={<Schools />} />
            <Route path="features" element={<Features />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="schools/:schoolId/add-admin"
              element={<AddAdminPage />}
            />
          </Route>
          {/* 🏫 School Admin Routes */}
          <Route path="/" element={<SchoolLogin />} />
          <Route
            path="/school-admin/select-school-session"
            element={<SelectSchoolSession />}
          />
          <Route path="/school-admin" element={<SchoolAdminLayout />}>
            {/* SM School */}
            <Route path="dashboard" element={<SchoolDashboardHome />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="settings" element={<School_Settings />} />
            <Route path="logs" element={<Logs />} />
            <Route path="sessions" element={<Sessions />} />{" "}
            <Route path="department" element={<DepartmentList />} />
            {/* ✅ Sessions now under SchoolAdmin */}
            {/* SM Academic */}
            <Route path="manage-classes" element={<ManageClasses />} />
            <Route path="academic/dashboard" element={<AcademicDashboard />} />
            <Route path="class-sections" element={<ClassSections />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="academic/subjects/group" element={<GroupSubjects />} />
            <Route path="academic/timetable" element={<TimetableList />} />
            <Route
              path="academic/take-attendance"
              element={<TakeAttendance />}
            />
            <Route
              path="academic/manage-attendance"
              element={<ManageAttendance />}
            />
            <Route path="academic/notice-board" element={<NoticeBoard />} />{" "}
            {/* ✅ New */}
            <Route path="attendance" element={<ViewAttendance />} />
            {/* SM Student */}
            <Route path="student/dashboard" element={<StudentDashboard />} />
            <Route path="student/admission" element={<AddAdmissionForm />} />
            <Route path="students" element={<StudentList />} />
            <Route
              path="student/certificates"
              element={<CertificateTemplates />}
            />
            <Route
              path="student/certificate/designer"
              element={<CertificateDesigner />}
            />
            <Route path="students/bulk-admission" element={<BulkAdmission />} />
            {/* SM Administrator */}
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="roles" element={<Roles />} />
            <Route path="roles/add" element={<AddRole />} />
            <Route path="roles/edit/:id" element={<EditRole />} />
            <Route path="staff-list" element={<StaffList />} />
            <Route path="staff/add" element={<AddStaffForm />} />
            <Route path="staff/edit/:id" element={<EditStaffForm />} />
            <Route path="permissions" element={<Permissions />} />
            {/* SM Inventory */}
            <Route path="inventory/supplier" element={<SupplierList />} />\
            <Route
              path="inventory/purchase-order"
              element={<StockPurchaseOrder />}
            />
            <Route path="inventory/category" element={<CategoryList />} />
            <Route path="inventory/item" element={<ItemList />} />\
            <Route
              path="inventory/dashboard"
              element={<InventoryDashboard />}
            />
            <Route
              path="inventory/assign-stock"
              element={<AssignInventory />}
            />
            <Route
              path="/school-admin/accounts/fees"
              element={<FeeManagement />}
            />
            <Route
              path="/school-admin/accounts/student-fee"
              element={<StudentFee />}
            />
            <Route
              path="/school-admin/accounts/student-bill"
              element={<StudentBill />}
            />
          </Route>
        </Routes>
      </Router>
    </SchoolProvider>
  );
};

export default App;

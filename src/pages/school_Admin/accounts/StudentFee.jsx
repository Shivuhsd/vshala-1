// school_Admin/pages/accounts/StudentFee.jsx

import React, { useState, useRef } from "react";
import {
  FiFilter,
  FiEye,
  FiPrinter,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import StudentBill from "./StudentBill";
import { useReactToPrint } from "react-to-print";

const dummyStudents = [
  {
    id: 1,
    name: "Kiran M",
    admission_no: "A1023",
    class: "10",
    section: "A",
    total_fee: 5000,
    total_paid: 3200,
    breakdown: [
      {
        id: 1,
        label: "Admission Fee",
        amount: 2000,
        paid: 2000,
        last_paid: "2025-06-12",
      },
      {
        id: 2,
        label: "Tuition Fee",
        amount: 3000,
        paid: 1200,
        last_paid: "2025-06-25",
      },
    ],
  },
  {
    id: 2,
    name: "Priya S",
    admission_no: "A1056",
    class: "10",
    section: "B",
    total_fee: 6000,
    total_paid: 6000,
    breakdown: [
      {
        id: 1,
        label: "Admission Fee",
        amount: 2000,
        paid: 2000,
        last_paid: "2025-06-15",
      },
      {
        id: 2,
        label: "Tuition Fee",
        amount: 4000,
        paid: 4000,
        last_paid: "2025-06-20",
      },
    ],
  },
];

const StudentFee = () => {
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    search: "",
  });
  const [expanded, setExpanded] = useState(null);
  const [billStudent, setBillStudent] = useState(null);
  const billRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => billRef.current,
  });

  const generateBill = (student) => {
    setBillStudent(student);
    setTimeout(() => handlePrint(), 300);
  };

  const filteredStudents = dummyStudents.filter((s) => {
    return (
      (filters.class === "" || s.class === filters.class) &&
      (filters.section === "" || s.section === filters.section) &&
      (filters.search === "" ||
        s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        s.admission_no.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-purple-800">
        Student Fee Management
      </h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Class</label>
          <select
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            className="border px-3 py-2 rounded w-40"
          >
            <option value="">All</option>
            <option value="10">10</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Section</label>
          <select
            value={filters.section}
            onChange={(e) =>
              setFilters({ ...filters, section: e.target.value })
            }
            className="border px-3 py-2 rounded w-40"
          >
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Name or Admission No"
            className="border px-3 py-2 rounded w-60"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Admission No</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Section</th>
              <th className="px-4 py-3">Total Fee</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <React.Fragment key={student.id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold">{student.name}</td>
                  <td className="px-4 py-2">{student.admission_no}</td>
                  <td className="px-4 py-2">{student.class}</td>
                  <td className="px-4 py-2">{student.section}</td>
                  <td className="px-4 py-2">₹{student.total_fee}</td>
                  <td className="px-4 py-2 text-green-700">
                    ₹{student.total_paid}
                  </td>
                  <td className="px-4 py-2 text-red-600">
                    ₹{student.total_fee - student.total_paid}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        setExpanded(expanded === student.id ? null : student.id)
                      }
                      className="text-purple-700 hover:underline flex items-center gap-1"
                    >
                      <FiEye />
                      View
                      {expanded === student.id ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </button>
                  </td>
                </tr>

                {expanded === student.id && (
                  <tr className="bg-gray-50 border-t">
                    <td colSpan="8" className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="text-lg font-semibold">
                            {student.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Admission No</p>
                          <p className="text-lg font-semibold">
                            {student.admission_no}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Fee</p>
                          <p className="text-lg font-semibold text-gray-800">
                            ₹{student.total_fee}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Paid</p>
                          <p className="text-lg font-semibold text-green-700">
                            ₹{student.total_paid}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Balance</p>
                          <p className="text-lg font-semibold text-red-600">
                            ₹{student.total_fee - student.total_paid}
                          </p>
                        </div>
                      </div>

                      <table className="w-full border text-sm mt-2 mb-4">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 border">Particular</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Paid</th>
                            <th className="p-2 border">Balance</th>
                            <th className="p-2 border">Last Paid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.breakdown.map((item) => (
                            <tr key={item.id}>
                              <td className="p-2 border">{item.label}</td>
                              <td className="p-2 border">₹{item.amount}</td>
                              <td className="p-2 border text-green-700">
                                ₹{item.paid}
                              </td>
                              <td className="p-2 border text-red-600">
                                ₹{item.amount - item.paid}
                              </td>
                              <td className="p-2 border">{item.last_paid}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <button
                        onClick={() => generateBill(student)}
                        className="bg-purple-600 text-white px-4 py-2 rounded shadow flex items-center gap-2"
                      >
                        <FiPrinter />
                        Generate Bill
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hidden Printable Section */}
      <div className="hidden print:block">
        {billStudent && <StudentBill ref={billRef} student={billStudent} />}
      </div>
    </div>
  );
};

export default StudentFee;

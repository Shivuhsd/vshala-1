import React, { useState, useEffect } from "react";
import { useSchool } from "../context/SchoolContext";
import {
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiPrinter,
  FiCreditCard,
} from "react-icons/fi";
import StudentBill from "./StudentBill";
import BillPreviewModal from "./BillPreviewModal";
import PaymentModal from "./PaymentModal";
import { toast } from "react-toastify";
import axiosInstance from "../../../services/axiosInstance";
import Bill_Modal from "./Bill_Modal";

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
  const [students, setStudents] = useState([]);
  const [billModalStudent, setBillModalStudent] = useState(null);


  const { selectedSchool, selectedSession } = useSchool();
  const [filters, setFilters] = useState({
    class: "",
    section: "",
    search: "",
  });
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedParticular, setSelectedParticular] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

    const schoolId = "123"; // Replace with actual school ID
  const sessionId = "456"; // Replace with actual session ID
  // Fetch classes on component mount
  useEffect(() => {
    axiosInstance
      .get(`/schools/v1/schools/classes/links/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`)
      .then((res) => {
        setClasses(res.data.results || []);
        console.log(res.data.results)
      })
      .catch((err) => {
        toast.error("Failed to fetch classes");
        console.error(err);
      });
  }, [schoolId, sessionId]);

  
  useEffect(() => {
    if (!filters.class) {
      setSections([]);
      return;
    }

    const selectedClass = classes.find((cls) => cls.id === filters.class);
    if (selectedClass && selectedClass.sections) {
      setSections(selectedClass.sections);
    } else {
      setSections([]);
    }
  }, [filters.class, classes]);

  useEffect(() => {
  const fetchStudents = async () => {
    if (filters.class && filters.section) {
      console.log(filters.class, filters.section)
      try {
        const res = await axiosInstance.get(
          `/schools/v1/students?class_id=${filters.class}&section_id=${filters.section}&school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
        );
        setStudents(res.data || []);
        console.log(res.data)
      } catch (err) {
        toast.error("Failed to fetch students");
        console.error(err);
      }
    } else {
      setStudents([]); // Clear students if filter is reset
    }
  };

  fetchStudents();
}, [filters.class, filters.section]);



  const handlePaymentSubmit = ({ amount, mode, label }) => {
    toast.success(`Paid ₹${amount} for ${label} via ${mode}`);
    // Ideally refresh data from backend here
  };

 const filteredStudents = students.filter((s) => {
  return (
    filters.search === "" ||
    s.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    s.admission_no.toLowerCase().includes(filters.search.toLowerCase())
  );
});

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-purple-800">
        Student Fee Management
      </h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 items-end border">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Class
          </label>
          <select
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            className="border px-3 py-2 rounded-md w-40 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">All</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Section
          </label>
          <select
  value={filters.section}
  onChange={(e) =>
    setFilters({ ...filters, section: e.target.value })
  }
  className="border px-3 py-2 rounded-md w-40 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
>
  <option value="">All</option>
  {sections.map((section) => (
    <option key={section.id} value={section.id}>
      {section.label}
    </option>
  ))}
</select>

        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Name or Admission No"
            className="border px-3 py-2 rounded-md w-60 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Admission No</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Section</th>
             
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <React.Fragment key={student.id}>
                <tr className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-2 font-semibold">{student.name}</td>
                  <td className="px-4 py-2">{student.admission_number}</td>
                  <td className="px-4 py-2">{student.class_link}</td>
                  <td className="px-4 py-2">{student.section}</td>
                  <td>
                    <button
  onClick={() => setBillModalStudent(student)}
  className="text-purple-700 hover:underline flex items-center gap-1"
>
  <FiEye />
  View Bill
</button>

                  </td>
                 
                </tr>

                {expanded === student.id && (
                  <tr className="bg-gray-50 border-t">
                    <td colSpan="8" className="px-6 py-4">
                      <table className="w-full border text-sm mb-4">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="p-2 border">Particular</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Paid</th>
                            <th className="p-2 border">Balance</th>
                            <th className="p-2 border">Last Paid</th>
                          </tr>
                        </thead>
                        {/* <tbody>
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
                        </tbody> */}
                      </table>

                      {/* Action Buttons Below Table */}
                      <div className="flex justify-end gap-3">
                        <button
                          disabled={student.total_paid >= student.total_fee}
                          onClick={() => {
                            const dueItem = student.breakdown.find(
                              (i) => i.amount > i.paid
                            );
                            if (dueItem) {
                              setSelectedParticular(dueItem);
                              setShowPaymentModal(true);
                            }
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium ${
                            student.total_paid >= student.total_fee
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-purple-700 text-white hover:bg-purple-800"
                          }`}
                        >
                          <FiCreditCard />
                          Pay Due
                        </button>
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-gray-100 border hover:bg-gray-200"
                        >
                          <FiPrinter />
                          Print Bill
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

            {billModalStudent && (
  <Bill_Modal
    student={billModalStudent}
    onClose={() => setBillModalStudent(null)}
  />
)}

      {/* Modals */}
      {selectedStudent && (
        <BillPreviewModal
          student={selectedStudent}
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {showPaymentModal && selectedParticular && (
        <PaymentModal
          particular={selectedParticular}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedParticular(null);
          }}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </div>
  );
};

export default StudentFee;

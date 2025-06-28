// school_Admin/pages/accounts/StudentBill.jsx

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FiPrinter } from "react-icons/fi";

const dummyBill = {
  billNo: "BILL-2025-001",
  studentName: "Kiran M",
  admissionNo: "A1023",
  class: "10",
  section: "A",
  date: "2025-06-28",
  particulars: [
    { id: 1, label: "Admission Fee", amount: 2000 },
    { id: 2, label: "Tuition Fee", amount: 3000 },
  ],
};

const StudentBill = () => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${dummyBill.studentName}_Bill_${dummyBill.billNo}`,
  });

  const totalAmount = dummyBill.particulars.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-800">Student Bill</h2>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded shadow text-sm"
        >
          <FiPrinter />
          Print
        </button>
      </div>

      {/* Bill Preview Section */}
      <div
        ref={componentRef}
        className="bg-white p-6 rounded-md shadow-md max-w-3xl mx-auto border border-gray-200"
      >
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-purple-700">Vshala School</h3>
          <p className="text-sm text-gray-500">Student Fee Bill</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <p>
            <span className="font-semibold">Bill No:</span> {dummyBill.billNo}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {dummyBill.date}
          </p>
          <p>
            <span className="font-semibold">Student Name:</span>{" "}
            {dummyBill.studentName}
          </p>
          <p>
            <span className="font-semibold">Admission No:</span>{" "}
            {dummyBill.admissionNo}
          </p>
          <p>
            <span className="font-semibold">Class:</span> {dummyBill.class}
          </p>
          <p>
            <span className="font-semibold">Section:</span> {dummyBill.section}
          </p>
        </div>

        <table className="w-full text-sm border-t border-b">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Particular</th>
              <th className="text-right px-4 py-2">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {dummyBill.particulars.map((item, idx) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{item.label}</td>
                <td className="px-4 py-2 text-right">₹{item.amount}</td>
              </tr>
            ))}
            <tr className="font-bold border-t">
              <td colSpan={2} className="px-4 py-2 text-right">
                Total
              </td>
              <td className="px-4 py-2 text-right text-green-700">
                ₹{totalAmount}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-right mt-6 text-xs text-gray-400">
          This is a system-generated bill. No signature required.
        </div>
      </div>
    </div>
  );
};

export default StudentBill;

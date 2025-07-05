import React from "react";
import { FiPrinter } from "react-icons/fi";

const StudentBill = ({ student, onClose }) => {
  if (!student) return null;

  const totalAmount = student.breakdown.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalPaid = student.breakdown.reduce((sum, item) => sum + item.paid, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-3xl print:w-full print:relative border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 print:hidden">
          <span className="text-sm font-bold text-purple-600">
            Student Bill
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition shadow-sm"
          >
            <FiPrinter />
            Print
          </button>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-800 border-b pb-3 mb-5">
          Fee Receipt
        </h2>

        {/* Student Info */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
          <p>
            <span className="font-semibold">Name:</span> {student?.name}
          </p>
          <p>
            <span className="font-semibold">Admission No:</span>{" "}
            {student?.admission_no}
          </p>
          <p>
            <span className="font-semibold">Class:</span> {student?.class}
          </p>
        </div>

        {/* Fee Table */}
        <div className="overflow-x-auto border rounded-lg mb-6">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border">Particular</th>
                <th className="px-4 py-2 text-left border">Amount</th>
                <th className="px-4 py-2 text-left border">Paid</th>
                <th className="px-4 py-2 text-left border">Balance</th>
              </tr>
            </thead>
            <tbody>
              {student.breakdown.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{item.label}</td>
                  <td className="px-4 py-2 border">₹{item.amount}</td>
                  <td className="px-4 py-2 border text-green-600">
                    ₹{item.paid}
                  </td>
                  <td
                    className={`px-4 py-2 border font-semibold ${
                      item.amount - item.paid > 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    ₹{item.amount - item.paid}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="text-right text-sm font-medium">
          Total Paid: ₹{totalPaid} / ₹{totalAmount}
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentBill;

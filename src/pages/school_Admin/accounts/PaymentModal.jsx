// school_Admin/pages/accounts/PaymentModal.jsx

import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const PaymentModal = ({ particular, onClose }) => {
  const [amount, setAmount] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FiX size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-purple-800">
          Pay for {particular.label}
        </h2>
        <div className="space-y-3">
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label className="block text-sm font-medium">Mode of Payment</label>
          <select className="w-full border rounded px-3 py-2">
            <option>Cash</option>
            <option>UPI</option>
            <option>Online</option>
            <option>Cheque</option>
          </select>

          <button
            onClick={() => {
              alert(`Paid ₹${amount}`);
              onClose();
            }}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded mt-4 w-full"
          >
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

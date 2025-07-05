import React, { useState } from "react";
import { FiX } from "react-icons/fi";

const PaymentModal = ({ particular, onClose, onSubmit }) => {
  const [amount, setAmount] = useState(
    particular.amount - particular.paid || ""
  );
  const [mode, setMode] = useState("Cash");

  const handlePayment = () => {
    if (!amount) return alert("Please enter amount");

    if (onSubmit) {
      onSubmit({
        amount: parseFloat(amount),
        mode,
        label: particular.label,
        id: particular.id,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mode of Payment</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option>Cash</option>
              <option>UPI</option>
              <option>Online</option>
              <option>Cheque</option>
            </select>
          </div>

          <button
            onClick={handlePayment}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded w-full mt-4"
          >
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";
import { useSchool } from "../context/SchoolContext";

import { jsPDF } from 'jspdf';
import { applyPlugin } from 'jspdf-autotable'
applyPlugin(jsPDF)




const Bill_Modal = ({ student, onClose }) => {
  const { selectedSchool, selectedSession } = useSchool();
  const [bills, setBills] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [modeofpayment, setMode] = useState("");
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/schools/v1/bills/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`)
      .then((res) => {
        setBills(res.data);
      })
      .catch((err) => {
        toast.error("Failed to fetch bill templates");
        console.error(err);
      });
  }, [student]);

const handleBillChange = async (e) => {
  const billId = e.target.value;
  const selected = bills.find((b) => b.id === billId);
  setSelectedBill(selected);
  setPaidAmount(0); // reset while loading new data

  if (!billId) return;

  try {
    const res = await axiosInstance.get(`/schools/v1/payments/${student.id}?bill_id=${billId}`);
    const transactions = res.data;

    // Sum up paid amounts
    const totalPaid = transactions.reduce(
      (sum, txn) => sum + parseFloat(txn.fees_paid || 0),
      0
    );

    setPaidAmount(totalPaid);
    setTransactions(res.data);

  } catch (err) {
    console.error("Failed to fetch transactions for this bill", err);
    toast.error("Could not fetch payment history for selected bill");
  }
};


  const total = selectedBill?.particulars?.reduce(
    (sum, p) => sum + parseFloat(p.price || 0),
    0
  ) || 0;

  const handleSubmit = async () => {
    if (!paymentAmount || !modeofpayment || (modeofpayment !== "cash" && !ref)) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/schools/v1/payments/", {
        student_id: student.id,
        bill_id: selectedBill.id,
        fees_paid: parseFloat(paymentAmount),
        modeofpayment,
        referencenumber: modeofpayment === "cash" ? "cash" : ref,
      });
      toast.success("Payment recorded!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save payment");
    } finally {
      setLoading(false);
    }
  };

const handlePrintPDF = (txn) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const halfWidth = pageWidth / 2;

  const schoolName = selectedSchool?.label || "Your School Name";
  const schoolAddress = selectedSchool?.address || "123 School Rd, Education City";

  const studentData = [
    ["Student Name", student.name],
    ["Class", student.class_link || "N/A"],
    ["Section", student.section || "N/A"],
    ["Bill Name", selectedBill?.name || "N/A"],
    ["Bill Template Number", selectedBill?.number || "N/A"],
    ["Type", selectedBill?.bill_type],
    ["Bill Number", txn.id],
    ["Date of Payment", new Date(txn.created_on).toLocaleDateString()],
    ["Mode of Payment", txn.modeofpayment],
    ["Reference No.", txn.referencenumber || "N/A"],
    ["Amount Paid", `${txn.fees_paid} India Rupees`]
  ];

  const leftStartX = 10;
  const rightStartX = halfWidth + 10;1
  const contentStartY = 10;
  const receiptWidth = halfWidth - 20;

  // STUDENT COPY
  generateSideReceipt(
    doc,
    studentData,
    schoolName,
    schoolAddress,
    "STUDENT COPY",
    leftStartX,
    contentStartY,
    receiptWidth
  );

  // SCHOOL COPY
  generateSideReceipt(
    doc,
    studentData,
    schoolName,
    schoolAddress,
    "SCHOOL COPY",
    rightStartX,
    contentStartY,
    receiptWidth
  );

  // Vertical cut line in the middle
  doc.setDrawColor(150);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0); // dashed line
  doc.line(halfWidth, 5, halfWidth, pageHeight - 5);

  doc.save(`Receipt_${student.name.replace(/\s+/g, "_")}_${txn.id}.pdf`);
};

const generateSideReceipt = (doc, data, schoolName, schoolAddress, copyType, startX, startY, width) => {
  const headerHeight = 18;

  // Header
  doc.setFillColor(10, 40, 90);
  doc.rect(startX, startY, width, headerHeight, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(schoolName, startX + width / 2, startY + 7, { align: "center" });

  doc.setFontSize(8);
  doc.text(schoolAddress, startX + width / 2, startY + 14, { align: "center" });

  let y = startY + headerHeight + 4;

  // Receipt title and copy type
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("FEE PAYMENT RECEIPT", startX + width / 2, y, { align: "center" });

  doc.setFontSize(9);
  doc.text(copyType, startX + 2, y); // left label

  y += 6;

  // Table
  doc.autoTable({
    startY: y,
    margin: { left: startX },
    tableWidth: width,
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
      valign: "middle"
    },
    headStyles: {
      fillColor: [230, 230, 230],
      textColor: 0,
      fontStyle: "bold"
    },
    body: data.map(([k, v]) => [k, v]),
    theme: "grid",
    columnStyles: {
      0: { cellWidth: width * 0.45, fontStyle: "bold" },
      1: { cellWidth: width * 0.55 }
    }
  });

  const afterTableY = doc.lastAutoTable.finalY + 10;

  // Signature line
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Authorized Signature:", startX + 2, afterTableY);
  doc.line(startX + 2, afterTableY + 2, startX + 52, afterTableY + 2);

  // Footer
  const timestamp = `Generated: ${new Date().toLocaleString()}`;
  doc.setFontSize(7);
  doc.text(timestamp, startX + width / 2, afterTableY + 10, { align: "center" });
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl relative shadow-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-600">
          <FiX size={20} />
        </button>
        <h2 className="text-lg font-bold text-purple-700 mb-4">
          Pay Bill - {student.name}
        </h2>

        {/* Bill Template Select */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Select Bill</label>
          <select
            className="w-full border rounded px-3 py-2"
            onChange={handleBillChange}
            value={selectedBill?.id || ""}
          >
            <option value="">-- Select Bill --</option>
            {bills.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.number})
              </option>
            ))}
          </select>
        </div>

        {/* Particulars */}
        {selectedBill && selectedBill.particulars?.length > 0 && (
          <div className="border rounded p-3 mb-3 max-h-40 overflow-y-auto">
            {selectedBill.particulars.map((p) => (
              <div key={p.id} className="flex justify-between text-sm mb-1">
                <span>{p.name}</span>
                <span>₹{p.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="text-sm mb-4">
          <p>Total Amount: ₹{total.toFixed(2)}</p>
          <p>Already Paid: ₹{paidAmount.toFixed(2)}</p>
          <p className="font-semibold text-red-600">
            Pending: ₹{(total - paidAmount).toFixed(2)}
          </p>
        </div>

        {/* Payment Inputs */}
        <div className="space-y-3">
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Amount to pay"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />
          <select
            className="w-full border rounded px-3 py-2"
            value={modeofpayment}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="">-- Payment Mode --</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="cheque">Cheque</option>
            <option value="other">Other</option>
          </select>

          {modeofpayment !== "cash" && (
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Reference Number"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
            />
          )}
        </div>

        {/* Submit */}
        <div className="mt-5 text-right">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
          >
            {loading ? "Processing..." : "Submit Payment"}
          </button>
        </div>
    {transactions.length > 0 && (
  <div className="text-sm mb-3 border rounded p-3 max-h-60 overflow-y-auto">
    <p className="font-semibold mb-2">Payment History:</p>
    {transactions.map((txn) => (
      <div key={txn.id} className="flex justify-between items-center text-xs mb-2">
        <div>
          <p>{new Date(txn.created_on).toLocaleDateString()}</p>
          <p>₹{txn.fees_paid} via {txn.modeofpayment}</p>
        </div>
        <button
          onClick={() => handlePrintPDF(txn)}
          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
        >
          Print
        </button>
      </div>
    ))}
  </div>
)}


      </div>
 

    </div>
  );
};

export default Bill_Modal;

import React, { useEffect, useState } from "react";
import { FiPlusCircle, FiEye, FiFileText } from "react-icons/fi";
import axiosInstance from "../../../services/axiosInstance";
import { useSchool } from "../context/SchoolContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BillModal from "./BillModal";
import ParticularsModal from "./ParticularsModal";

const FeeManagement = () => {
  const { selectedSchool, selectedSession } = useSchool();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showParticularsModal, setShowParticularsModal] = useState(false);

  const dummyData = [
    {
      id: "dummy-1",
      number: "BILL-2025-001",
      name: "Electricity Charges",
      bill_type: "govt",
      created_on: "2025-06-01T10:00:00",
      particulars: [
        { name: "Main Block Power", price: "1500.00" },
        { name: "Lab Power Backup", price: "800.00" },
      ],
    },
  ];

  useEffect(() => {
    fetchBills();
  }, [selectedSchool?.id, selectedSession?.id]);

  const fetchBills = async () => {
    if (!selectedSchool?.id || !selectedSession?.id) {
      setBills(dummyData);
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/api/schools/v1/bills/?school_id=${selectedSchool.id}&session_id=${selectedSession.id}`
      );
      setBills(res.data?.length ? res.data : dummyData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bills. Using dummy data.");
      setBills(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = (particulars) => {
    if (!Array.isArray(particulars)) return "0.00";
    return particulars
      .reduce((sum, p) => sum + parseFloat(p.price || 0), 0)
      .toFixed(2);
  };

  return (
    <div className="space-y-10">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#6B21A8]">Fee Management</h1>
        <button
          onClick={() => {
            setSelectedBill(null);
            setShowBillModal(true);
          }}
          className="flex items-center gap-2 bg-[#6B21A8] hover:bg-[#9333EA] text-white px-4 py-2 rounded-md text-sm shadow"
        >
          <FiPlusCircle />
          Add New Bill
        </button>
      </div>

      <div className="bg-white rounded-xl shadow border border-[#E2E8F0] overflow-x-auto">
        {bills.length === 0 && !loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            <FiFileText className="mx-auto text-3xl mb-2" />
            No bills found. Click "Add New Bill" to get started.
          </div>
        ) : (
          <table className="min-w-full text-sm text-[#334155]">
            <thead className="bg-[#F1F5F9] text-left">
              <tr className="uppercase text-xs tracking-wide text-gray-600">
                <th className="px-4 py-3">Bill No</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Created On</th>
                <th className="px-4 py-3 text-right">Total ₹</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr
                  key={bill.id || index}
                  className="border-t hover:bg-gray-50 transition-all duration-150"
                >
                  <td className="px-4 py-3 font-semibold">{bill.number}</td>
                  <td className="px-4 py-3">{bill.name}</td>
                  <td className="px-4 py-3 capitalize">{bill.bill_type}</td>
                  <td className="px-4 py-3">
                    {bill.created_on
                      ? new Date(bill.created_on).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-bold text-right text-green-700">
                    ₹ {totalAmount(bill.particulars)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedBill(bill);
                        setShowParticularsModal(true);
                      }}
                      className="text-[#6B21A8] hover:text-[#9333EA] flex items-center gap-1 text-sm font-medium"
                    >
                      <FiEye />
                      Add/View Particulars
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {loading && (
          <p className="text-center py-6 text-sm text-gray-500">
            Loading bills...
          </p>
        )}
      </div>

      {showBillModal && (
        <BillModal
          onClose={() => {
            setShowBillModal(false);
            fetchBills();
          }}
          selectedBill={selectedBill}
        />
      )}

      {showParticularsModal && selectedBill && (
        <ParticularsModal
          bill={selectedBill}
          onClose={() => {
            setShowParticularsModal(false);
            fetchBills();
          }}
        />
      )}
    </div>
  );
};

export default FeeManagement;

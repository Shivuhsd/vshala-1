import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiPlusCircle, FiEdit2, FiTrash2 } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import axiosInstance from "../../../../services/axiosInstance";
import { useSchool } from "../../../school_Admin/context/SchoolContext";

Modal.setAppElement("#root");

const statusOptions = ["Pending", "Approved", "Delivered", "Canceled"];

const StockPurchaseOrder = () => {
  const { selectedSchool } = useSchool();
  const schoolId = selectedSchool?.id;

  const [modalOpen, setModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [orders, setOrders] = useState([]);

  // Order fields
  const [supplier, setSupplier] = useState("");
  const [orderDate, setOrderDate] = useState(new Date());
  const [expectedDate, setExpectedDate] = useState(new Date());
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!schoolId) return;
    axiosInstance
      .get(`/inventory/v1/suppliers/?school_id=${schoolId}`)
      .then((res) => setSuppliers(res.data || []));

    axiosInstance
      .get(`/inventory/v1/items/?school_id=${schoolId}`)
      .then((res) => setItemsList(res.data || []));
  }, [schoolId]);

  const openModal = () => {
    setModalOpen(true);
    resetForm();
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const resetForm = () => {
    setSupplier("");
    setOrderDate(new Date());
    setExpectedDate(new Date());
    setStatus("Pending");
    setNotes("");
    setItems([{ itemId: "", quantity: "", price: "" }]);
  };

  const addItemRow = () => {
    setItems([...items, { itemId: "", quantity: "", price: "" }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const totalAmount = items.reduce((acc, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    return acc + qty * price;
  }, 0);

  const handleSubmit = () => {
    if (!supplier || items.some((i) => !i.itemId || !i.quantity || !i.price)) {
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = {
      supplier,
      order_date: orderDate.toISOString(),
      expected_delivery: expectedDate.toISOString(),
      status,
      total_amount: totalAmount,
      notes,
      school: schoolId,
      items: items.map((i) => ({
        item: i.itemId,
        quantity: Number(i.quantity),
        price: Number(i.price),
      })),
    };

    // Add to UI (simulate POST)
    setOrders((prev) => [...prev, { id: Date.now(), ...payload }]);
    toast.success("Order added successfully");
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#6B21A8]">
          Stock Purchase Orders
        </h1>
        <button
          onClick={openModal}
          className="bg-[#6B21A8] text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FiPlusCircle />
          Add Order
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by notes"
        className="border px-3 py-2 rounded w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Order Date</th>
              <th className="px-4 py-3">Expected Delivery</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders
                .filter((o) =>
                  o.notes?.toLowerCase().includes(search.toLowerCase())
                )
                .map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {suppliers.find((s) => s.id === order.supplier)
                        ?.supplier_name || "—"}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(order.expected_delivery).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{order.status}</td>
                    <td className="px-4 py-2">₹{order.total_amount}</td>
                    <td className="px-4 py-2">{order.notes}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="max-w-4xl w-full bg-white rounded-xl p-6 shadow-lg border"
        overlayClassName="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50"
      >
        <h2 className="text-xl font-bold mb-4">Add New Stock Order</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block mb-1">Supplier</label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.supplier_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Order Date</label>
            <DatePicker
              selected={orderDate}
              onChange={(date) => setOrderDate(date)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Expected Delivery</label>
            <DatePicker
              selected={expectedDate}
              onChange={(date) => setExpectedDate(date)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {statusOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Items</h3>
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-4"
            >
              <select
                value={item.itemId}
                onChange={(e) =>
                  handleItemChange(index, "itemId", e.target.value)
                }
                className="border rounded px-3 py-2"
              >
                <option value="">Select Item</option>
                {itemsList.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.item_name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
                className="border rounded px-3 py-2"
              />
              <button
                onClick={() => removeItemRow(index)}
                className="text-red-500 text-sm"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <button
            onClick={addItemRow}
            className="text-sm text-[#6B21A8] mt-2 flex items-center gap-1"
          >
            <FiPlusCircle />
            Add Item
          </button>
        </div>

        <div className="mt-6">
          <label className="block mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>

        <div className="mt-4 font-semibold text-right text-[#6B21A8]">
          Total Amount: ₹{totalAmount.toFixed(2)}
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={closeModal}
            className="border px-4 py-2 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#6B21A8] text-white px-4 py-2 rounded text-sm"
          >
            Save Order
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StockPurchaseOrder;

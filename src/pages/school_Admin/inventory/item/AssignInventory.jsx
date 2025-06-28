import React, { useState } from "react";
import { FiPlusCircle, FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";

const AssignInventory = () => {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    category: "",
    item: "",
    department: "",
    quantity: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // Dummy options
  const categories = ["Stationery", "Electronics", "Furniture"];
  const items = {
    Stationery: ["Pen", "Notebook", "Stapler", "Markers"],
    Electronics: ["Projector", "Laptop", "Printer", "Router"],
    Furniture: ["Chair", "Table", "Cabinet", "Whiteboard"],
  };
  const departments = ["Science", "Mathematics", "Admin", "Library", "Sports"];

  const handleSubmit = () => {
    const { category, item, department, quantity } = form;

    if (!category || !item || !department || !quantity) {
      toast.error("Please fill out all fields.");
      return;
    }

    const newEntry = { ...form };

    if (editingIndex !== null) {
      const updated = [...assignments];
      updated[editingIndex] = newEntry;
      setAssignments(updated);
      toast.success("Assignment updated.");
    } else {
      setAssignments((prev) => [...prev, newEntry]);
      toast.success("Item assigned successfully.");
    }

    setForm({ category: "", item: "", department: "", quantity: "" });
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    setForm(assignments[index]);
    setEditingIndex(index);
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-purple-700">Assign Inventory</h1>

      {/* Form Section */}
      <div className="bg-white shadow rounded-xl border border-gray-200 p-6 space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value, item: "" })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Item
            </label>
            <select
              value={form.item}
              onChange={(e) => setForm({ ...form, item: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              disabled={!form.category}
            >
              <option value="">Select Item</option>
              {items[form.category]?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Department
            </label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Number of Items
            </label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="Enter quantity"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              min="1"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
        >
          <FiPlusCircle />
          {editingIndex !== null ? "Update Assignment" : "Assign Inventory"}
        </button>
      </div>

      {/* Assigned Items List */}
      <div className="bg-white shadow rounded-xl border border-gray-200 p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Assigned Inventory List
        </h2>
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-left">
            <tr className="text-xs uppercase tracking-wider text-gray-600">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No assignments yet.
                </td>
              </tr>
            ) : (
              assignments.map((entry, idx) => (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{entry.category}</td>
                  <td className="px-4 py-2">{entry.item}</td>
                  <td className="px-4 py-2">{entry.department}</td>
                  <td className="px-4 py-2">{entry.quantity}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-purple-600 hover:underline flex items-center gap-1 text-sm"
                    >
                      <FiEdit2 />
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignInventory;

import React from "react";
import {
  FiBox,
  FiPackage,
  FiTruck,
  FiClipboard,
  FiEdit2,
  FiUsers,
  FiTrendingUp,
  FiLayers,
} from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const InventoryDashboard = () => {
  const stats = [
    {
      title: "Total Categories",
      count: 6,
      icon: <FiBox className="text-4xl text-white" />,
      bg: "bg-gradient-to-r from-purple-600 to-indigo-600",
    },
    {
      title: "Total Items",
      count: 42,
      icon: <FiPackage className="text-4xl text-white" />,
      bg: "bg-gradient-to-r from-pink-500 to-red-500",
    },
    {
      title: "Total Suppliers",
      count: 4,
      icon: <FiTruck className="text-4xl text-white" />,
      bg: "bg-gradient-to-r from-yellow-500 to-orange-500",
    },
    {
      title: "Total Orders",
      count: 12,
      icon: <FiClipboard className="text-4xl text-white" />,
      bg: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    {
      title: "Total Distributed Items",
      count: 31,
      icon: <FiUsers className="text-4xl text-white" />,
      bg: "bg-gradient-to-r from-teal-500 to-cyan-500",
    },
    {
      title: "Total Transactions",
      count: 23,
      icon: <FiTrendingUp className="text-4xl text-white" />,
      bg: "bg-gradient-to-r from-blue-500 to-indigo-700",
    },
    {
      title: "Total Departments",
      count: 5,
      icon: <FiLayers className="text-4xl text-white" />,
      bg: "bg-gradient-to-r from-fuchsia-500 to-pink-600",
    },
    {
      title: "New Item Request",
      count: 15,
      icon: <FiLayers className="text-4xl text-white" />,
      bg: "bg-gradient-to-r from-teal-500 to-cyan-500",
    },
  ];

  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Purchase Orders",
        data: [2, 5, 3, 6, 4, 7],
        backgroundColor: "#7C3AED",
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Stationery", "Electronics", "Furniture", "Books", "Sports"],
    datasets: [
      {
        label: "Stock Distribution",
        data: [25, 15, 20, 10, 30],
        backgroundColor: [
          "#7C3AED",
          "#E879F9",
          "#4ADE80",
          "#60A5FA",
          "#FACC15",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  const recentOrders = [
    {
      id: 1,
      supplier: "ABC Traders",
      item: "Printer Paper",
      status: "Delivered",
      date: "2025-06-01",
      amount: 1200,
    },
    {
      id: 2,
      supplier: "XYZ Suppliers",
      item: "White Board",
      status: "Pending",
      date: "2025-06-05",
      amount: 3200,
    },
    {
      id: 3,
      supplier: "Tech Equip Co.",
      item: "Projector",
      status: "Approved",
      date: "2025-06-07",
      amount: 45000,
    },
    {
      id: 4,
      supplier: "Office Hub",
      item: "Markers",
      status: "Canceled",
      date: "2025-06-08",
      amount: 850,
    },
    {
      id: 5,
      supplier: "Book World",
      item: "Textbooks",
      status: "Delivered",
      date: "2025-06-09",
      amount: 5400,
    },
  ];

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Approved: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Canceled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-[#6B21A8]">Inventory Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 shadow-md text-white flex items-center justify-between ${s.bg}`}
          >
            <div>
              <p className="text-sm font-medium">{s.title}</p>
              <h2 className="text-3xl font-bold">{s.count}</h2>
            </div>
            {s.icon}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Monthly Purchase Trends
          </h2>
          <Bar data={barData} options={barOptions} />
        </div>

        <div className="bg-white border rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Stock Distribution by Category
          </h2>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border rounded-2xl shadow p-6 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Purchase Orders
          </h2>
        </div>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Supplier</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{order.supplier}</td>
                <td className="px-4 py-2">{order.item}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">₹{order.amount.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <button className="text-purple-600 hover:underline flex items-center gap-1">
                    <FiEdit2 className="text-base" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {recentOrders.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 py-4 text-sm"
                >
                  No recent orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryDashboard;

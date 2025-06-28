import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../services/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { FiUserPlus, FiSearch, FiUsers } from "react-icons/fi";

const AddAdminForm = () => {
  const navigate = useNavigate();
  const { schoolId } = useParams();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [existingAdmins, setExistingAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔁 Fetch existing admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosInstance.get(
          `admin/v1/search/?school_id=${schoolId}`
        );
        const admins = response.data.admins || [];
        setExistingAdmins(admins);
        setFilteredAdmins(admins);
      } catch (err) {
        toast.error("Failed to load existing admins.");
      }
    };

    fetchAdmins();
  }, [schoolId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitNewAdmin = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("admin/v1/schools/add/", {
        username,
        email,
        password,
        tenant_id: schoolId,
        role: "school_admin",
      });
      toast.success("New admin added successfully!");
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to add new admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setSearchQuery(q);
    setFilteredAdmins(
      existingAdmins.filter((admin) =>
        admin.username.toLowerCase().includes(q)
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 bg-white rounded-xl shadow">
      <ToastContainer />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Manage School Admins
        </h2>
        <button
          onClick={() => navigate("/admin/schools")}
          className="text-sm text-purple-700 hover:underline"
        >
          ← Back to Schools
        </button>
      </div>

      {/* Create New Admin Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FiUserPlus /> Create New Admin
        </h3>
        <form
          onSubmit={handleSubmitNewAdmin}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="border px-4 py-2 rounded-md"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border px-4 py-2 rounded-md"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border px-4 py-2 rounded-md"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`md:col-span-3 w-fit px-6 py-2 mt-2 text-white rounded-md ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Add Existing Admin Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FiUsers /> Add Existing Admin
        </h3>

        <div className="flex gap-2 mb-4">
          <FiSearch className="mt-2 text-gray-400" />
          <input
            type="text"
            placeholder="Search existing admins..."
            className="border px-4 py-2 rounded-md w-full md:w-96 text-sm"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {filteredAdmins.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">
                      {admin.username}
                    </p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Role: {admin.role}
                    </p>
                  </div>
                  <div>
                    {admin.is_admin ? (
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                        Assigned
                      </span>
                    ) : (
                      <button
                        className="text-sm text-purple-700 hover:text-purple-900 font-medium"
                        onClick={() => toast.info("Assign logic to be implemented")}
                      >
                        + Assign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No matching admins found.</p>
        )}
      </div>
    </div>
  );
};

export default AddAdminForm;

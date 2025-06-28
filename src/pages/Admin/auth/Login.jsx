import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const userlogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.vshala.in/api/accounts/v1/login/web/super-admin/",
        { login, password }
      );

      if (response.status === 200 && response.data?.access_token) {
        localStorage.setItem("accessToken", response.data.access_token);
        toast.success("Login successful!", { autoClose: 1500 });
        setTimeout(() => navigate("/admin/dashboard"), 1600);
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;

      if (status === 401 || status === 400) {
        // Specific invalid credentials response
        if (typeof detail === "string") {
          toast.error(detail);
        } else {
          toast.error("Invalid login or password.");
        }
      } else if (status === 404) {
        toast.error("User not found.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-800 via-purple-900 to-gray-900">
      <ToastContainer />
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full">
        {/* Left Panel */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-b from-gray-900 to-purple-800 text-white p-10">
          <div className="max-w-sm">
            <h1 className="text-4xl font-bold mb-4">Welcome to Vshala</h1>
            <p className="text-gray-300">
              A one-stop platform to manage academics, staff, and students
              securely.
            </p>
            <p className="text-gray-400 mt-6">Powered by Vtech Coders</p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Sign In</h2>

          <form className="space-y-5" onSubmit={userlogin}>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                placeholder="Enter your Username/Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-700"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                Remember me
              </label>
              <a href="#" className="text-purple-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white rounded-lg font-semibold transition duration-300 ${
                loading
                  ? "bg-purple-500 cursor-not-allowed"
                  : "bg-purple-700 hover:bg-purple-800"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

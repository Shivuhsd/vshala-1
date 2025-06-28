import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../../../assets/login_image.png";
import vtechLogo2 from "../../../assets/vtech_logo_2.jpeg"; // new logo
import { useSchool } from "../context/SchoolContext";

const icons = [
  "fa-book",
  "fa-graduation-cap",
  "fa-lightbulb",
  "fa-globe",
  "fa-pen",
  "fa-ruler",
  "fa-microscope",
  "fa-chalkboard-teacher",
  "fa-laptop-code",
  "fa-user-graduate",
  "fa-school",
  "fa-clipboard",
  "fa-book-open",
  "fa-flask",
  "fa-paint-brush",
  "fa-brain",
  "fa-pencil-alt",
  "fa-compass",
  "fa-chalkboard",
  "fa-atom",
];

const SchoolLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSelectedSchool, setSelectedSession } = useSchool();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://api.vshala.in/api/accounts/v1/login/web/",
        { login, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const { access_token, username, school_id } = res.data;
      localStorage.setItem("schoolAdminToken", access_token);
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("user", username);
      localStorage.setItem("school_id", school_id);
      const infoRes = await axios.get(
        `https://api.vshala.in/api/admin/v1/sessions/?school_id=${school_id}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const school = infoRes.data.school || { id: school_id };
      const sessions = infoRes.data || [];
      if (sessions.length === 0) throw new Error("No sessions returned.");

      const activeSession = sessions[0];
      localStorage.setItem("school", JSON.stringify(school));
      localStorage.setItem("session", JSON.stringify(activeSession));

      setSelectedSchool(school);
      setSelectedSession(activeSession);

      toast.success("Login successful!");
      setTimeout(() => navigate("/school-admin/dashboard"), 1500);
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Check credentials or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#5906B2] font-sans">
      <ToastContainer />
      <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-[#8C50E2] bg-white">
        {/* Left Panel */}
        <div className="hidden md:flex relative w-1/2 items-center justify-center overflow-hidden bg-[#4e00cc] px-6 py-10 text-white">
          {/* Icon Grid */}
          <div className="absolute inset-0 z-0 grid grid-cols-5 gap-10 place-items-center opacity-10 text-white text-2xl pointer-events-none">
            {Array(30)
              .fill(null)
              .map((_, i) => (
                <i key={i} className={`fas ${icons[i % icons.length]}`} />
              ))}
          </div>

          {/* Centered Branding */}
          <div className="z-10 text-center">
            <img
              src={loginImage}
              alt="Login Visual"
              className="w-36 h-36 object-contain mb-4 mx-auto drop-shadow-lg"
            />
            <h2 className="text-3xl font-extrabold mb-2 text-white">
              Welcome to Vshala
            </h2>
            <p className="text-sm text-gray-100 mb-3">
              Smart School Administration System
            </p>

            {/* ✅ New Vtech Logo Display */}
            <img
              src={vtechLogo2}
              alt="Vtech Coders Logo"
              className="w-40 h-auto mx-auto mt-2 drop-shadow-md"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            School Admin Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Username or Email
              </label>
              <input
                type="text"
                required
                name="login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter your username/email"
              />
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[36px] text-gray-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md text-white font-semibold transition ${
                loading
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-purple-800 hover:opacity-90"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
    </div>
  );
};

export default SchoolLogin;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      role === "teacher"
        ? navigate("/teacher")
        : navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-xl">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Login
        </h2>

        {error && (
          <p className="bg-red-500/20 text-red-300 text-center p-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded-lg font-semibold text-white"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Geo-Fenced Smart Attendance System
        </p>

      </div>
    </div>
  );
};

export default Login;

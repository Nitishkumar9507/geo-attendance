import { useEffect, useState } from "react";
import api from "../api/axios";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const res = await api.get("/attendance/active", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (res.data._id) {
          setSession(res.data);
        } else {
          setMessage("No active attendance session");
        }
      } catch (err) {
        setMessage("Failed to fetch session");
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSession();
  }, []);

  const markAttendance = () => {
    if (!session) return;

    setMessage("");
    setMarking(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await api.post(
            "/attendance/mark",
            {
              sessionId: session._id,
              latitude,
              longitude,
            },
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

          setMessage(res.data.message);
        } catch (err) {
          setMessage(
            err.response?.data?.message || "Attendance failed"
          );
        } finally {
          setMarking(false);
        }
      },
      () => {
        setMessage("Location permission denied");
        setMarking(false);
      }
    );
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-700">
        <h2 className="text-xl font-bold">Student Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 mt-20">

        {session ? (
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl max-w-md w-full text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Attendance Active
            </h3>

            <p className="text-gray-300 mb-6">
              You are eligible to mark attendance.
            </p>

            <button
              onClick={markAttendance}
              disabled={marking}
              className={`w-full py-3 rounded-xl text-lg font-semibold transition ${
                marking
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {marking ? "Marking..." : "Mark Attendance"}
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-lg">
            {message || "No active attendance session"}
          </p>
        )}

        {message && session && (
          <p className="mt-6 text-indigo-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

import { useState } from "react";
import api from "../api/axios";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [radius, setRadius] = useState(20);
  const [duration, setDuration] = useState(5);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);

  const navigate = useNavigate();

  const startAttendance = () => {
    setMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await api.post(
            "/attendance/start",
            {
              latitude,
              longitude,
              radius,
              duration,
            },
            {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );

          setSessionId(res.data.session._id);
          setAttendanceList([]);
          setMessage("Attendance session started");
        } catch (err) {
          setMessage(err.response?.data?.message || "Failed to start attendance");
        }
      },
      () => setMessage("Location permission denied")
    );
  };

  const fetchAttendanceList = async () => {
    if (!sessionId) {
      setMessage("No active session");
      return;
    }

    try {
      const res = await api.get(`/attendance/list/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setAttendanceList(res.data);
    } catch (err) {
      setMessage("Failed to fetch attendance list");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-700">
        <h2 className="text-xl font-bold">Teacher Dashboard</h2>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">

        {/* Attendance Controls */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Start Attendance Session
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="Radius (meters)"
              className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2"
            />

            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (minutes)"
              className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2"
            />

            <button
              onClick={startAttendance}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 py-2"
            >
              Start Attendance
            </button>
          </div>

          {message && (
            <p className="mt-4 text-indigo-300">{message}</p>
          )}

          {sessionId && (
            <p className="mt-2 text-sm text-gray-400">
              Session ID: {sessionId}
            </p>
          )}
        </div>

        {/* Attendance List */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Attendance List</h3>
            <button
              onClick={fetchAttendanceList}
              className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
            >
              Refresh
            </button>
          </div>

          {attendanceList.length === 0 ? (
            <p className="text-gray-400">
              No attendance records yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-2">Name</th>
                    <th className="py-2">Roll No</th>
                    <th className="py-2">Distance (m)</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.map((record) => (
                    <tr
                      key={record._id}
                      className="border-b border-slate-800 hover:bg-white/5"
                    >
                      <td className="py-2">
                        {record.student.name}
                      </td>
                      <td className="py-2">
                        {record.student.rollNo}
                      </td>
                      <td className="py-2">
                        {record.distanceFromCenter.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;

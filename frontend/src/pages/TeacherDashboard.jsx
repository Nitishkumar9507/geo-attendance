import { useState } from "react";
import api from "../api/axios";
import { getToken } from "../utils/auth";

const TeacherDashboard = () => {
  const [radius, setRadius] = useState(20);
  const [duration, setDuration] = useState(5);
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);

  const startAttendance = () => {
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("Geolocation not supported");
      return;
    }

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
            },
          );

          setMessage("Attendance started successfully");
          setSessionId(res.data.session._id);
        } catch (err) {
          setMessage(
            err.response?.data?.message || "Failed to start attendance",
          );
        }
      },
      () => {
        setMessage("Location permission denied");
      },
    );
  };
  const fetchAttendanceList = async () => {
    if (!sessionId) {
      setMessage("No session available");
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
  console.log("Attendance list error:", err.response || err);
  setMessage("Failed to fetch attendance list");
}

  };

  return (
    <div>
      <h3>Teacher Dashboard</h3>

      <label>
        Radius (meters):
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
        />
      </label>

      <br />

      <label>
        Duration (minutes):
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </label>

      <br />

      <button onClick={startAttendance}>Start Attendance</button>
      <br />
      <button onClick={fetchAttendanceList}>View Attendance List</button>

      {attendanceList.length > 0 && (
        <div>
          <h4>Attendance Records</h4>
          <ul>
            {attendanceList.map((record) => (
              <li key={record._id}>
                {record.student.name} ({record.student.rollNo}) –{" "}
                {record.distanceFromCenter.toFixed(2)} m
              </li>
            ))}
          </ul>
        </div>
      )}

      {message && <p>{message}</p>}
      {sessionId && <p>Session ID: {sessionId}</p>}
    </div>
  );
};

export default TeacherDashboard;

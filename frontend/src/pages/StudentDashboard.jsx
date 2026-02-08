import { useEffect, useState } from "react";
import api from "../api/axios";
import { getToken } from "../utils/auth";

const StudentDashboard = () => {
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch active attendance session
  useEffect(() => {
    const fetchSession = async () => {
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

    fetchSession();
  }, []);

  const markAttendance = () => {
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
            err.response?.data?.message || "Failed to mark attendance"
          );
        }
      },
      () => {
        setMessage("Location permission denied");
      }
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Student Dashboard</h3>

      {session ? (
        <>
          <p>Attendance is ACTIVE</p>
          <button onClick={markAttendance}>Mark Attendance</button>
        </>
      ) : (
        <p>{message}</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default StudentDashboard;

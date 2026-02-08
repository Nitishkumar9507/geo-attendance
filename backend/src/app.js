const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);


const { protect, authorize } = require("./middleware/authMiddleware");

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

app.get("/api/teacher-only", protect, authorize("teacher"), (req, res) => {
  res.json({ message: "Teacher access granted" });
});




module.exports = app;

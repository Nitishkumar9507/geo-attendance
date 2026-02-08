const express = require("express");
const {
  startAttendance,
  markAttendance,
  getActiveSession,
  getAttendanceList,
} = require("../controllers/attendanceController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Teacher starts attendance
router.post("/start", protect, authorize("teacher"), startAttendance);

// Student marks attendance
router.post("/mark", protect, authorize("student"), markAttendance);

// Student: get active session
router.get(
  "/active",
  protect,
  authorize("student"),
  getActiveSession
);

// Teacher: get attendance list
router.get(
  "/list/:sessionId",
  protect,
  authorize("teacher"),
  getAttendanceList
);


module.exports = router;

const AttendanceSession = require("../models/AttendanceSession");
const AttendanceRecord = require("../models/AttendanceRecord");
const calculateDistance = require("../utils/calculateDistance");



// Start attendance session (Teacher)
exports.startAttendance = async (req, res) => {
  try {
    const { latitude, longitude, radius, duration } = req.body;

    if (!latitude || !longitude || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const endTime = new Date(
      Date.now() + duration * 60 * 1000
    );

    const session = await AttendanceSession.create({
      teacher: req.user._id,
      latitude,
      longitude,
      radius: radius || 20,
      startTime: new Date(),
      endTime,
      isActive: true,
    });

    res.status(201).json({
      message: "Attendance session started",
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student marks attendance
exports.markAttendance = async (req, res) => {
  try {
    const { sessionId, latitude, longitude } = req.body;

    if (!sessionId || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const session = await AttendanceSession.findById(sessionId);

    if (!session || !session.isActive) {
      return res.status(400).json({ message: "Session not active" });
    }

    // Time window check
    if (new Date() > session.endTime) {
      session.isActive = false;
      await session.save();
      return res.status(400).json({ message: "Attendance closed" });
    }

    // Prevent duplicate attendance
    const alreadyMarked = await AttendanceRecord.findOne({
      session: sessionId,
      student: req.user._id,
    });

    if (alreadyMarked) {
      return res
        .status(400)
        .json({ message: "Attendance already marked" });
    }

    // Distance check
    const distance = calculateDistance(
      session.latitude,
      session.longitude,
      latitude,
      longitude
    );

    if (distance > session.radius) {
      return res.status(403).json({
        message: "You are outside attendance radius",
        distance,
      });
    }

    const record = await AttendanceRecord.create({
      session: sessionId,
      student: req.user._id,
      latitude,
      longitude,
      distanceFromCenter: distance,
      status: "present",
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active attendance session (for students)
exports.getActiveSession = async (req, res) => {
  try {
    const session = await AttendanceSession.findOne({
      isActive: true,
      endTime: { $gt: new Date() },
    }).populate("teacher", "name email");

    if (!session) {
      return res.json({ message: "No active attendance session" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance records for a session (Teacher)
exports.getAttendanceList = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const records = await AttendanceRecord.find({
      session: sessionId,
    }).populate("student", "name email rollNo");

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

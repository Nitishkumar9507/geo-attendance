const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AttendanceSession",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    distanceFromCenter: {
      type: Number, // meters
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "flagged"],
      default: "present",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AttendanceRecord",
  attendanceRecordSchema
);

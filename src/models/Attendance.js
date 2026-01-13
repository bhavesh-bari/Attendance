// models/Attendance.js
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      index: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    className: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    MornCount: { type: Number, default: 0 },
    AftCount: { type: Number, default: 0 },

    isEvent: { type: Boolean, default: false },

    MEventName: { type: String, default: "" },
    AEventName: { type: String, default: "" },
  },
  { timestamps: true }
);

AttendanceSchema.index(
  { date: 1, classId: 1 },
  { unique: true }
);

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);

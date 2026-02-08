import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },     // MECHA_3
    department: { type: String, required: true },
    year: { type: Number, required: true },
    division: { type: String, required: true },

    academicYear: {
      type: String,
      required: true,                           // "2025-26"
      index: true
    },

    totalStudents: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);


ClassSchema.index({ academicYear: 1, name: 1 }, { unique: true });
ClassSchema.index({ academicYear: 1, department: 1 });
ClassSchema.index({ academicYear: 1, year: 1 });
ClassSchema.index({ academicYear: 1, department: 1, year: 1 });

export default mongoose.models.Class ||
  mongoose.model("Class", ClassSchema);

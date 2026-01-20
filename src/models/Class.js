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


ClassSchema.index(
  { name: 1, academicYear: 1 },
  { unique: true }
);

export default mongoose.models.Class ||
  mongoose.model("Class", ClassSchema);

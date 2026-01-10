import mongoose from "mongoose";
const ClassSchema = new mongoose.Schema(
    {
        name: { type: String, unique: true, required: true }, 
        department: String,
        year: Number,
        division: String,
        totalStudents: Number,
    },
    { timestamps: true }
);


export default mongoose.models.Class || mongoose.model("Class", ClassSchema);


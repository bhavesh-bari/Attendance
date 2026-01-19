import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: { type: String, required: true },

        role: {
            type: String,
            enum: ["AMC", "Department Dean", "Faculty"],
            required: true,
        },

        department: {
            type: String,
            required: function () {
                return this.role !== "AMC";
            },
        },
    },
    { timestamps: true }
);

export default mongoose.models.User ||
    mongoose.model("User", UserSchema);

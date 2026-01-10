import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: String,
    content: String,
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);

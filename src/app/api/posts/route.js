import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const { title, content } = body;

        const newPost = await Post.create({ title, content });

        return Response.json(
            { success: true, post: newPost },
            { status: 201 }
        );
    } catch (error) {
        console.error("POST ERROR:", error);
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

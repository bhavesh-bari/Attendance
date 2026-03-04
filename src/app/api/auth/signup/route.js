import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    const { name, email, password, role, department } = await req.json();

    await connectDB();

    if (role === "AMC") {
        const existingamc = await User.findOne({
            role: "AMC"
        });

        if (existingamc) {
            return new Response(
                "AMC Admin already exists",
                { status: 409 }
            );
        }
    }

    if (role === "Department Dean") {
        const existingDean = await User.findOne({
            role: "Department Dean",
            department,
        });

        if (existingDean) {
            return new Response(
                "Department Dean already exists for this department",
                { status: 409 }
            );
        }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        department,
    });

    return Response.json({ success: true });
}

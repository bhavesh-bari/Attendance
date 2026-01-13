import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Class from "@/models/Class";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { department } = body;

        let classes;

        // ALL departments
        if (!department || department === "all") {
            classes = await Class.find({});
        }
        // SINGLE or MULTIPLE departments
        else {
            const departments = Array.isArray(department)
                ? department
                : [department];

            classes = await Class.find({
                department: { $in: departments }
            });
        }

        return NextResponse.json(
            {
                success: true,
                count: classes.length,
                classes,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("API ERROR:", error);

        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

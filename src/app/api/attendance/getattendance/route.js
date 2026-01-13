import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { department } = body;
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        let attendances;

        // ✅ Get ALL
        if (!department || department === "all") {
            attendances = await Attendance.find({ date: date });
        }

        else {
            const departments = Array.isArray(department)
                ? department
                : [department];

            attendances = await Attendance.find({
                department: { $in: departments }, date: date
            });
        }


        return NextResponse.json(
            {
                success: true,
                count: attendances.length,
                attendances,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("ATTENDANCE API ERROR:", error);

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

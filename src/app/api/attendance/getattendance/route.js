import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

function getAcademicYear(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth();
    return month >= 5
        ? `${year}-${String(year + 1).slice(2)}`
        : `${year - 1}-${String(year).slice(2)}`;
}

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { department } = body;

        const date = new Date();
        date.setHours(0, 0, 0, 0);

        const academicYear = getAcademicYear(date);

        let attendances;

        // ✅ ALL departments
        if (!department || department === "all") {
            attendances = await Attendance.find({
                date,
                academicYear
            });
        }
        // ✅ SINGLE or MULTIPLE departments
        else {
            const departments = Array.isArray(department)
                ? department
                : [department];

            attendances = await Attendance.find({
                department: { $in: departments },
                date,
                academicYear
            });
        }

        return NextResponse.json(
            {
                success: true,
                count: attendances.length,
                attendances
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

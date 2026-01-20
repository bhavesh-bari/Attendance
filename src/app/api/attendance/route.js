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
        const {
            date,
            classId,
            className,
            department,
            MornCount = 0,
            AftCount = 0,
            MEventName = "",
            AEventName = ""
        } = body;

        if (!date || !classId || !className || !department) {
            return NextResponse.json(
                {
                    success: false,
                    message: "date, classId, className and department are required"
                },
                { status: 400 }
            );
        }

        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        const academicYear = getAcademicYear(normalizedDate);
        const isEvent = Boolean(MEventName || AEventName);

        const attendance = await Attendance.findOneAndUpdate(
            {
                date: normalizedDate,
                classId,
                academicYear
            },
            {
                date: normalizedDate,
                classId,
                className,
                department,
                academicYear,
                MornCount,
                AftCount,
                MEventName,
                AEventName,
                isEvent
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        return NextResponse.json(
            { success: true, data: attendance },
            { status: 200 }
        );

    } catch (error) {
        console.error("❌ Attendance POST error:", error);

        if (error.code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Attendance already exists for this class and date"
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

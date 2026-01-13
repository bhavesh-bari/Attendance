import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

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

        // ✅ Required validation
        if (!date || !classId || !className || !department) {
            return NextResponse.json(
                {
                    success: false,
                    message: "date, classId, className and department are required"
                },
                { status: 400 }
            );
        }

        // ✅ Normalize date (midnight)
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        // ✅ Event detection
        const isEvent = Boolean(MEventName || AEventName);

        // ✅ UPSERT (update if exists, else insert)
        const attendance = await Attendance.findOneAndUpdate(
            {
                date: normalizedDate,
                classId
            },
            {
                date: normalizedDate,
                classId,
                className,
                department,
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

        // Duplicate key error (unique index)
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

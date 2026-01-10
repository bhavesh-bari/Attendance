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
            MornCount = 0,
            AftCount = 0,
            MEventName = "",
            AEventName = ""
        } = body;

        if (!date || !classId || !className) {
            return NextResponse.json(
                { success: false, message: "date, classId and className are required" },
                { status: 400 }
            );
        }

        // 🔑 Normalize date (daily uniqueness)
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        const isEvent = Boolean(MEventName || AEventName);

        // 🔁 UPSERT (update if exists, else create)
        const attendance = await Attendance.findOneAndUpdate(
            { date: normalizedDate, classId },
            {
                date: normalizedDate,
                classId,
                className,
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
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

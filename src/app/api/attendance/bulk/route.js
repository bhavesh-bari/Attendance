import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        if (!Array.isArray(body) || body.length === 0) {
            return NextResponse.json(
                { success: false, message: "Request body must be a non-empty array" },
                { status: 400 }
            );
        }
        const bulkOps = body.map(record => {
            const {
                date,
                classId,
                className,
                MornCount = 0,
                AftCount = 0,
                MEventName = "",
                AEventName = ""
            } = record;

            if (!date || !classId || !className) {
                throw new Error("Each record must have date, classId and className");
            }

            const normalizedDate = new Date(date);
            normalizedDate.setHours(0, 0, 0, 0);

            const isEvent = Boolean(MEventName || AEventName);

            return {
                updateOne: {
                    filter: { date: normalizedDate, classId },
                    update: {
                        date: normalizedDate,
                        classId,
                        className,
                        MornCount,
                        AftCount,
                        MEventName,
                        AEventName,
                        isEvent
                    },
                    upsert: true
                }
            };
        });
        const result = await Attendance.bulkWrite(bulkOps);

        return NextResponse.json(
            { success: true, message: "Bulk attendance processed", data: result },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

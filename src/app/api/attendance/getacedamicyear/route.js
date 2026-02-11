import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Class from "@/models/Class";
export async function POST() {
    try {
        await connectDB();

        const acedamicyears = await Class.distinct("academicYear");

        return NextResponse.json(
            {
                success: true,
                count: acedamicyears.length,
                academicYears: acedamicyears
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

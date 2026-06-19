import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Class from "@/models/Class";

// function getAcademicYear(date = new Date()) {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     return month >= 5
//         ? `${year}-${String(year + 1).slice(2)}`
//         : `${year - 1}-${String(year).slice(2)}`;
// }

export async function GET(req) {
    try {
        await connectDB();
        // const academicYear = getAcademicYear();
        const departments = await Class.distinct("department");

        return NextResponse.json(
            {
                success: true,
                count: departments.length,
                departments,
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
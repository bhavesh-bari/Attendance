import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Class from "@/models/Class";

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

        const academicYear = getAcademicYear();

        let classes;

        // ✅ ALL departments
        if (!department || department === "all") {
            classes = await Class.find({ academicYear });
        }
        // ✅ SINGLE or MULTIPLE departments
        else {
            const departments = Array.isArray(department)
                ? department
                : [department];

            classes = await Class.find({
                department: { $in: departments },
                academicYear
            });
        }

        return NextResponse.json(
            {
                success: true,
                count: classes.length,
                classes
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

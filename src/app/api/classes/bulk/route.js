import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Class from "@/models/Class";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();

        if (!Array.isArray(body) || body.length === 0) {
            return NextResponse.json(
                { success: false, error: "Array of classes is required" },
                { status: 400 }
            );
        }

        // 🔹 Build class documents
        const preparedClasses = body.map((cls) => {
            const yearNumber = parseInt(cls.year);
            return {
                name: `${cls.dept}${yearNumber}_${cls.div}`,
                department: cls.dept,
                year: yearNumber,
                division: cls.div,
                totalStudents: cls.numberOfStudents
            };
        });

        // 🔍 Check existing class names
        const names = preparedClasses.map((c) => c.name);
        const existing = await Class.find({ name: { $in: names } }).select("name");

        const existingNames = new Set(existing.map((c) => c.name));

        // 🚫 Remove duplicates
        const newClasses = preparedClasses.filter(
            (cls) => !existingNames.has(cls.name)
        );

        if (newClasses.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All classes already exist",
                    skipped: [...existingNames]
                },
                { status: 409 }
            );
        }

        // ✅ Insert new classes
        const insertedClasses = await Class.insertMany(newClasses);

        return NextResponse.json(
            {
                success: true,
                insertedCount: insertedClasses.length,
                skippedCount: existingNames.size,
                insertedClasses,
                skippedClasses: [...existingNames]
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("BULK CREATE ERROR:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

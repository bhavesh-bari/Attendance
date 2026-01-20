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

/* ================= POST ================= */
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { dept, year, div, numberOfStudents } = body;

    const yearNumber = parseInt(year);
    const academicYear = getAcademicYear();

    const name = `${dept}${yearNumber}_${div}`;

    const existingClass = await Class.findOne({
      name,
      academicYear
    });

    if (existingClass) {
      return NextResponse.json(
        { success: false, error: "Class already exists for this academic year" },
        { status: 400 }
      );
    }

    const newClass = await Class.create({
      name,
      department: dept,
      year: yearNumber,
      division: div,
      academicYear,
      totalStudents: numberOfStudents
    });

    return NextResponse.json(
      { success: true, class: newClass },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/* ================= PUT ================= */
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { id, dept, year, div, numberOfStudents } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Class ID is required" },
        { status: 400 }
      );
    }

    const yearNumber = parseInt(year);
    const academicYear = getAcademicYear();

    const name = `${dept}${yearNumber}_${div}`;

    const nameExists = await Class.findOne({
      name,
      academicYear,
      _id: { $ne: id }
    });

    if (nameExists) {
      return NextResponse.json(
        { success: false, error: "Another class exists in this academic year" },
        { status: 400 }
      );
    }

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        name,
        department: dept,
        year: yearNumber,
        division: div,
        academicYear,
        totalStudents: numberOfStudents
      },
      { new: true }
    );

    if (!updatedClass) {
      return NextResponse.json(
        { success: false, error: "Class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, class: updatedClass },
      { status: 200 }
    );

  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Class ID is required" },
        { status: 400 }
      );
    }

    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return NextResponse.json(
        { success: false, error: "Class not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Class deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/* ================= GET ================= */
export async function GET(req) {
  try {
    await connectDB();

    const academicYear = getAcademicYear();

    const classes = await Class.find({ academicYear })
      .sort({ createdAt: -1 });

    const totalClasses = await Class.countDocuments({ academicYear });

    const totalStudents = await Class.aggregate([
      { $match: { academicYear } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalStudents" }
        }
      }
    ]);

    const totaldepartments = await Class.distinct("department", { academicYear });

    return NextResponse.json(
      {
        success: true,
        classes,
        totalClasses,
        totalStudents,
        totaldepartments: totaldepartments.length
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Class from "@/models/Class";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { dept, year, div, numberOfStudents } = body;
    const yearNumber = parseInt(year);

    const name = `${dept}${yearNumber}_${div}`;
    const existingClass = await Class.findOne({ name });
    if (existingClass) {
      return NextResponse.json(
        { success: false, error: "Class with this name already exists. Update What you want" },
        { status: 400 }
      );
    }
    const newClass = await Class.create({
      name,
      department: dept,
      year: yearNumber,
      division: div,
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
    const name = `${dept}${yearNumber}_${div}`;
    const nameExists = await Class.findOne({ name, _id: { $ne: id } });
    if (nameExists) {
      return NextResponse.json(
        { success: false, error: "Another class with this name already exists" },
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
export async function GET(req) {
  try {
    await connectDB();
    const classes = await Class.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, classes },
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

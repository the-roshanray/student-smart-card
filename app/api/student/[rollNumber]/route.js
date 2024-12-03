import connectDB from "@/Database/connectDB";
import AddStudent, { validateStudentData } from "@/models/AddStudent";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const validation = validateStudentData(data);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.errors);
      return NextResponse.json(
        { message: "Validation error", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const existingStudent = await AddStudent.findOne({
      rollNumber: data.rollNumber,
    });
    if (existingStudent) {
      return NextResponse.json(
        { message: "Student with this roll number already exists." },
        { status: 400 }
      );
    }
    const newStudent = new AddStudent(data);
    await newStudent.save();

    console.log("New Student Data:", data);
    return NextResponse.json(
      { message: "Student added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing student data:", error);
    return NextResponse.json(
      { message: "Failed to add student", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { pathname } = new URL(request.url);
    const rollNumber = pathname.split("/").pop();

    if (rollNumber && rollNumber !== "route.js") {
      const student = await AddStudent.findOne({ rollNumber }).lean();
      if (!student) {
        return NextResponse.json(
          { message: "No student found for this roll number." },
          { status: 404 }
        );
      }
      return NextResponse.json(student, { status: 200 });
    }

    const students = await AddStudent.find().lean();
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "Failed to retrieve students", error: error.message },
      { status: 500 }
    );
  }
}

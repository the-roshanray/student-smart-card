import connectDB from "@/Database/connectDB";
import AddStudent from "@/models/AddStudent";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
      await connectDB(); // Connect to the database
      const { searchParams } = new URL(request.url);
      const rollNumber = searchParams.get("rollNumber");
      if (rollNumber) {
        // Fetch specific student
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
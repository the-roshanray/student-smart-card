
import { NextResponse } from "next/server";
import AddStudent from "@/models/AddStudent"; // adjust path based on your project structure
import connectDB from "@/Database/connectDB";


export async function POST(req) {
  await connectDB();
  const { userId, password } = await req.json();

  try {
    // Find the student by userId
    const student = await AddStudent.findOne({ userId, password });
    if (!student) {
      return NextResponse.json({
        success: false,
        message: "User ID not found",
      });
    }

    // Verify the password

    return NextResponse.json({
      success: true,
      rollNumber: student.rollNumber,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred during login",
    });
  }
}

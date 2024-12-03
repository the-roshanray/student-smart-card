import connectDB from "@/Database/connectDB";
import AddStudent from "@/models/AddStudent";
import { NextResponse } from "next/server";

export async function POST(req, context) {
  await connectDB();

  const { params } = context;
  const { rollNumber } = await params;

  try {
    const data = await req.json();

    const student = await AddStudent.findOneAndUpdate(
      { rollNumber: rollNumber },
      { balance: data.balance },
      { new: true }
    );

    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error updating balance:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}



import connectDB from "@/Database/connectDB";
import Dashboard from "@/models/Dashboard";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { rollNumber, studentName, course, department, contactNumber, balance } = await req.json();

    if (!rollNumber || !studentName || !course || !department || !contactNumber) {
      return NextResponse.json({ message: "Please provide all required fields." }, { status: 400 });
    }

    const newDashboardEntry = new Dashboard({
      rollNumber,
      studentName,
      course,
      department,
      contactNumber,
      balance,
    });

    await newDashboardEntry.save();

    return NextResponse.json({ message: "Dashboard entry created successfully", data: newDashboardEntry }, { status: 201 });
  } catch (error) {
    console.error("Error creating dashboard entry:", error);
    return NextResponse.json({ message: "Error creating dashboard entry", error }, { status: 500 });
  }
}


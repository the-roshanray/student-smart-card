import connectDB from "@/Database/connectDB";
import Stationary from "@/models/Stationary";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const data = await req.json();
    const { rollNumber, studentName, course, department,items, totalAmount } = data;

    const transaction = new Stationary({
      rollNumber,
      studentName,
      course,
      department,
      items,
      totalAmount,
    });

    const savedTransaction = await transaction.save();

    return NextResponse.json({ success: true, transaction: savedTransaction }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ success: false, message: "Transaction failed", error: error.message }, { status: 500 });
  }
}

import connectDB from "@/Database/connectDB";
import Canteen from "@/models/Canteen";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { rollNumber, studentName, course, department, items, totalAmount } = await req.json();

    // Create a new transaction document
    const transaction = new Canteen({
      rollNumber,
      studentName,
      course,
      department,
      items,
      totalAmount,
    });

    // Save to database
    const savedTransaction = await transaction.save();

    return NextResponse.json({ success: true, transaction: savedTransaction }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ success: false, message: "Transaction failed", error: error.message }, { status: 500 });
  }
}

export function middleware(req, res) {
  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}

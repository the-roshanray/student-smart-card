import connectDB from "@/Database/connectDB";
import Library from "@/models/Library";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const data = await req.json();
    const book = new Library(data);
    await book.save();

    return NextResponse.json({ success: true, message: "Book issued successfully", book }, { status: 201 });
  } catch (error) {
    console.error("Error saving book:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save book", error: error.message },
      { status: 500 }
    );
  }
}
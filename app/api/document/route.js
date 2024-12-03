import connectDB from "@/Database/connectDB";
import Document from "@/models/Documents";
import { NextResponse } from "next/server";

// Handle GET request
export async function GET(req) {
  await connectDB();

  try {
    const documents = await Document.find().sort({ uploadedAt: -1 });
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ message: "Error fetching documents" }, { status: 500 });
  }
}

// Handle POST request
export async function POST(req) {
  await connectDB();

  try {
    const { url, name } = await req.json();
    const newDocument = new Document({ url, name });
    await newDocument.save();
    return NextResponse.json({ message: "Document saved", document: newDocument }, { status: 201 });
  } catch (error) {
    console.error("Error saving document:", error);
    return NextResponse.json({ message: "Error saving document" }, { status: 500 });
  }
}





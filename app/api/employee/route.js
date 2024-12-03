import connectDB from "@/Database/connectDB";
import AddEmployee, { validateEmployeeData } from "@/models/AddEmployee";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const validation = validateEmployeeData(data);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.errors);
      return NextResponse.json(
        { message: "Validation error", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const newEmployee = new AddEmployee(data);
    await newEmployee.save();

    console.log(data);

    return NextResponse.json(
      { message: "Employee added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing employee data:", error);
    return NextResponse.json(
      { message: "Failed to add employee" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const employees = await AddEmployee.find().lean();

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { message: "Failed to retrieve employees" },
      { status: 500 }
    );
  }
}

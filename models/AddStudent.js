import mongoose from "mongoose";
import { z } from "zod";

// Zod Schema for validation
const StudentZodSchema = z.object({
  userId: z.string().min(1, "User ID is required").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  contactNumber: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  course: z.string().min(1, "Course is required"),
  department: z.string().min(1, "Department is required"),
  rollNumber: z.string().min(1, "Roll number is required").max(50),
  email: z.string().email("Invalid email address"),
  profilePictureUrl: z.string().optional(),
  documents: z.array(z.string()).optional(),
  status: z.enum(["Active", "Blocked"]).default("Active"),
  balance: z.number().default(0),
  barcodeUrl: z.string().optional(),
});

// Function to validate student data using Zod
const validateStudentData = (data) => {
  return StudentZodSchema.safeParse(data);
};

// Mongoose schema for the Student model
const StudentSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  course: { type: String, required: true },
  department: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePictureUrl: { type: String },
  documents: [{ type: String }],
  status: { type: String, enum: ["Active", "Blocked"], default: "Active" },
  balance: { type: Number, default: 0 },
  barcodeUrl: { type: String },
});

// Exporting the Student model
export default mongoose.models.Student || mongoose.model("Student", StudentSchema);

// Exporting the validate function
export { validateStudentData };

import mongoose from "mongoose";
import { z } from "zod";

const EmployeeZodSchema = z.object({
  userId: z.string().min(1, "User ID is required").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Contact number must be 10 digits"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  category: z.string().min(1, "Category is required"),
  qualification: z.string().min(1, "Qualification is required"),
  profilePictureUrl: z.string().optional(),
  documents: z.array(z.string()).optional(),
});

const validateEmployeeData = (data) => {
  return EmployeeZodSchema.safeParse(data);
};

const EmployeeSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  category: { type: String, required: true },
  qualification: { type: String, required: true },
  profilePictureUrl: { type: String },
  documents: [{ type: String }],
});

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);

export { validateEmployeeData };

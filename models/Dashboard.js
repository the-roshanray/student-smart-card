import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  place: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const DashboardSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, ref: "AddStudent" },
  studentName: { type: String, required: true },
  course: { type: String, required: true },
  department: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  balance: { type: Number, default: 0 },
  transactions: [transactionSchema],
  documents: [documentSchema],
  profilePictureUrl: { type: String, default: "/Roshan.jpg" },
});

export default mongoose.models.Dashboard ||
  mongoose.model("Dashboard", DashboardSchema);
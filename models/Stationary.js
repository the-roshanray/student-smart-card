import mongoose from "mongoose";

const StationaryTransactionSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    ref: "AddStudent",
  },
  studentName: {
    type: String,
    required: true,
  },
  course: { type: String },
  department: { type: String },
  items: [
    {
      code: { type: String },
      name: { type: String },
      quantity: { type: Number },
      amount: { type: Number },
    },
  ],
  totalAmount: { type: Number },
  transactionDate: { type: Date, default: Date.now },
});

export default mongoose.models.StationaryTransaction ||
  mongoose.model("StationaryTransaction", StationaryTransactionSchema);

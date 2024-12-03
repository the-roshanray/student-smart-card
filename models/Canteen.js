import mongoose from "mongoose";

const CanteenTransactionSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    ref: "AddStudent",
  },
  studentName: {
    type: String,
    required: true,
  },
  course: String,
  department: String,
  items: [
    {
      code: String,
      name: String,
      plate: Number,
      amount: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.CanteenTransaction ||
  mongoose.model("CanteenTransaction", CanteenTransactionSchema);

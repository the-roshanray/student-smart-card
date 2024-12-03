import mongoose from "mongoose";

const issuedBookSchema = new mongoose.Schema({
  code: { type: String },
  name: { type: String },
  issueDate: { type: Date },
  dueDate: { type: Date },
});

const returnedBookSchema = new mongoose.Schema({
  code: { type: String },
  name: { type: String },
  dueDate: { type: Date },
  fine: { type: Number },
});

const LibraryTransactionSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    ref: "AddStudent",
  },
  studentName: {
    type: String,
    required: true,
  },
  course: {
    type: String,
  },
  department: {
    type: String,
  },
  issue: [issuedBookSchema],
  return: [returnedBookSchema],
  totalAmount: { type: Number },
  transactionDate: { type: Date, default: Date.now },
});

export default mongoose.models.LibraryTransaction || mongoose.model("LibraryTransaction", LibraryTransactionSchema);

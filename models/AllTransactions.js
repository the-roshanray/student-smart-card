import mongoose from "mongoose";

const AllTransactionsSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
  place: {
    type: String, 
    required: true,
  },
});

export default mongoose.models.AllTransactions ||
  mongoose.model("AllTransactions", AllTransactionsSchema);

import { v4 as uuidv4 } from "uuid";
import connectDB from "@/Database/connectDB";
import Canteen from "@/models/Canteen";
import Stationary from "@/models/Stationary";
import Library from "@/models/Library";
import AllTransactions from "@/models/AllTransactions";

import crypto from "crypto";

const generateTransactionId = (prefix) => {
  const randomId = crypto
    .randomBytes(6)
    .toString("hex")
    .toUpperCase()
    .slice(0, 8);
  return `${prefix}${randomId}`;
};

export async function GET(req) {
  try {
    await connectDB();

    const canteenTransactions = await Canteen.find({});
    const stationaryTransactions = await Stationary.find({});
    const libraryTransactions = await Library.find({});

    const formattedTransactions = [
      ...canteenTransactions.map((txn) => ({
        transactionId: txn.transactionId || generateTransactionId(""),
        amount: txn.totalAmount,
        date: txn.transactionDate,
        place: "Canteen",
      })),
      ...stationaryTransactions.map((txn) => ({
        transactionId: txn.transactionId || generateTransactionId(""),
        amount: txn.totalAmount,
        date: txn.transactionDate,
        place: "Stationary",
      })),
      ...libraryTransactions.map((txn) => ({
        transactionId: txn.transactionId || generateTransactionId(""),
        amount: txn.totalAmount,
        date: txn.transactionDate,
        place: "Library",
      })),
    ];

    // Use bulkWrite for efficient upsert operations
    const bulkOperations = formattedTransactions.map((txn) => ({
      updateOne: {
        filter: { transactionId: txn.transactionId },
        update: { $set: txn },
        upsert: true,
      },
    }));

    await AllTransactions.bulkWrite(bulkOperations);

    return new Response(
      JSON.stringify({ success: true, transactions: formattedTransactions }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

import crypto from "crypto";
import { NextResponse } from "next/server";
import connectDB from "@/Database/connectDB";
import AddStudent from "@/models/AddStudent";

export async function POST(req) {
  await connectDB();

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      rollNumber,
      amount,
    } = await req.json();

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !rollNumber ||
      typeof amount === "undefined"
    ) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      await AddStudent.findOneAndUpdate(
        { rollNumber },
        { $inc: { balance: amount } },
        { new: true }
      );

      return NextResponse.json(
        { success: true, message: "Payment verified" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed", error: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function POST(req) {
  const { contactNumber, otp } = await req.json();

  if (!contactNumber || !otp) {
    return NextResponse.json({ success: false, message: "Contact number and OTP are required" }, { status: 400 });
  }

  try {
    
    const storedOtp = await redis.get(`otp:${contactNumber}`);

    if (storedOtp && storedOtp === otp) {
      
      await redis.del(`otp:${contactNumber}`);
      return NextResponse.json({ success: true, message: "OTP verified successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ success: false, message: "Failed to verify OTP" }, { status: 500 });
  }
}
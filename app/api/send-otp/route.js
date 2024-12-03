import { NextResponse } from "next/server";
import twilio from "twilio";
import Redis from "ioredis";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const redis = new Redis(process.env.REDIS_URL);

export async function POST(req) {
  const { contactNumber } = await req.json();

  if (!contactNumber) {
    return NextResponse.json({ success: false, message: "Contact number is required" }, { status: 400 });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.setex(`otp:${contactNumber}`, 300, otp);

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: contactNumber,
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
  }
} 
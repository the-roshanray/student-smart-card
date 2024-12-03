import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { userId, password, email } = await req.json();

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Account Credentials",
    text: `Hello,\n\nYour account has been created successfully.\n\nUserID: ${userId}\nPassword: ${password}\n\nPlease keep these details secure.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Error sending email", error: error.message },
      { status: 500 }
    );
  }
};

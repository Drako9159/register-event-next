import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendCodeMail } from "@/lib/nodemailer";
import { generateToken } from "@/lib/jwt";

function generateRandomCode(): string {
  const randomDecimal = Math.random();
  const randomNumber = Math.floor(randomDecimal * 100000);
  const randomCode = randomNumber.toString().padStart(5, "0");
  return randomCode;
}

export async function POST(request: any) {
  const { email } = await request.json();
  if (!email)
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (!userFound)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const code = generateRandomCode();
    //const hashedToken = await bcrypt.hash(code, 12);
    const tokenSigned = generateToken(code);
    await User.findOneAndUpdate(
      { email: email },
      { $set: { confirmationToken: tokenSigned }, new: true }
    );
    sendCodeMail(email, code);
    return NextResponse.json({ message: "Token updated" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

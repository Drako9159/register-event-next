import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validateToken } from "@/lib/jwt";

export async function POST(request: any) {
  const { email, token } = await request.json();
  if (!email)
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  if (!token)
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (!userFound)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const tokenDecoded = validateToken(userFound.resetPasswordToken);
    if (!tokenDecoded)
      return NextResponse.json(
        { message: "Reset password token expired" },
        { status: 401 }
      );
    // const codeMatch = await bcrypt.compare(code, userFound.confirmationToken);
    // if (!codeMatch)
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const tokenMatch = token === tokenDecoded;
    if (!tokenMatch)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    return NextResponse.json({ message: "Token updated" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

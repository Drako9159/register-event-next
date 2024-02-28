import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validateToken } from "@/lib/jwt";

export async function POST(request: any) {
  const { email, code } = await request.json();
  if (!email)
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  if (!code)
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (!userFound)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const tokenDecoded = validateToken(userFound.confirmationToken);
    if (!tokenDecoded)
      return NextResponse.json(
        { message: "Confirmation expired" },
        { status: 401 }
      );
    // const codeMatch = await bcrypt.compare(code, userFound.confirmationToken);
    // if (!codeMatch)
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const tokenMatch = code === tokenDecoded;
    if (!tokenMatch)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await User.findOneAndUpdate(
      { email: email },
      { $set: { confirmed: true }, new: true }
    );
    return NextResponse.json({ message: "Token updated" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

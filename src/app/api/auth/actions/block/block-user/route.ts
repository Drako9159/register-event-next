import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const { email } = await request.json();
  if (!email)
    return NextResponse.json({ message: "Email is required" }, { status: 400 });

  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (!userFound)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    await User.findOneAndUpdate(
      { email: email },
      { $set: { blocked: true }, new: true }
    );
    return NextResponse.json({ message: "User unlocked" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: any) {
  const { name, password, email } = await request.json();
  if (!password || password < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }
  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (userFound) {
      return (
        NextResponse.json({ message: "Email already exist" }), { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name,
    });
    const savedUser = await user.save();
    return NextResponse.json({
      _id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

import { generateCryptoKey } from "@/lib/cryptoGenerator";
import { generateKey } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import { validateIsAdminUser } from "@/middlewares/validateUserRoleNext";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: any) {


  // const key = generateCryptoKey()
  // const keyToken = generateKey()
  // console.log(keyToken)


  const validate = await validateIsAdminUser(req);
  if (!validate)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { email } = await req.json();
  if (!email)
    return NextResponse.json({ message: "Email is required" }, { status: 400 });

  try {
    await connectDB();
    const userFound = await User.findOne({ email });
    if (!userFound)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    await User.findOneAndUpdate(
      { email: email },
      { $set: { blocked: false }, new: true }
    );
    return NextResponse.json({ message: "User unlocked" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

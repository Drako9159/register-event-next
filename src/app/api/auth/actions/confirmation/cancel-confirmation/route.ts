import { connectDB } from "@/lib/mongodb";
import { validateIsAdminUser } from "@/middlewares/validateUserRoleNext";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: any) {
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
      { $set: { confirmed: false }, new: true }
    );
    return NextResponse.json({ message: "Confirmation cancelled" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

import { connectDB } from "@/lib/mongodb";
import { validateIsAdminUser } from "@/middlewares/validateUserRoleNext";
import User from "@/models/user";
import { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { GetTokenParams, getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any, res: NextApiResponse) {
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
      { $set: { blocked: true }, new: true }
    );
    return NextResponse.json({ message: "User blocked" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

import { generateCryptoKey } from "@/lib/cryptoGenerator";
import { generateDateExpire, validateIfExpired } from "@/lib/generateDateExpire";
import { generateTokenQr } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import { validateIsAdminUser } from "@/middlewares/validateUserRoleNext";
import QrCode from "@/models/qr";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { userId } = await req.json();
  if (!userId)
    return NextResponse.json({ message: "Id is required" }, { status: 400 });

  try {
    await connectDB();
    const userFound = await User.findOne({ _id: userId });
    if (!userFound)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    //const qrFound = await QrCode.findOne({ user: userId })
    await QrCode.deleteOne({ user: userId })

    const securityKey = generateCryptoKey();
    const expirationDate = generateDateExpire();

    const qr = new QrCode({ user: userId, securityKey, expirationDate });
    const savedQr = await qr.save();

    const data = {
      user: savedQr.user,
      securityKey: savedQr.securityKey,
      expirationDate: savedQr.expirationDate,
      usageCount: savedQr.usageCount,
    };
    const token = generateTokenQr(data);
    return NextResponse.json({ token });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

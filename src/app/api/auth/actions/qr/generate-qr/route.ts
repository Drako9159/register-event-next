import { generateCryptoKey } from "@/lib/cryptoGenerator";
import {
  generateDateExpire,
  validateIfExpired,
} from "@/lib/generateDateExpire";
import { generateTokenQr } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import {
  validateIsAdminUser,
  validateIsPublicUser,
} from "@/middlewares/validateUserRoleNext";
import QrCode from "@/models/qr";
import User from "@/models/user";
import { wrap } from "module";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const validate = validateIsPublicUser(req);
  if (!validate)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { userId } = await req.json();
  if (!userId)
    return NextResponse.json({ message: "Id is required" }, { status: 400 });

  try {
    await connectDB();
    const userFound = await User.findOne({ _id: userId });
    if (!userFound)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    const qrFound = await QrCode.findOne({ user: userId });

    if (qrFound) {
      if (!validateIfExpired(qrFound.expirationDate)) {
        return NextResponse.json({ token: qrFound.tokenData });
      }
    }

    await QrCode.deleteMany({ user: userId });

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

    await QrCode.findOneAndUpdate(
      { user: userId },
      { $set: { tokenData: token }, new: true }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

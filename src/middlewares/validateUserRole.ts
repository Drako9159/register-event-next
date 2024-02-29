import { JwtPayload } from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

export function userAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) {
  try {
    const { access_token }: any = req.cookies;
    const tokenHeader: string = req.headers.authorization?.split(
      " "
    )[1] as string;
    let token = access_token ? access_token : tokenHeader;
    if (!token) {
      return NextResponse.json(
        { message: "Credentials required" },
        { status: 401 }
      );
    }
    const auth: string | JwtPayload = jwt.verify(token, JWT_SECRET!);
    const role = (auth as { role: string }).role;
    if (role !== "admin") {
      return NextResponse.json(
        { message: "High permits are required" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Access denied" }, { status: 401 });
  }
}

export function userPublic(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) {
  try {
    const { access_token }: any = req.cookies;
    const tokenHeader: string = req.headers.authorization?.split(
      " "
    )[1] as string;
    let token = access_token ? access_token : tokenHeader;
    if (!token) {
      return NextResponse.json(
        { message: "Credentials required" },
        { status: 401 }
      );
    }
    const auth: string | JwtPayload = jwt.verify(token, JWT_SECRET!);
    const role = (auth as { role: string }).role;
  } catch (error) {
    return NextResponse.json({ message: "Access denied" }, { status: 401 });
  }
}

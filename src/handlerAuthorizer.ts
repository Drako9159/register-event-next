import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const { JWT_SECRET } = process.env;

export default async function handlerAuthorizer(
  req: NextApiRequest,
  res: NextApiRequest
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new Error("No toke provider");
    }
    const decodedToken: { role: string } = jwt.verify(
      token,
      JWT_SECRET!
    ) as any;
    if ((decodedToken.role = "admin")) {
      return NextResponse.json({ message: "Access Available" });
    } else {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}

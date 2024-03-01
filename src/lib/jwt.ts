import { sign, verify } from "jsonwebtoken";

const { JWT_SECRET } = process.env;

// token is valid for 2hrs
export function generateToken(token: string): string {
  const expiration = Math.floor(Date.now() / 1000) + 2 * 60 * 60;
  const signed = sign({ token, exp: expiration }, JWT_SECRET!);
  return signed;
}

export function validateToken(token: string): string | null {
  try {
    const decoded = verify(token, JWT_SECRET!) as { token: string };
    return decoded.token;
  } catch (error) {
    return null;
  }
}

export function generateKey(): string {
  const newKey = sign({}, JWT_SECRET!);
  return newKey;
}

export function generateTokenQr(dataQr: any): string | null {
  try {
    const token = sign({ data: dataQr }, JWT_SECRET!, { expiresIn: "4h" });
    return token;
  } catch (error) {
    console.error("Error in generate token", error);
    return null;
  }
}

export function decodeTokenQr(token: string): any | null {
  try {
    const dataDecoded = verify(token, JWT_SECRET!);
    return dataDecoded;
  } catch (error) {
    console.error("Error in decode token", error);
    return null;
  }
}

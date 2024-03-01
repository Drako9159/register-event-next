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

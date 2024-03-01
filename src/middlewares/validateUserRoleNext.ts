import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

type UserRole = "public" | "admin";

enum UserRoleEnum {
  Admin = "admin",
  Public = "public",
}

export async function validateIsPublicUser(req: any): Promise<boolean> {
  const token = await getToken({ req });
  if (!token) return false;
  const role: UserRole = (token.user as { role: string }).role as UserRole;
  if (role !== UserRoleEnum.Admin && role !== UserRoleEnum.Public) return false;
  return true;
}

export async function validateIsAdminUser(req: any): Promise<boolean> {
  const token = await getToken({ req });
  if (!token) return false;
  const role: UserRole = (token.user as { role: string }).role as UserRole;
  if (role !== UserRoleEnum.Admin) return false;
  return true;
}

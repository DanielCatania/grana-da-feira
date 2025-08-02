import jwt from "@/lib/jwt";
import { DecodedAdminToken } from "@/types";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

export default async function checkIsAdmin() {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token) as DecodedAdminToken;

  if (!decoded || !decoded.adminAccess) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const isValidAdmin = await bcrypt.compare(
    process.env.ADMIN_EMAIL! + process.env.ADMIN_PASSWORD!,
    decoded.adminAccess
  );

  if (!isValidAdmin) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return true;
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "@/lib/jwt";
import bcrypt from "bcrypt";
import { DecodedAdminToken } from "@/types";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  try {
    if (!token) throw new Error("No Token");

    const decoded = jwt.verify(token!) as DecodedAdminToken;

    if (!decoded.adminAccess) throw new Error("No Admin");

    const isValidAdmin = await bcrypt.compare(
      process.env.ADMIN_EMAIL! + process.env.ADMIN_PASSWORD!,
      decoded.adminAccess
    );

    if (!isValidAdmin) throw new Error("No Admin");

    return <>{children}</>;
  } catch (error) {
    const msg = (error as Error).message;
    if (msg === "No Token") redirect("/login");
    if (msg === "No Admin") redirect("/");

    throw error;
  }
}

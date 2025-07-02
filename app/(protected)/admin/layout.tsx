import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "@/lib/jwt";
import bcrypt from "bcrypt";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  try {
    if (!token) throw new Error("No Token");

    interface DecodedToken {
      adminAccess: string;
      [key: string]: unknown;
    }
    const decoded = jwt.verify(token!) as DecodedToken;

    if (!decoded.adminAccess) throw new Error("No Admin");

    console.log(process.env.ADMIN_EMAIL! + process.env.ADMIN_PASSWORD!);
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

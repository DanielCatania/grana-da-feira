import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "@/lib/jwt";
import { IUserToken } from "@/type/user";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  try {
    if (!token) throw new Error("No Token");

    const decoded = jwt.verify(token) as IUserToken;

    if (decoded.passwordDefault) throw new Error("Password Default");

    return <>{children}</>;
  } catch (error) {
    const msg = (error as Error).message;
    if (msg === "No Token") redirect("/login");
    if (msg === "Password Default") redirect("/change-password");
    throw error;
  }
}

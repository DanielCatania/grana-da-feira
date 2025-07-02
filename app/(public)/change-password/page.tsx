import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "@/lib/jwt";
import { IUserToken } from "@/types";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePassword() {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  try {
    if (!token) throw new Error("No Token");

    const decoded = jwt.verify(token) as IUserToken;

    if (decoded.adminAccess) {
      redirect("/admin");
    }

    return <ChangePasswordForm passwordDefault={decoded.birthdate} />;
  } catch (error) {
    const msg = (error as Error).message;
    if (msg === "No Token") redirect("/login");
    throw error;
  }
}

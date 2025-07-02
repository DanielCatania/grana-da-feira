import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "@/lib/jwt";
import { IUserToken } from "@/types";

export default async function Home() {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  if (token) {
    const decoded = jwt.verify(token) as IUserToken;
    if (decoded.passwordDefault) {
      redirect("/change-password");
    } else {
      redirect("/dashboard");
    }
  }

  redirect("/login");
}

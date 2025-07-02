import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "@/lib/jwt";
import { IUserToken } from "@/type/user";

export default async function ChangePassword() {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  try {
    if (!token) throw new Error("No Token");

    const decoded = jwt.verify(token) as IUserToken;

    console.log(decoded.birthdate);

    return <div>Mudar Senha</div>;
  } catch (error) {
    const msg = (error as Error).message;
    if (msg === "No Token") redirect("/login");
    throw error;
  }
}

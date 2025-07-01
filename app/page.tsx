import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "@/lib/jwt";

export default async function App() {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  try {
    if (!token) throw new Error("No token");

    const decoded = jwt.verify(token) as {
      id: string;
      name: string;
      exp: number;
      iat: number;
    };

    console.log("Decoded token:", decoded);

    return (
      <div className="text-4xl text-primary-100">Bem-vindo, {decoded.name}</div>
    );
  } catch {
    redirect("/login");
  }
}

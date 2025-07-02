import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "@/lib/jwt";

export default async function App() {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  try {
    if (!token) throw new Error("No Token");

    const decoded = jwt.verify(token) as {
      id: string;
      name: string;
      exp: number;
      iat: number;
      passwordDefault: boolean;
    };

    if (decoded.passwordDefault) throw new Error("Password Default");

    return (
      <div className="w-full min-h-screen flex-col flex items-center justify-center">
        <main className="w-2/5 min-w-60">
          <div>
            <p className="text-2xl">
              Olá,{" "}
              <span className="capitalize text-primary-100">
                {decoded.name}
              </span>
              !
            </p>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.log(error);
    if ((error as Error).message === "No Token") redirect("/login");
    if ((error as Error).message === "Password Default")
      redirect("/change-password");
  }
}

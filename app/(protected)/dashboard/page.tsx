import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import jwt from "@/lib/jwt";
import Link from "next/link";
import { IUser, IUserToken } from "@/type/user";
import { redirect } from "next/navigation";
import Image from "next/image";
import Box from "@/components/Box";

export default async function Dashboard() {
  const supabase = await createClient();

  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;

  const decoded = jwt.verify(token!) as IUserToken;

  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", decoded.id);

  if (error) {
    console.error("Error fetching user data:", error);
    redirect("/login");
  }

  const user = data[0] as IUser;

  return (
    <div className="w-full min-h-screen flex-col flex items-center justify-center">
      <main className="w-2/5 min-w-60">
        <section className="flex justify-between items-center text-xs">
          <Image
            src="/Icon.png"
            alt="Ícone de notas de dinheiro voando."
            width={120}
            height={120}
            className="w-1/5 min-w-16"
          />
          <p>
            Olá,{" "}
            <span className="text-primary-100 capitalize">{user.name}</span>
          </p>
          <Link href="/change-password" className="text-primary-100 underline">
            Trocar senha
          </Link>
        </section>

        <Box title="Saldo">
          <h2 className="text-4xl text-primary-100 font-extrabold">
            ${user.balance}{" "}
            <span className="text-2xl text-primary-150">Cults</span>
          </h2>
        </Box>
      </main>
    </div>
  );
}

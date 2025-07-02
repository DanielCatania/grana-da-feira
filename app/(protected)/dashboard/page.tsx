import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import jwt from "@/lib/jwt";
import { IUser, IUserToken } from "@/type/user";
import { redirect } from "next/navigation";
import Image from "next/image";
import Box from "@/components/Box";
import Button from "@/components/Button";

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

  const { data: transactions, error: transactionError } = await supabase
    .from("Transaction")
    .select("*")
    .eq("userid", user.id);

  if (transactionError) {
    console.error("Error fetching trasactions data:", error);
    redirect("/login");
  }

  return (
    <div className="w-full min-h-screen flex-col flex items-center justify-center">
      <main className="w-2/5 min-w-64 flex flex-col items-center">
        <section className="flex justify-between items-center text-xl w-full">
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
        </section>

        <Box title="Saldo">
          <h2 className="text-4xl text-primary-100 font-extrabold">
            ${user.balance}{" "}
            <span className="text-2xl text-primary-150">Cults</span>
          </h2>
        </Box>
        <Box title="Extrato">
          <ul className="overflow-y-scroll max-h-60">
            {transactions.map((transaction) => {
              const isDonation = transaction.type === "DONATION";

              const formatDate = (dateString: string) => {
                const date = new Date(dateString);
                const day = String(date.getDate()).padStart(2, "0");
                const mounth = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                return `${day}/${mounth}/${year}`;
              };
              return (
                <li
                  key={transaction.id}
                  className={
                    isDonation ? "text-primary-100" : "text-secondary-150"
                  }
                >
                  <h3 className="font-extrabold">
                    {isDonation ? "💸 Doação" : "🛍️ Compra"}:
                  </h3>
                  <p>
                    {isDonation ? "+" : "-"}
                    {transaction.amount} Cults - {transaction.description} em{" "}
                    {formatDate(transaction.date)}
                  </p>
                </li>
              );
            })}
          </ul>
        </Box>

        <Button>Gerar ID de Compra</Button>
      </main>
    </div>
  );
}

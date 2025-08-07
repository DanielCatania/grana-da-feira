import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import Link from "next/link";

import Box from "@/components/Box";
import Button from "@/components/Button";

import Header from "@/components/Header";
import { capitalize } from "@/utils/textFormatter";
import getUser from "@/utils/getUser";

export default async function Dashboard() {
  const user = await getUser();

  const supabase = await createClient();

  const { data: transactions, error: transactionError } = await supabase
    .from("Transaction")
    .select("*")
    .eq("userid", user.id);

  if (transactionError) {
    console.error("Error fetching trasactions data:", transactionError);
    redirect("/login");
  }

  return (
    <div className="w-full min-h-screen flex-col flex items-center justify-center">
      <Header>
        <p>
          Olá, <span className="text-primary-100 capitalize">{user.name}</span>
        </p>
      </Header>
      <main className="w-2/5 min-w-64 flex flex-col items-center">
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
                    {transaction.amount} Cults -{" "}
                    {capitalize(transaction.description)} em{" "}
                    {formatDate(transaction.date)}
                  </p>
                </li>
              );
            })}
          </ul>
        </Box>

        <Button>
          <Link href="/dashboard/purchase-id" className="block w-full h-full">
            Gerar ID de Compra
          </Link>
        </Button>
      </main>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import BackButton from "@/components/Button/BackButton";
import Box from "@/components/Box";
import Transaction, { transactionContent } from "./components/Transaction";
import { PostgrestError } from "@supabase/supabase-js";

export default async function Records() {
  const supabase = await createClient();

  const { data: transactions, error: transactionError } = (await supabase.from(
    "Transaction"
  ).select(`
    *,
    user:User(id, name)
  `)) as { data: transactionContent[]; error: PostgrestError | null };

  if (transactionError !== null) {
    console.error("Error fetching trasactions data:", transactionError);
    redirect("/admin");
  }

  const donations = transactions.filter(
    (transaction) => transaction.type === "DONATION"
  );
  const purchases = transactions.filter(
    (transaction) => transaction.type === "PURCHASE"
  );
  const totalDonations = donations.reduce(
    (total, donation) => total + donation.amount,
    0
  );
  const totalPurchases = purchases.reduce(
    (total, purchase) => total + purchase.amount,
    0
  );

  return (
    <>
      <Header>
        <BackButton href="/admin" />
      </Header>
      <Box title={`Registros de Doações (${donations.length})`}>
        <h2 className="text-primary-150 text-2xl">
          Valor total de créditos gerados:{" "}
          <span className="font-bold">${totalDonations}</span>
        </h2>
        <ul className="overflow-y-scroll max-h-60">
          {donations.map((donation) => (
            <Transaction key={donation.id} content={donation} />
          ))}
        </ul>
      </Box>
      <Box title={`Registros de Vendas (${purchases.length})`}>
        <h2 className="text-secondary-150 text-2xl">
          Valor total de créditos gastos:{" "}
          <span className="font-bold">${totalPurchases}</span>
        </h2>
        <ul className="overflow-y-scroll max-h-60">
          {purchases.map((purchase) => (
            <Transaction key={purchase.id} content={purchase} />
          ))}
        </ul>
      </Box>
    </>
  );
}

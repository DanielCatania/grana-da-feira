import { createClient } from "@/lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import BackButton from "@/components/Button/BackButton";
import TransactionsList from "./components/TransactionsList";
import { transactionContent } from "./components/TransactionsList/type";

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

  return (
    <>
      <Header>
        <BackButton href="/admin" />
      </Header>
      <TransactionsList transactions={donations} isDonation={true} />
      <TransactionsList transactions={purchases} />
    </>
  );
}

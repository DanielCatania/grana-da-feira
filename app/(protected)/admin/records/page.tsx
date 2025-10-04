import { createClient } from "@/lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import Box from "@/components/Box";
import BackButton from "@/components/Button/BackButton";
import TransactionsList from "./components/TransactionsList";
import { transactionContent } from "./components/TransactionsList/type";

export default async function Records() {
  const supabase = await createClient();

  const [transactionsResponse, purchaseCountResponse, usersCountResponse] =
    await Promise.all([
      supabase
        .from("Transaction")
        .select(
          `
          *,
          user:User(id, name)
        `
        )
        .order("date", { ascending: false }),

      supabase
        .from("PurchaseId")
        .select("value", { count: "exact", head: true }),

      supabase
        .from("User")
        .select("id", { count: "exact", head: true })
        .eq("passworddefault", false),
    ]);

  const { data: transactions, error: transactionError } =
    transactionsResponse as {
      data: transactionContent[];
      error: PostgrestError | null;
    };

  const { count: purchaseIdsCount, error: purchaseError } =
    purchaseCountResponse;
  const { count: initialAccessUsersCount, error: usersCountError } =
    usersCountResponse;

  if (transactionError || usersCountError || purchaseError) {
    console.error(
      "Error fetching data:",
      transactionError,
      usersCountError,
      purchaseError
    );
    redirect("/admin");
  }

  const donations =
    transactions.filter((transaction) => transaction.type === "DONATION") ?? [];
  const purchases =
    transactions.filter((transaction) => transaction.type === "PURCHASE") ?? [];

  return (
    <>
      <Header>
        <BackButton href="/admin" />
      </Header>
      <h1 className="text-3xl font-extrabold text-primary-150 mb-4">
        Recordes da plataforma
      </h1>
      <Box title="Total de Usuários com Acesso Inicial">
        <p className="text-primary-100 text-justify font-bold">
          <span className="font-extrabold text-primary-150">
            {initialAccessUsersCount} usuários
          </span>{" "}
          já acessaram o sistema com a senha padrão.
        </p>
      </Box>
      <TransactionsList transactions={donations} isDonation={true} />
      <Box title="Total de IDs de Compra Gerados">
        <p className="text-primary-100 text-justify font-bold">
          <span className="font-extrabold text-primary-150">
            {purchaseIdsCount} IDs de compra
          </span>{" "}
          foram gerados até agora.
        </p>
      </Box>
      <TransactionsList transactions={purchases} />
    </>
  );
}

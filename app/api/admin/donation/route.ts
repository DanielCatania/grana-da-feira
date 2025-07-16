import { createClient } from "@/lib/supabase/server";
import checkIsAdmin from "@/utils/isAdmin";

export async function POST(request: Request) {
  const isAdmin = await checkIsAdmin();

  if (isAdmin !== true) {
    return isAdmin;
  }

  const body = await request.json();
  const { description, credits, userId } = body;

  if (!description || !credits || credits <= 0 || !userId) {
    return new Response(
      JSON.stringify({
        error: "Por favor, preencha todos os campos corretamente.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const supabase = await createClient();

  const { data: transactionData, error: transactionError } = await supabase
    .from("Transaction")
    .insert([
      { type: "DONATION", userid: userId, description, amount: credits },
    ])
    .select("*");

  if (
    transactionError ||
    !transactionData ||
    (Array.isArray(transactionData) && transactionData.length === 0)
  ) {
    return new Response(
      JSON.stringify({ error: "Erro ao registrar a transação." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { data: currentUser, error: currentUserError } = await supabase
    .from("User")
    .select("balance")
    .eq("id", userId)
    .single();

  if (currentUserError || !currentUser) {
    await supabase.from("Transaction").delete().eq("id", transactionData[0].id);

    return new Response(JSON.stringify({ error: "Usuário não encontrado." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  const newCredits = (currentUser.balance || 0) + credits;

  const { data: userData, error: userError } = await supabase
    .from("User")
    .update({ balance: newCredits })
    .eq("id", userId)
    .select();

  const updatedUser = userData?.[0];

  if (userError || !updatedUser) {
    await supabase.from("Transaction").delete().eq("id", transactionData[0].id);

    return new Response(
      JSON.stringify({ error: "Erro ao atualizar os créditos do usuário." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Doação de ${description} que gerou ${credits} cults registrada para o usuário ${updatedUser.name}`,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

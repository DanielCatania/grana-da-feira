import { createClient } from "@/lib/supabase/server";
import checkIsAdmin from "@/utils/isAdmin";
import { purchaseIdSchema } from "@/validation/purchaseIdSchema";

export async function POST(request: Request) {
  const isAdmin = await checkIsAdmin();

  if (isAdmin !== true) {
    return isAdmin;
  }

  const { id, description, amount } = (await request.json()) as {
    id: string;
    description: string;
    amount: number;
  };

  if (!id || !description || !amount) {
    return new Response(
      JSON.stringify({
        error: "Faltam dados na requisição, é requerido: id, descrição e valor",
      }),
      { status: 400 }
    );
  }

  if (isNaN(amount) || amount < 0) {
    return new Response(
      JSON.stringify({
        error: "Valor da transação é inválido!",
      }),
      { status: 400 }
    );
  }

  const idIsValid = purchaseIdSchema.safeParse(id);

  if (!idIsValid.success) {
    return new Response(
      JSON.stringify({
        error: `Id de Compra Inválido:\n ${idIsValid.error.issues
          .map((issue) => issue.message)
          .join("\n ")}`,
      }),
      { status: 401 }
    );
  }

  const supabase = await createClient();

  const { data: idData } = await supabase
    .from("PurchaseId")
    .select("userid, used")
    .eq("value", id)
    .single();

  if (!idData) {
    return new Response(
      JSON.stringify({
        error:
          "ID de Compra não encontrado! Por favor gere um ID de compra existente no seu dashboard!",
      }),
      { status: 404 }
    );
  }

  if (idData.used) {
    return new Response(
      JSON.stringify({
        error:
          "O ID de Compra já foi usado! Por favor gere um novo ID de compra no seu dashboard!",
      }),
      {
        status: 403,
      }
    );
  }

  const { data: user } = await supabase
    .from("User")
    .select("id, balance, name")
    .eq("id", idData.userid)
    .single();

  if (!user) {
    return new Response(
      JSON.stringify({
        error:
          "ID de Compra inválido! Este ID não é atrelado a nenhum usuário do sistema, por favor gere um ID de Compra válido em seu dashboard!",
      }),
      { status: 404 }
    );
  }

  if (user.balance - amount < 0) {
    return new Response(
      JSON.stringify({
        error: `O usuário não tem saldo suficiente para realizar essa transação - com apenas $${user.balance} cults de saldo, utilize outros métodos de pagamento`,
      }),
      {
        status: 403,
      }
    );
  }

  const { data: transaction, error: transactionError } = await supabase
    .from("Transaction")
    .insert([
      {
        type: "PURCHASE",
        userid: user.id,
        description,
        amount,
      },
    ])
    .select("*")
    .single();

  if (!transaction || transactionError) {
    console.error(transaction, transactionError);

    return new Response(
      JSON.stringify({
        error:
          "Não foi possível concluir essa transação, se o erro persistir procure o suporte!",
      }),
      { status: 500 }
    );
  }

  const { data: updatedUser, error: updateUserError } = await supabase
    .from("User")
    .update({ balance: user.balance - amount })
    .eq("id", user.id)
    .select("balance")
    .single();

  const { error: updateIdDataError } = await supabase
    .from("PurchaseId")
    .update({ used: true })
    .eq("value", id);

  if (updateUserError || updateIdDataError) {
    await supabase.from("Transaction").delete().eq("id", transaction.id);

    console.error("[UPDATE USER]", updateUserError, updatedUser);
    console.error("[UPDATE ID]", updateIdDataError);

    return new Response(
      JSON.stringify({
        error:
          "Não foi possível concluir essa transação, se o erro persistir procure o suporte!",
      }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({
      message: `Venda de ${transaction.description} no valor de $${transaction.amount} cults para o ID de Compra ${id} realizada com sucesso!\n O usuário ${user.name} tem um saldo atualizado de ${updatedUser.balance} cults!
    `,
    })
  );
}

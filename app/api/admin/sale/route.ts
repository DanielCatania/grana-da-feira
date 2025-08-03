import { createClient } from "@/lib/supabase/server";
import checkIsAdmin from "@/utils/isAdmin";
import { purchaseIdSchema } from "@/validation/purchaseIdSchema";
import { PostgrestError } from "@supabase/supabase-js";

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
        message:
          "❌ Faltam dados na requisição, é requerido: id, descrição e valor",
        error: { id: !id, description: !description, amount: !amount },
      }),
      { status: 400 }
    );
  }

  if (isNaN(amount) || amount <= 0) {
    return new Response(
      JSON.stringify({
        message: "❌ Valor da transação é inválido!",
        error: amount,
      }),
      { status: 400 }
    );
  }

  const idIsValid = purchaseIdSchema.safeParse(id);

  if (!idIsValid.success) {
    return new Response(
      JSON.stringify({
        message: `Id de Compra Inválido:\n ${idIsValid.error.issues
          .map((issue) => issue.message)
          .join("\n ")}`,
        error: idIsValid,
      }),
      { status: 401 }
    );
  }

  const supabase = await createClient();

  const { data, error } = (await supabase
    .rpc("purchase", {
      purchaseid: id,
      amount,
      description,
    })
    .single()) as {
    data: {
      name: string;
      balance: number;
    };
    error: PostgrestError | null;
  };

  if (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message:
          "❌ Não foi possível concluir essa transação, se o erro persistir procure o suporte!",
        error,
      }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({
      message: `✅ Venda de *${description}* no valor de 💰 *$${amount} cults* para o ID de Compra 🆔 *${id}* realizada com sucesso!\n\n👤 Usuário: *${data.name}*\n💳 Saldo atualizado: *${data.balance} cults* 🎉`,
    })
  );
}

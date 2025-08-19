import { createClient } from "@/lib/supabase/server";
import checkIsAdmin from "@/utils/isAdmin";
import { PostgrestError } from "@supabase/supabase-js";

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
        error: "❌ Por favor, preencha todos os campos corretamente.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const supabase = await createClient();

  const { data, error } = (await supabase
    .rpc("donate", {
      uid: userId,
      credits,
      description,
    })
    .single()) as { data: { name: string }; error: PostgrestError | null };

  if (error) {
    return new Response(
      JSON.stringify({
        message:
          "❌ Não foi possível concluir a doação, se o erro persistir contate o suporte!",
        error,
      })
    );
  }

  return new Response(
    JSON.stringify({
      message: `🎁 Doação de *${description}* registrada com sucesso!\n✨ Gerou *${credits} Créditos* para o usuário 👤 *${data.name}*! 🎉`,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

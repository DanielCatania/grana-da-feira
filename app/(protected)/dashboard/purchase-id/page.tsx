import Box from "@/components/Box";
import BackButton from "@/components/Button/BackButton";
import RefreshButton from "@/components/Button/RefreshButton";
import Header from "@/components/Header";
import QRCodeGenerator from "@/components/QRCode/QRCodeGenerator";
import { createClient } from "@/lib/supabase/server";
import getUser from "@/utils/getUser";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PurchaseIdPage() {
  const supabase = await createClient();

  const user = await getUser();

  const { data, error } = await supabase.rpc("purchase_id", {
    p_user: user.id,
  });

  if (error) {
    console.error(error);
    alert(
      "Erro ao gerar ID de compra. Se o problema persistir, entre em contato com o suporte."
    );
    return redirect("/dashboard");
  }

  const id = data;

  return (
    <div className="w-full min-h-[115vh] flex-col flex items-center justify-center">
      <Header>
        <BackButton href="/dashboard" />
      </Header>
      <main className="w-2/5 h-4/5 min-w-64 flex flex-col items-center">
        <Box title="O que é ID de compra">
          <p className="text-primary-100 text-justify font-bold">
            <span className="font-extrabold text-primary-150">
              Funciona como o seu cartão virtual temporário, exclusivo para uma
              única compra.
            </span>{" "}
            <span className="font-extrabold text-primary-150">
              Para usar basta:
            </span>{" "}
            informar o ID gerado no app ao caixa, para que ele finalize a sua
            compra.
          </p>
        </Box>
        <Box title="ID para Compra Única">
          <p className="text-primary-100 text-center font-extrabold text-5xl">
            <span>{id[0]}</span> <span>{id[1]}</span> <span>{id[2]}</span>{" "}
            <span>{id[3]}</span>
          </p>
          <QRCodeGenerator id={id} />
        </Box>
        <RefreshButton>Gerar Outro ID de Compra</RefreshButton>
      </main>
    </div>
  );
}

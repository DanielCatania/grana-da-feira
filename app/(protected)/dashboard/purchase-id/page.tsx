import Box from "@/components/Box";
import Button from "@/components/Button";
import QRCodeGenerator from "@/components/QRCode/QRCodeGenerator";
import { createClient } from "@/lib/supabase/server";
import getUser from "@/utils/getUser";
import Link from "next/link";
import { redirect } from "next/navigation";

const generatePurchaseId = () => {
  const chars = "ABCDEFGHIJKMLNOPQRSTUVWXYZ0123456789";

  let id = "";
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return id;
};

export default async function PurchaseIdPage() {
  let id: string;

  const supabase = await createClient();

  const user = await getUser();

  const { data: currentId } = (await supabase
    .from("PurchaseId")
    .select("*")
    .eq("userid", user.id)
    .eq("used", false)
    .single()) as { data: { value: string } | null };

  if (currentId) id = currentId.value;
  else {
    const registerId = async (): Promise<string> => {
      const id = generatePurchaseId();

      const { error } = await supabase.from("PurchaseId").insert({
        value: id,
        userid: user.id,
      });

      if (error && error.code === "23505") return await registerId(); // 'duplicate key value violates unique constraint "PurchaseId_pkey"'

      if (error) {
        return redirect("/dashboard");
      }

      return id;
    };

    id = await registerId();
  }

  return (
    <div className="w-full min-h-screen flex-col flex items-center justify-center">
      <Link
        href="/dashboard"
        prefetch={false}
        className="mt-4 bg-primary-100 bg-primary-200 text-white px-4 py-2 rounded absolute top-2 left-4 md:left-1/4"
      >
        Voltar
      </Link>
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
        <Button>Gerar Outro ID de Compra</Button>
      </main>
    </div>
  );
}

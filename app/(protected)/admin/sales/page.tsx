"use client";
import Input from "@/components/Input";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import SalesForm from "./components/SalesForm";
import Box from "@/components/Box";

export default function SalesMode() {
  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const [id, setId] = useState<string>(queryId || "");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  return (
    <main className="w-2/5 min-w-72 flex my-1/4 mx-auto flex-col items-center justify-evenly h-screen">
      <Link
        href="/admin"
        prefetch={false}
        className="mt-4 bg-primary-100 bg-primary-200 text-white px-4 py-2 rounded absolute top-2 left-4 md:left-1/4"
      >
        Voltar
      </Link>
      <Box title="Modo de Venda">
        {!queryId ? (
          <SalesForm
            amountState={{ value: amount, set: setAmount }}
            descriptionState={{ value: description, set: setDescription }}
          >
            <Input<string>
              type="text"
              placeholder="Digite o ID de Compra"
              state={{ value: id, set: setId }}
            />{" "}
            <Link
              href="/admin/sales/qrcode"
              className="text-primary-100 underline text-xs"
            >
              ou Ler QRcode
            </Link>
          </SalesForm>
        ) : (
          <SalesForm
            amountState={{ value: amount, set: setAmount }}
            descriptionState={{ value: description, set: setDescription }}
          >
            <p className="font-extrabold text-2xl text-primary-150">{id}</p>
            <Link
              href="/admin/sales"
              className="text-primary-100 underline text-xs"
              onClick={() => setId("")}
            >
              ou Informar outro ID de Compra
            </Link>
          </SalesForm>
        )}
      </Box>
    </main>
  );
}

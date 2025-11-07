"use client";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import SalesForm from "./components/SalesForm";
import Box from "@/components/Box";
import { purchaseIdSchema } from "@/validation/purchaseIdSchema";
import { capitalize } from "@/utils/textFormatter";
import safeFetch from "@/utils/safeFetch";
import BackButton from "@/components/Button/BackButton";
import Header from "@/components/Header";

export default function SalesMode() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const queryId = searchParams.get("id");
  const [hasQueryId, setHasQueryId] = useState(queryId !== null);
  const [id, setId] = useState<string>(hasQueryId ? queryId! : "");

  const validateId = useCallback(() => {
    const validationId = purchaseIdSchema.safeParse(id);

    if (!validationId.success) {
      alert(
        `Id de Compra Inválido:\n ${validationId.error.issues
          .map((issue) => issue.message)
          .join("\n ")}`
      );
      setId("");

      return false;
    }

    return true;
  }, [id]);

  useEffect(() => {
    const queryId = searchParams.get("id");
    setHasQueryId(queryId !== null);
    setId(queryId ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (hasQueryId) {
      const isValid = validateId();

      if (!isValid) setHasQueryId(false);
    }
  }, [hasQueryId, validateId]);

  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateId();

    if (!isValid) {
      setHasQueryId(false);

      return;
    }

    if (description === "") {
      alert("Por favor selecione um produto antes de efetuar a compra!");
      return;
    }

    if (amount <= 0) {
      alert("Por favor informe um valor maior que zero!");
      return;
    }

    const response = await safeFetch("/api/admin/sale", {
      method: "POST",
      body: JSON.stringify({
        id,
        description: capitalize(description),
        amount: amount * 2,
      }),
    });

    const data = (await response.json()) as {
      message: string;
      error?: string;
    };

    alert(data.message);

    if (data.error) {
      setId("");
      setHasQueryId(false);

      console.error(data.error);
      return;
    }

    setAmount(0);
    setDescription("");
    setHasQueryId(false);
    setId("");

    if (hasQueryId) return router.push("/admin/sales");
  };

  return (
    <>
      <Header>
        <BackButton href="/admin" />
      </Header>
      <Box title="Modo de Venda">
        <SalesForm
          amountState={{ value: amount, set: setAmount }}
          descriptionState={{ value: description, set: setDescription }}
          onSubmit={handleSubmit}
        >
          {!hasQueryId ? (
            <>
              <Input<string>
                type="text"
                placeholder="Digite o ID de Compra"
                required
                state={{ value: id, set: setId }}
                onChange={(e): string => {
                  const value = e.target.value.toUpperCase();
                  const filtered = value.replace(/[^A-Z0-9]/g, "");
                  return filtered.slice(0, 4);
                }}
              />
              <Link
                href="/admin/sales/qrcode"
                className="text-primary-100 underline text-xs mt-1"
              >
                ou Ler QRcode
              </Link>
            </>
          ) : (
            <>
              <p className="font-extrabold text-2xl text-primary-150">{id}</p>
              <br className="mt-1" />
              <Link
                href="/admin/sales"
                className="text-primary-100 underline text-xs mt-1"
                onClick={() => setId("")}
              >
                ou Informar outro ID de Compra
              </Link>
            </>
          )}
        </SalesForm>
      </Box>
    </>
  );
}

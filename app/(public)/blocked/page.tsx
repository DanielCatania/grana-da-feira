"use client";
import { useSearchParams } from "next/navigation";

export default function BlockedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const isPermanent = reason === "permanent";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
        <div className="text-5xl">{isPermanent ? "🚫" : "⏳"}</div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Acesso Bloqueado
        </h1>
        <p className="text-gray-600">
          {isPermanent ? (
            <>
              Você foi <strong>permanentemente bloqueado</strong> por abuso de
              acesso.
              <br />
              Caso ache que isso é um erro, entre em contato com o
              administrador.
            </>
          ) : (
            <>
              Você foi <strong>temporariamente bloqueado</strong>.
              <br />
              Tente novamente mais tarde ou aguarde o tempo de bloqueio expirar.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

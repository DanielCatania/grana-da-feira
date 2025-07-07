import Box from "@/components/Box";
import Button from "@/components/Button";
import Link from "next/link";

export default function PurchaseIdPage() {
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
            <span>A</span> <span>8</span> <span>B</span> <span>H</span>
          </p>
        </Box>
        <Button>Gerar Outro ID de Compra</Button>
      </main>
    </div>
  );
}

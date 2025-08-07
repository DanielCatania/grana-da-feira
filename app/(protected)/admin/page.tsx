import Link from "next/link";
import Button from "@/components/Button";
import Donation from "./components/Donation";
import Header from "@/components/Header";

export default function Admin() {
  return (
    <div className="w-full min-h-screen flex-col flex items-center justify-center">
      <main className="w-2/5 min-w-72 flex flex-col items-center">
        <Header>
          <h3 className="text-4xl font-extrabold text-primary-150">ADMIN</h3>
        </Header>
        <Donation />
        <Button>
          <Link href="/admin/sales" className="block w-full h-full">
            Iniciar Modo de Venda
          </Link>
        </Button>
      </main>
    </div>
  );
}

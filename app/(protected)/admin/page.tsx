import Link from "next/link";
import Button from "@/components/Button";
import Donation from "./components/Donation";
import Header from "@/components/Header";

export default function Admin() {
  return (
    <>
      <Header>
        <h3 className="text-4xl font-extrabold text-primary-150">ADMIN</h3>
      </Header>
      <Button>
        <Link href="/admin/records" className="block w-full h-full">
          Visualizar Registros
        </Link>
      </Button>
      <Donation />
      <Button>
        <Link href="/admin/sales" className="block w-full h-full">
          Iniciar Modo de Venda
        </Link>
      </Button>
    </>
  );
}

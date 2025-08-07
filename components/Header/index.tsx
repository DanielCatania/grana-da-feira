import Image from "next/image";
import Link from "next/link";

export default function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex justify-between items-center text-xl w-full">
      <Link href="/login" className="w-1/5 min-w-16">
        <Image
          src="/Icon.png"
          alt="Ícone de notas de dinheiro voando."
          width={480}
          height={480}
        />
      </Link>
      {children}
    </header>
  );
}
